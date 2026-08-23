import { MovieSearchResult, MovieDetails } from "../types/movie";

const KEY = process.env.REACT_APP_OMDB_KEY;
const BASE_URL = "https://www.omdbapi.com/";

interface OMDbSearchResponse {
  Search: MovieSearchResult[];
  totalResults: string;
  Response: "True" | "False";
  Error?: string;
}

export async function searchMovies(
  query: string,
  signal: AbortSignal
): Promise<MovieSearchResult[]> {
  const res = await fetch(`${BASE_URL}?apikey=${KEY}&s=${query}`, {
    signal,
  });

  if (!res.ok) {
    throw new Error("Something went wrong while fetching movies");
  }

  const data: OMDbSearchResponse = await res.json();

  // OMDb returns Response as "True" / "False" (capitalized) — not "true" / "false"
  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found");
  }

  return data.Search;
}

export async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const res = await fetch(`${BASE_URL}?apikey=${KEY}&i=${id}`);
  const data: MovieDetails = await res.json();
  return data;
}
