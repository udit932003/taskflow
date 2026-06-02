"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, KanbanSquare, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/boards", label: "Boards", icon: KanbanSquare, exact: false },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
          <CheckCircle2 size={20} />
        </span>
        <span className="text-lg font-extrabold text-slate-900">
          Task<span className="text-brand-600">Flow</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <l.icon size={18} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4 text-xs text-slate-400">
        TaskFlow · Portfolio demo<br />
        Next.js + Prisma + SQLite
      </div>
    </aside>
  );
}
