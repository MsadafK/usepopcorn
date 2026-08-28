"use client";

import Image from "next/image";
import { MovieSummary } from "@/types/movie";
import { backdropUrl } from "@/utils/tmdbImage";

interface HeroProps {
  movie: MovieSummary;
  onSelectMovie: (id: number) => void;
}

export default function Hero({ movie, onSelectMovie }: HeroProps) {
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "";

  return (
    <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden bg-surface sm:h-[55vh]">
      <Image
        src={backdropUrl(movie.backdropPath)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-6 sm:px-8 sm:pb-10">
        <p className="mb-2 text-xs font-medium tracking-wide text-brand-light">
          FEATURED THIS WEEK
        </p>
        <h1 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {movie.title}
        </h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
          {year && <span>{year}</span>}
          <span aria-hidden="true">&middot;</span>
          <span>⭐ {movie.voteAverage.toFixed(1)}</span>
        </p>
        <button
          onClick={() => onSelectMovie(movie.id)}
          className="mt-4 flex w-fit items-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          View details
        </button>
      </div>
    </div>
  );
}
