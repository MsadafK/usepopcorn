import { useState, useEffect } from "react";
import { MovieSummary } from "@/types/movie";
import { fetchByGenre } from "@/services/tmdbApi";

interface UseMoviesByGenreResult {
  movies: MovieSummary[];
  isLoading: boolean;
  error: string;
}

export function useMoviesByGenre(
  genreId: number | null
): UseMoviesByGenreResult {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (genreId === null) return;

    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchByGenre(genreId as number);
        if (!cancelled) setMovies(data);
      } catch (err) {
        if (!cancelled && err instanceof Error) {
          console.error(err.message);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [genreId]);

  return {
    movies: genreId === null ? [] : movies,
    isLoading,
    error,
  };
}
