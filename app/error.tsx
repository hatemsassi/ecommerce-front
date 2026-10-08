"use client";

import { useEffect } from "react";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">The store is temporarily unavailable. Please try again.</p>
      <button type="button" onClick={() => retry()} className="button-primary mt-6">
        Try again
      </button>
    </div>
  );
}
