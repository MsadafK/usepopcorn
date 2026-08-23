// Shape returned by OMDb's search endpoint (s=) — one entry per result
export interface MovieSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type?: string;
}

// Shape returned by OMDb's full-details endpoint (i=)
export interface MovieDetails {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Runtime: string;
  imdbRating: string;
  Plot: string;
  Released: string;
  Actors: string;
  Director: string;
  Genre: string;
}

// Shape of an item saved to the user's local "watched" list
export interface WatchedMovie {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  imdbRating: number;
  runtime: number;
  userRating: number;
  countRatingDecisions: number;
}
