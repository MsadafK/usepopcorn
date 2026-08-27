import { useState, useEffect } from "react";
import { MovieSummary } from "@/types/movie";
import { searchMovies } from "@/services/tmdbApi";

interface UseMoviesResult {
  movies: MovieSummary[];
  isLoading: boolean;
  error: string;
}

export function useMovies(query: string): UseMoviesResult {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      if (query.length < 3) return;

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const results = await searchMovies(query, controller.signal);
          setMovies(results);
        } catch (err) {
          if (err instanceof Error && err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  // Derived instead of stored: avoids a synchronous setState-in-effect just
  // to clear results when the query drops below 3 characters.
  const effectiveMovies = query.length < 3 ? [] : movies;

  return { movies: effectiveMovies, isLoading, error };
}
