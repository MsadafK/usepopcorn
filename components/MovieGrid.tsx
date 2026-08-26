"use client";

import { MovieSummary } from "@/types/movie";
import PosterCard from "./PosterCard";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

interface MovieGridProps {
  heading: string;
  movies: MovieSummary[];
  isLoading: boolean;
  error: string;
  onSelectMovie: (id: number) => void;
}

export default function MovieGrid({
  heading,
  movies,
  isLoading,
  error,
  onSelectMovie,
}: MovieGridProps) {
  return (
    <div className="px-4 py-6 sm:px-8">
      <h2 className="mb-4 text-lg font-semibold text-white">{heading}</h2>

      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && movies.length === 0 && (
        <p className="text-sm text-zinc-400">No movies found.</p>
      )}

      {!isLoading && !error && movies.length > 0 && (
        <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5 md:grid-cols-6">
          {movies.map((movie) => (
            <PosterCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
            />
          ))}
        </div>
      )}
    </div>
  );
}
