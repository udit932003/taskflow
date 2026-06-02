"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { boardSchema, taskSchema } from "@/lib/validators";

export type Result = { ok: boolean; error?: string };

/* ---------------- Boards ---------------- */

export async function createBoard(formData: FormData): Promise<Result> {
  const parsed = boardSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    color: formData.get("color"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const board = await prisma.board.create({ data: parsed.data });
  revalidatePath("/boards");
  revalidatePath("/");
  redirect(`/boards/${board.id}`);
}

export async function updateBoard(id: string, formData: FormData): Promise<Result> {
  const parsed = boardSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    color: formData.get("color"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.board.update({ where: { id }, data: parsed.data });
  revalidatePath("/boards");
  revalidatePath(`/boards/${id}`);
  return { ok: true };
}

export async function deleteBoard(id: string): Promise<void> {
  await prisma.board.delete({ where: { id } });
  revalidatePath("/boards");
  redirect("/boards");
}

/* ---------------- Tasks ---------------- */

export async function createTask(formData: FormData): Promise<Result> {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    status: formData.get("status") || "TODO",
    priority: formData.get("priority") || "MEDIUM",
    dueDate: formData.get("dueDate") || undefined,
    boardId: formData.get("boardId"),
  };
  const parsed = taskSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const count = await prisma.task.count({
    where: { boardId: parsed.data.boardId, status: parsed.data.status },
  });

  await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      position: count,
      boardId: parsed.data.boardId,
    },
  });
  revalidatePath(`/boards/${parsed.data.boardId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function updateTask(id: string, formData: FormData): Promise<Result> {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    status: formData.get("status") || "TODO",
    priority: formData.get("priority") || "MEDIUM",
    dueDate: formData.get("dueDate") || undefined,
    boardId: formData.get("boardId"),
  };
  const parsed = taskSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.task.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
    },
  });
  revalidatePath(`/boards/${parsed.data.boardId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function moveTask(
  id: string,
  status: string,
  boardId: string
): Promise<Result> {
  const count = await prisma.task.count({ where: { boardId, status } });
  await prisma.task.update({
    where: { id },
    data: { status, position: count },
  });
  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteTask(id: string, boardId: string): Promise<Result> {
  await prisma.task.delete({ where: { id } });
  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/");
  return { ok: true };
}
