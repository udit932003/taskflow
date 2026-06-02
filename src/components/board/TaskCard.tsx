"use client";

import { useTransition } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { moveTask } from "@/app/actions";
import { priorityMeta, STATUS_KEYS } from "@/lib/constants";
import { formatDue, cn } from "@/lib/utils";
import type { EditableTask } from "./TaskModal";

type Props = {
  task: EditableTask & { boardId: string };
  onEdit: () => void;
};

export default function TaskCard({ task, onEdit }: Props) {
  const [pending, startTransition] = useTransition();
  const pm = priorityMeta(task.priority);
  const due = formatDue(task.dueDate);
  const idx = STATUS_KEYS.indexOf(task.status);

  function move(dir: -1 | 1) {
    const next = STATUS_KEYS[idx + dir];
    if (!next) return;
    startTransition(() => {
      moveTask(task.id, next, task.boardId);
    });
  }

  return (
    <div className={cn("card border-l-4 p-3 transition-shadow hover:shadow-md", pm.border, pending && "opacity-50")}>
      <button onClick={onEdit} className="block w-full text-left">
        <p className="text-sm font-semibold text-slate-800">{task.title}</p>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{task.description}</p>
        )}
      </button>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${pm.color}`}>
            {pm.label}
          </span>
          {due && (
            <span className={cn("flex items-center gap-1 text-[11px] font-medium", due.overdue ? "text-red-600" : "text-slate-400")}>
              <CalendarDays size={12} /> {due.label}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <button onClick={() => move(-1)} disabled={idx === 0 || pending} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30" title="Move left">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => move(1)} disabled={idx === STATUS_KEYS.length - 1 || pending} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30" title="Move right">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
