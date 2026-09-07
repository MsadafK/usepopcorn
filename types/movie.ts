// Normalized to camelCase at the API boundary — TMDB's raw responses use
// snake_case (poster_path, vote_average, etc), converted once in the route
// handlers so the rest of the app never deals with that.

export interface MovieSummary {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  overview: string;
  genreIds: number[];
}

export interface MovieDetails {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  runtime: number;
  voteAverage: number;
  genres: { id: number; name: string }[];
  trailerKey: string | null;
  director: string | null;
  cast: string[];
}

export interface WatchedMovie {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  runtime: number;
  userRating: number;
  countRatingDecisions: number;
}

export interface Genre {
  id: number;
  name: string;
}