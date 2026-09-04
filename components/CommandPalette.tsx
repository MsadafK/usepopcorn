"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import { useMovies } from "@/hooks/useMovies";
import { posterUrl } from "@/utils/tmdbImage";

interface CommandPaletteProps {
  onClose: () => void;
  onSelectMovie: (id: number) => void;
}

// Rendered only while open (parent conditionally mounts it), so every
// open is a fresh mount with fresh state - no reset-on-open effect needed.
export default function CommandPalette({
  onClose,
  onSelectMovie,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { movies, isLoading } = useMovies(query);

  // Focusing an existing DOM node imperatively - not a setState call, so
  // this one's a genuine effect use case, not the lint rule's target.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Clamped at read-time instead of reset via an effect whenever `movies`
  // changes - keeps highlightedIndex valid without an extra render pass.
  const safeIndex =
    movies.length === 0 ? 0 : Math.min(highlightedIndex, movies.length - 1);

  function selectAndClose(id: number) {
    onSelectMovie(id);
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(Math.min(safeIndex + 1, movies.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(Math.max(safeIndex - 1, 0));
    } else if (e.key === "Enter" && movies[safeIndex]) {
      selectAndClose(movies[safeIndex].id);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center bg-black/70 px-4 pt-[6vh] sm:pt-[12vh]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick search"
        className="w-full max-w-lg overflow-hidden rounded-lg bg-surface-raised shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-zinc-700 px-4 py-3">
          <span aria-hidden="true" className="text-zinc-400">
            🔍
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(0);
            }}
            placeholder="Search for any movie..."
            aria-label="Search for a movie"
            className="min-w-0 flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
          />
          <kbd className="shrink-0 rounded border border-zinc-600 px-1.5 py-0.5 text-xs text-zinc-400">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {isLoading && (
            <p className="px-4 py-6 text-center text-sm text-zinc-400">
              Searching...
            </p>
          )}

          {!isLoading && query.trim().length >= 3 && movies.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-zinc-400">
              No movies found.
            </p>
          )}

          {!isLoading && query.trim().length > 0 && query.trim().length < 3 && (
            <p className="px-4 py-6 text-center text-sm text-zinc-500">
              Keep typing...
            </p>
          )}

          {movies.map((movie, i) => (
            <button
              key={movie.id}
              onClick={() => selectAndClose(movie.id)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left ${
                i === safeIndex ? "bg-brand/20" : ""
              }`}
            >
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-surface">
                <Image
                  src={posterUrl(movie.posterPath, "w185")}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-white">{movie.title}</p>
                <p className="text-xs text-zinc-400">
                  {movie.releaseDate ? movie.releaseDate.slice(0, 4) : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}