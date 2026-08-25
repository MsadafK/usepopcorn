import { useState, useEffect } from "react";
import { MovieSummary } from "@/types/movie";

interface UseMovieListResult {
  movies: MovieSummary[];
  isLoading: boolean;
  error: string;
}

export function useMovieList(
  fetcher: () => Promise<MovieSummary[]>
): UseMovieListResult {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        const data = await fetcher();
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
    // fetcher is a stable module-level function reference (fetchTrending /
    // fetchTopRated) — safe to omit from deps since it never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { movies, isLoading, error };
}
