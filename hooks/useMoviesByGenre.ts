import { useState, useEffect } from "react";
import { MovieSummary } from "@/types/movie";
import { fetchByGenre } from "@/services/tmdbApi";

interface UseMoviesByGenreResult {
  movies: MovieSummary[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  error: string;
}

export function useMoviesByGenre(
  genreId: number | null
): UseMoviesByGenreResult {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // Fresh load whenever the genre itself changes
  useEffect(() => {
    if (genreId === null) return;

    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchByGenre(genreId as number, 1);
        if (!cancelled) {
          setMovies(data.results);
          setPage(data.page);
          setHasMore(data.page < data.totalPages);
        }
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

  async function loadMore() {
    if (genreId === null || isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchByGenre(genreId, nextPage);
      setMovies((prev) => [...prev, ...data.results]);
      setPage(data.page);
      setHasMore(data.page < data.totalPages);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }

  return {
    movies: genreId === null ? [] : movies,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
  };
}
