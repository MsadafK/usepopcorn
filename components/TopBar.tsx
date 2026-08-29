"use client";

interface TopBarProps {
  onOpenPalette: () => void;
}

export default function TopBar({ onOpenPalette }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 bg-ink/90 px-4 py-3 backdrop-blur-sm sm:px-8">
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xl">🍿</span>
        <span className="text-lg font-bold tracking-tight text-white">
          usePopcorn
        </span>
      </div>
      <button
        onClick={onOpenPalette}
        className="ml-auto flex w-full max-w-xs items-center justify-between gap-2 rounded-full border border-zinc-700 bg-surface px-4 py-2 text-sm text-zinc-400 outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">🔍</span>
          Search movies...
        </span>
        <kbd className="hidden shrink-0 rounded border border-zinc-600 px-1.5 py-0.5 text-xs sm:inline">
          ⌘K
        </kbd>
      </button>
    </header>
  );
}
