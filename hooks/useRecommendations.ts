import { useState, useEffect } from "react";
import { MovieSummary } from "@/types/movie";
import { fetchRecommendations } from "@/services/tmdbApi";

interface UseRecommendationsResult {
  movies: MovieSummary[];
  isLoading: boolean;
}

export function useRecommendations(
  basedOnMovieId: number | null
): UseRecommendationsResult {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (basedOnMovieId === null) return;

    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        const data = await fetchRecommendations(basedOnMovieId as number);
        if (!cancelled) setMovies(data);
      } catch (err) {
        if (!cancelled) console.error(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [basedOnMovieId]);

  return {
    movies: basedOnMovieId === null ? [] : movies,
    isLoading,
  };
}
