"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { STATUSES } from "@/lib/constants";
import { deleteBoard } from "@/app/actions";
import TaskCard from "./TaskCard";
import TaskModal, { EditableTask } from "./TaskModal";

type Task = EditableTask & { boardId: string; position: number };

type Board = {
  id: string;
  name: string;
  description: string | null;
  color: string;
};

export default function BoardView({ board, tasks }: { board: Board; tasks: Task[] }) {
  const [modal, setModal] = useState<
    { mode: "new"; status: string } | { mode: "edit"; task: Task } | null
  >(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const byStatus = (s: string) =>
    tasks.filter((t) => t.status === s).sort((a, b) => a.position - b.position);

  async function handleDeleteBoard() {
    setDeleting(true);
    await deleteBoard(board.id);
  }

  return (
    <div className="p-6 lg:p-8">
      <Link href="/boards" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft size={16} /> Back to boards
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-9 w-1.5 rounded-full" style={{ background: board.color }} />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{board.name}</h1>
            {board.description && <p className="text-sm text-slate-500">{board.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {confirmDelete ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Delete this board?</span>
              <button onClick={handleDeleteBoard} disabled={deleting} className="btn bg-red-600 text-white hover:bg-red-700">
                {deleting ? <Loader2 size={16} className="animate-spin" /> : "Yes, delete"}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="btn-ghost">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="btn-outline text-red-600">
              <Trash2 size={16} /> Delete board
            </button>
          )}
        </div>
      </header>

      {/* Kanban columns */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {STATUSES.map((col) => {
          const colTasks = byStatus(col.key);
          return (
            <div key={col.key} className="rounded-xl bg-slate-100/70 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                  <h2 className="text-sm font-semibold text-slate-700">{col.label}</h2>
                  <span className="rounded-full bg-white px-2 text-xs font-semibold text-slate-500">{colTasks.length}</span>
                </div>
                <button onClick={() => setModal({ mode: "new", status: col.key })} className="rounded p-1 text-slate-400 hover:bg-white hover:text-brand-600" title="Add task">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {colTasks.map((t) => (
                  <TaskCard key={t.id} task={t} onEdit={() => setModal({ mode: "edit", task: t })} />
                ))}
                {colTasks.length === 0 && (
                  <button onClick={() => setModal({ mode: "new", status: col.key })} className="w-full rounded-lg border-2 border-dashed border-slate-200 py-6 text-xs text-slate-400 hover:border-brand-300 hover:text-brand-600">
                    + Add a task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <TaskModal
          boardId={board.id}
          task={modal.mode === "edit" ? modal.task : undefined}
          defaultStatus={modal.mode === "new" ? modal.status : undefined}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
