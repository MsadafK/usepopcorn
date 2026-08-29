"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink px-4 text-center">
      <p className="text-4xl" aria-hidden="true">
        🍿
      </p>
      <h2 className="text-xl font-semibold text-white">
        Something went wrong
      </h2>
      <p className="max-w-sm text-sm text-zinc-400">
        Give it another shot, or come back in a bit.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white outline-none transition-colors hover:bg-brand-light focus-visible:ring-2 focus-visible:ring-brand-light"
      >
        Try again
      </button>
    </div>
  );
}
