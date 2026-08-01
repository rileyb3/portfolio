import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function SubpageHeader({
  backHref = "/#disciplines",
  backLabel = "Back",
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-paper"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        {backLabel}
      </Link>
      {backHref !== "/" && (
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-paper"
        >
          <Home className="h-4 w-4" strokeWidth={1.5} />
          Home
        </Link>
      )}
    </div>
  );
}
