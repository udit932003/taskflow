import Link from "next/link";
import {
  LayoutGrid,
  ListTodo,
  Loader,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { statusMeta, priorityMeta, STATUSES } from "@/lib/constants";
import { formatDue } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [boards, tasks] = await Promise.all([
    prisma.board.findMany({
      include: { _count: { select: { tasks: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.task.findMany({ include: { board: true } }),
  ]);

  const byStatus = (s: string) => tasks.filter((t) => t.status === s).length;
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
  );
  const upcoming = tasks
    .filter((t) => t.dueDate && t.status !== "DONE")
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  const total = tasks.length;
  const done = byStatus("DONE");
  const progress = total ? Math.round((done / total) * 100) : 0;

  const stats = [
    { label: "Total Tasks", value: total, icon: ListTodo, tint: "bg-brand-50 text-brand-600" },
    { label: "In Progress", value: byStatus("IN_PROGRESS"), icon: Loader, tint: "bg-blue-50 text-blue-600" },
    { label: "Completed", value: done, icon: CheckCircle2, tint: "bg-green-50 text-green-600" },
    { label: "Overdue", value: overdue.length, icon: AlertTriangle, tint: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Your workspace overview</p>
        </div>
        <Link href="/boards" className="btn-primary">
          <LayoutGrid size={18} /> View boards
        </Link>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <span className={`grid h-10 w-10 place-items-center rounded-lg ${s.tint}`}>
              <s.icon size={20} />
            </span>
            <p className="mt-4 text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress + distribution */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Overall progress</h2>
            <span className="text-sm font-semibold text-brand-600">{progress}% done</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {STATUSES.map((s) => (
              <div key={s.key} className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{byStatus(s.key)}</p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Upcoming deadlines</h2>
          <ul className="mt-4 space-y-3">
            {upcoming.length === 0 && <li className="text-sm text-slate-400">No upcoming deadlines 🎉</li>}
            {upcoming.map((t) => {
              const due = formatDue(t.dueDate);
              const pm = priorityMeta(t.priority);
              return (
                <li key={t.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">{t.title}</p>
                    <p className="truncate text-xs text-slate-400">{t.board.name}</p>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${due?.overdue ? "bg-red-100 text-red-700" : pm.color}`}>
                    {due?.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Boards */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your boards</h2>
          <Link href="/boards" className="flex items-center gap-1 text-sm font-semibold text-brand-600">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b) => (
            <Link key={b.id} href={`/boards/${b.id}`} className="card group p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="h-8 w-1.5 rounded-full" style={{ background: b.color }} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 group-hover:text-brand-700">{b.name}</p>
                  <p className="truncate text-xs text-slate-400">{b._count.tasks} tasks</p>
                </div>
              </div>
              {b.description && <p className="mt-3 line-clamp-2 text-sm text-slate-500">{b.description}</p>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
