import { useState, useEffect } from "react";
import { MovieSearchResult } from "@/types/movie";
import { searchMovies } from "@/services/omdbApi";

interface UseMoviesResult {
  movies: MovieSearchResult[];
  isLoading: boolean;
  error: string;
}

export function useMovies(query: string): UseMoviesResult {
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
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

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
