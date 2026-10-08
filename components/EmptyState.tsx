import Link from "next/link";

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
      <h2 className="text-lg font-semibold">{title}</h2>
      {message && <p className="mt-2 text-zinc-600 dark:text-zinc-400">{message}</p>}
      {action && (
        <Link href={action.href} className="button-primary mt-6 inline-block">
          {action.label}
        </Link>
      )}
    </div>
  );
}
