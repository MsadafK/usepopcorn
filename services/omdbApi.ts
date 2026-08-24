import { MovieSearchResult, MovieDetails } from "@/types/movie";

export async function searchMovies(
  query: string,
  signal: AbortSignal
): Promise<MovieSearchResult[]> {
  const res = await fetch(`/api/movies?s=${encodeURIComponent(query)}`, {
    signal,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong while fetching movies");
  }

  return data as MovieSearchResult[];
}

export async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const res = await fetch(`/api/movies/${id}`);
  const data = await res.json();
  return data as MovieDetails;
}
