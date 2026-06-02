import { z } from "zod";
import { STATUS_KEYS, PRIORITY_KEYS } from "./constants";

export const boardSchema = z.object({
  name: z.string().min(2, "Board name is too short"),
  description: z.string().optional(),
  color: z.string().min(4),
});

export const taskSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().optional(),
  status: z.enum(STATUS_KEYS as [string, ...string[]]),
  priority: z.enum(PRIORITY_KEYS as [string, ...string[]]),
  dueDate: z.string().optional(),
  boardId: z.string().min(1),
});
