"use client";

import { posterUrl } from "@/utils/tmdbImage";

interface PosterCardProps {
  movie: { id: number; title: string; posterPath: string | null };
  onSelectMovie: (id: number) => void;
}

export default function PosterCard({ movie, onSelectMovie }: PosterCardProps) {
  return (
    <button
      onClick={() => onSelectMovie(movie.id)}
      className="group w-full text-left"
    >
      <div className="overflow-hidden rounded-md bg-surface">
        <img
          src={posterUrl(movie.posterPath)}
          alt={`${movie.title} poster`}
          className="aspect-[2/3] w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
        />
      </div>
      <p className="mt-1.5 line-clamp-1 text-sm text-zinc-300 group-hover:text-white">
        {movie.title}
      </p>
    </button>
  );
}
