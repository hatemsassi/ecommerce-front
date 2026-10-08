import Link from "next/link";

/** `page` is 1-based. */
export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4 text-sm">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="button-secondary">
          Previous
        </Link>
      ) : (
        <span className="button-secondary opacity-40">Previous</span>
      )}
      <span className="tabular-nums text-zinc-600 dark:text-zinc-400">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="button-secondary">
          Next
        </Link>
      ) : (
        <span className="button-secondary opacity-40">Next</span>
      )}
    </nav>
  );
}
