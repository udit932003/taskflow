export const STATUSES = [
  { key: "TODO", label: "To Do", color: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  { key: "IN_PROGRESS", label: "In Progress", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  { key: "DONE", label: "Done", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
] as const;

export const PRIORITIES = [
  { key: "LOW", label: "Low", color: "bg-slate-100 text-slate-600", border: "border-l-slate-300" },
  { key: "MEDIUM", label: "Medium", color: "bg-amber-100 text-amber-700", border: "border-l-amber-400" },
  { key: "HIGH", label: "High", color: "bg-red-100 text-red-700", border: "border-l-red-500" },
] as const;

export const STATUS_KEYS: string[] = STATUSES.map((s) => s.key);
export const PRIORITY_KEYS: string[] = PRIORITIES.map((p) => p.key);

export function statusMeta(key: string) {
  return STATUSES.find((s) => s.key === key) ?? STATUSES[0];
}
export function priorityMeta(key: string) {
  return PRIORITIES.find((p) => p.key === key) ?? PRIORITIES[1];
}

export const BOARD_COLORS = [
  "#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6", "#ef4444",
];
