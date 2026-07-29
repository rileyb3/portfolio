import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SubpageHeader() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-paper"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back
      </Link>
    </div>
  );
}
