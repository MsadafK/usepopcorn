import { describe, it, expect } from "vitest";
import { toMovieSummary, toMovieDetails } from "../mappers";

describe("toMovieSummary", () => {
  it("maps TMDB's snake_case fields to the app's camelCase shape", () => {
    const raw = {
      id: 27205,
      title: "Inception",
      poster_path: "/abc.jpg",
      backdrop_path: "/def.jpg",
      release_date: "2010-07-15",
      vote_average: 8.4,
      overview: "A thief who steals corporate secrets...",
      genre_ids: [28, 878],
    };

    expect(toMovieSummary(raw)).toEqual({
      id: 27205,
      title: "Inception",
      posterPath: "/abc.jpg",
      backdropPath: "/def.jpg",
      releaseDate: "2010-07-15",
      voteAverage: 8.4,
      overview: "A thief who steals corporate secrets...",
      genreIds: [28, 878],
    });
  });

  it("defaults genreIds to an empty array when TMDB omits it", () => {
    const raw = {
      id: 1,
      title: "Test",
      poster_path: null,
      backdrop_path: null,
      release_date: "2020-01-01",
      vote_average: 5,
      overview: "",
    };
    expect(toMovieSummary(raw).genreIds).toEqual([]);
  });
});

describe("toMovieDetails", () => {
  const base = {
    id: 1,
    title: "Test Movie",
    tagline: "A tagline",
    overview: "An overview",
    poster_path: "/p.jpg",
    backdrop_path: "/b.jpg",
    release_date: "2020-01-01",
    runtime: 120,
    vote_average: 7.5,
    genres: [{ id: 28, name: "Action" }],
  };

  it("finds the YouTube trailer among the videos.results entries", () => {
    const raw = {
      ...base,
      videos: {
        results: [
          { site: "YouTube", type: "Teaser", key: "teaser123" },
          { site: "YouTube", type: "Trailer", key: "trailer456" },
        ],
      },
    };
    expect(toMovieDetails(raw).trailerKey).toBe("trailer456");
  });

  it("returns a null trailerKey when there's no matching trailer", () => {
    const raw = { ...base, videos: { results: [] } };
    expect(toMovieDetails(raw).trailerKey).toBeNull();
  });

  it("handles a completely missing videos field without throwing", () => {
    expect(() => toMovieDetails(base)).not.toThrow();
    expect(toMovieDetails(base).trailerKey).toBeNull();
  });
});
