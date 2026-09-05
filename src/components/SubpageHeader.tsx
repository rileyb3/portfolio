import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Back-only sub-page header. The old Home link was redundant — the
// global Header's "Riley Byers" wordmark already goes home from
// anywhere — so it's gone, and the back arrow is bigger, wordless, and
// left-aligned to match the nav bar's own edge (px-4/sm:px-8) instead of
// the narrower article column below it.
export default function SubpageHeader({
  backHref = "/#disciplines",
}: {
  backHref?: string;
}) {
  return (
    <div className="px-4 pt-6 sm:px-8">
      <Link
        href={backHref}
        aria-label="Back"
        className="inline-flex text-muted transition hover:text-paper"
      >
        <ArrowLeft className="h-8 w-8" strokeWidth={1.5} />
      </Link>
    </div>
  );
}
