import { MovieSummary, MovieDetails, Genre } from "@/types/movie";

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong while fetching movies");
  }
  return data as T;
}

export function searchMovies(query: string, signal: AbortSignal) {
  return getJson<MovieSummary[]>(
    `/api/movies/search?q=${encodeURIComponent(query)}`,
    signal
  );
}

export function fetchTrending() {
  return getJson<MovieSummary[]>("/api/movies/trending");
}

export function fetchTopRated() {
  return getJson<MovieSummary[]>("/api/movies/top-rated");
}

export function fetchGenres() {
  return getJson<Genre[]>("/api/movies/genres");
}

export function fetchMovieDetails(id: number) {
  return getJson<MovieDetails>(`/api/movies/${id}`);
}
