"use client";

import PosterCard from "./PosterCard";
import Loader from "./Loader";

interface RowProps {
  title: string;
  movies: { id: number; title: string; posterPath: string | null }[];
  onSelectMovie: (id: number) => void;
  isLoading?: boolean;
}

export default function Row({
  title,
  movies,
  onSelectMovie,
  isLoading,
}: RowProps) {
  if (!isLoading && movies.length === 0) return null;

  return (
    <section className="mt-8 first:mt-0">
      <h2 className="mb-3 px-4 text-lg font-semibold text-white sm:px-8">
        {title}
      </h2>
      {isLoading ? (
        <div className="px-4 sm:px-8">
          <Loader />
        </div>
      ) : (
        <div className="row-scroll flex gap-3 overflow-x-auto px-4 pb-2 sm:px-8">
          {movies.map((movie) => (
            <div key={movie.id} className="w-[130px] shrink-0 sm:w-[160px]">
              <PosterCard movie={movie} onSelectMovie={onSelectMovie} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
