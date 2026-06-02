"use client";

import { useState } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
import { createTask, updateTask, deleteTask } from "@/app/actions";
import { STATUSES, PRIORITIES } from "@/lib/constants";

export type EditableTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | string | null;
};

type Props = {
  boardId: string;
  task?: EditableTask;
  defaultStatus?: string;
  onClose: () => void;
};

function toDateInput(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default function TaskModal({ boardId, task, defaultStatus, onClose }: Props) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function action(formData: FormData) {
    setError("");
    setSaving(true);
    formData.set("boardId", boardId);
    const res = task ? await updateTask(task.id, formData) : await createTask(formData);
    if (res.ok) {
      onClose();
    } else {
      setError(res.error || "Failed to save");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!task) return;
    setDeleting(true);
    await deleteTask(task.id, boardId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{task ? "Edit task" : "New task"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <form action={action} className="mt-4 space-y-4">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div>
            <label className="label">Title</label>
            <input name="title" required defaultValue={task?.title} className="input" placeholder="What needs to be done?" autoFocus />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" rows={3} defaultValue={task?.description ?? ""} className="input resize-none" placeholder="Add more detail..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select name="status" defaultValue={task?.status ?? defaultStatus ?? "TODO"} className="input">
                {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select name="priority" defaultValue={task?.priority ?? "MEDIUM"} className="input">
                {PRIORITIES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Due date</label>
            <input name="dueDate" type="date" defaultValue={toDateInput(task?.dueDate)} className="input" />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button type="submit" disabled={saving || deleting} className="btn-primary flex-1">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : task ? "Save changes" : "Create task"}
            </button>
            {task && (
              <button type="button" onClick={handleDelete} disabled={deleting} className="btn border border-red-200 text-red-600 hover:bg-red-50">
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
