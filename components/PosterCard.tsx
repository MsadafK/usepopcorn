"use client";

import Image from "next/image";
import { posterUrl } from "@/utils/tmdbImage";

interface PosterCardProps {
  movie: { id: number; title: string; posterPath: string | null };
  onSelectMovie: (id: number) => void;
  rank?: number;
}

export default function PosterCard({
  movie,
  onSelectMovie,
  rank,
}: PosterCardProps) {
  return (
    <button
      onClick={() => onSelectMovie(movie.id)}
      className="group w-full rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-surface">
        <Image
          src={posterUrl(movie.posterPath)}
          alt=""
          fill
          sizes="(max-width: 640px) 130px, 160px"
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-105"
        />
        {rank && (
          <div
            aria-hidden="true"
            className="absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-lg"
          >
            {rank}
          </div>
        )}
      </div>
      <p className="mt-1.5 line-clamp-1 text-sm text-zinc-300 group-hover:text-white">
        {movie.title}
      </p>
    </button>
  );
}