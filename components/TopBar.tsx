"use client";

import { useRef, Dispatch, SetStateAction } from "react";
import { useKey } from "@/hooks/useKey";

interface TopBarProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

export default function TopBar({ query, setQuery }: TopBarProps) {
  const inputEl = useRef<HTMLInputElement>(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current?.focus();
  });

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 bg-ink/90 px-4 py-3 backdrop-blur-sm sm:px-8">
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xl">🍿</span>
        <span className="text-lg font-bold tracking-tight text-white">
          usePopcorn
        </span>
      </div>
      <input
        ref={inputEl}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="ml-auto w-full max-w-xs rounded-full border border-zinc-700 bg-surface px-4 py-1.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand"
      />
    </header>
  );
}
