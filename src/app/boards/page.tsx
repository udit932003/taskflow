import Link from "next/link";
import { Plus, KanbanSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BoardsPage() {
  const boards = await prisma.board.findMany({
    include: { tasks: { select: { status: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Boards</h1>
          <p className="mt-1 text-sm text-slate-500">{boards.length} boards</p>
        </div>
        <Link href="/boards/new" className="btn-primary">
          <Plus size={18} /> New board
        </Link>
      </header>

      {boards.length === 0 ? (
        <div className="card mt-8 grid place-items-center p-16 text-center">
          <KanbanSquare size={40} className="text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-700">No boards yet</p>
          <p className="mt-1 text-sm text-slate-500">Create your first board to start organizing tasks.</p>
          <Link href="/boards/new" className="btn-primary mt-4">
            <Plus size={18} /> Create board
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b) => {
            const done = b.tasks.filter((t) => t.status === "DONE").length;
            const pct = b.tasks.length ? Math.round((done / b.tasks.length) * 100) : 0;
            return (
              <Link key={b.id} href={`/boards/${b.id}`} className="card group p-5 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-1.5 rounded-full" style={{ background: b.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900 group-hover:text-brand-700">{b.name}</p>
                    <p className="text-xs text-slate-400">{b.tasks.length} tasks · {done} done</p>
                  </div>
                </div>
                {b.description && <p className="mt-3 line-clamp-2 text-sm text-slate-500">{b.description}</p>}
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: b.color }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
