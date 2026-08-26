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
    <div className="row-scroll flex gap-2 overflow-x-auto px-4 pb-4 pt-1 sm:px-8">
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelectGenre(selectedGenre === g.id ? null : g.id)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
            selectedGenre === g.id
              ? "bg-brand text-white"
              : "bg-surface text-zinc-300 hover:bg-surface-raised"
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
