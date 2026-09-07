"use client";

import PosterCard from "./PosterCard";
import Skeleton from "./Skeleton";

interface RowProps {
  title: string;
  movies: { id: number; title: string; posterPath: string | null }[];
  onSelectMovie: (id: number) => void;
  isLoading?: boolean;
  showRank?: boolean;
}

export default function Row({
  title,
  movies,
  onSelectMovie,
  isLoading,
  showRank,
}: RowProps) {
  if (!isLoading && movies.length === 0) return null;

  return (
    <section className="mt-8 first:mt-0">
      <h2 className="mb-3 px-4 text-lg font-semibold text-white sm:px-8">
        {title}
      </h2>
      {isLoading ? (
        <div className="flex gap-3 overflow-x-hidden px-4 sm:px-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[130px] shrink-0 sm:w-[160px]">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="mt-1.5 h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* Edge fades hint that the row scrolls - subtle, not a hard cutoff */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-ink to-transparent sm:w-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-ink to-transparent sm:w-10" />

          <div
            className="row-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:px-8"
            role="group"
            aria-label={title}
          >
            {movies.map((movie, i) => (
              <div
                key={movie.id}
                className="w-[130px] shrink-0 snap-start sm:w-[160px] animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
              >
                <PosterCard
                  movie={movie}
                  onSelectMovie={onSelectMovie}
                  rank={showRank ? i + 1 : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}