"use client";

import { Genre } from "@/types/movie";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: number | null;
  onSelectGenre: (id: number | null) => void;
}

export default function GenreFilter({
  genres,
  selectedGenre,
  onSelectGenre,
}: GenreFilterProps) {
  if (genres.length === 0) return null;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 bottom-4 left-0 z-10 w-6 bg-gradient-to-r from-ink to-transparent sm:w-10" />
      <div className="pointer-events-none absolute inset-y-0 bottom-4 right-0 z-10 w-6 bg-gradient-to-l from-ink to-transparent sm:w-10" />

      <div className="row-scroll flex gap-2 overflow-x-auto px-4 pb-4 pt-1 sm:px-8">
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => onSelectGenre(selectedGenre === g.id ? null : g.id)}
            aria-pressed={selectedGenre === g.id}
            className={`shrink-0 rounded-full px-4 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-light ${
              selectedGenre === g.id
                ? "bg-brand text-white"
                : "bg-surface text-zinc-300 hover:bg-surface-raised"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>
    </div>
  );
}