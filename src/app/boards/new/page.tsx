import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BoardForm from "@/components/BoardForm";

export default function NewBoardPage() {
  return (
    <div className="mx-auto max-w-lg p-6 lg:p-8">
      <Link href="/boards" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft size={16} /> Back to boards
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Create a new board</h1>
      <BoardForm />
    </div>
  );
}
