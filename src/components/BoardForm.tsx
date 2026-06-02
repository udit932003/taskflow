"use client";

import { useState } from "react";
import { createBoard } from "@/app/actions";
import { BOARD_COLORS } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export default function BoardForm() {
  const [color, setColor] = useState(BOARD_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function action(formData: FormData) {
    setError("");
    setSaving(true);
    formData.set("color", color);
    const res = await createBoard(formData);
    // createBoard redirects on success; if we get here it failed
    if (res && !res.ok) {
      setError(res.error || "Failed to create board");
      setSaving(false);
    }
  }

  return (
    <form action={action} className="card space-y-4 p-6">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div>
        <label className="label">Board name</label>
        <input name="name" required className="input" placeholder="Website Redesign" autoFocus />
      </div>
      <div>
        <label className="label">Description (optional)</label>
        <textarea name="description" rows={3} className="input resize-none" placeholder="What is this board about?" />
      </div>
      <div>
        <label className="label">Color</label>
        <div className="flex gap-2">
          {BOARD_COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full transition-transform ${color === c ? "scale-110 ring-2 ring-offset-2 ring-slate-400" : ""}`}
              style={{ background: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>
      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : "Create board"}
      </button>
    </form>
  );
}
