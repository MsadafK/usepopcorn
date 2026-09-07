import { MovieSummary, MovieDetails } from "@/types/movie";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function toMovieSummary(raw: any): MovieSummary {
  return {
    id: raw.id,
    title: raw.title,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date,
    voteAverage: raw.vote_average,
    overview: raw.overview,
    genreIds: raw.genre_ids ?? [],
  };
}

export function toMovieDetails(raw: any): MovieDetails {
  const trailer = raw.videos?.results?.find(
    (v: any) => v.site === "YouTube" && v.type === "Trailer"
  );

  const director =
    raw.credits?.crew?.find((c: any) => c.job === "Director")?.name ?? null;

  const cast = (raw.credits?.cast ?? [])
    .slice(0, 5)
    .map((c: any) => c.name);

  return {
    id: raw.id,
    title: raw.title,
    tagline: raw.tagline,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date,
    runtime: raw.runtime,
    voteAverage: raw.vote_average,
    genres: raw.genres ?? [],
    trailerKey: trailer?.key ?? null,
    director,
    cast,
  };
}