import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BoardView from "@/components/board/BoardView";

export const dynamic = "force-dynamic";

export default async function BoardDetailPage({ params }: { params: { id: string } }) {
  const board = await prisma.board.findUnique({
    where: { id: params.id },
    include: { tasks: { orderBy: { position: "asc" } } },
  });

  if (!board) notFound();

  const { tasks, ...boardData } = board;

  return <BoardView board={boardData} tasks={tasks} />;
}
