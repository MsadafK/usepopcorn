import { describe, it, expect } from "vitest";
import { sortWatchlist, isWatchlistSort } from "../sortWatchlist";
import { WatchedMovie } from "@/types/movie";

const movie = (over: Partial<WatchedMovie>): WatchedMovie => ({
  id: 1,
  title: "T",
  posterPath: null,
  releaseDate: "2020-01-01",
  voteAverage: 7,
  runtime: 100,
  userRating: 5,
  countRatingDecisions: 1,
  ...over,
});

// Stored order is oldest -> newest (new movies are appended)
const list = [
  movie({ id: 1, title: "Bravo", userRating: 6, voteAverage: 8, runtime: 90 }),
  movie({ id: 2, title: "alpha", userRating: 9, voteAverage: 6, runtime: 150 }),
  movie({ id: 3, title: "Charlie", userRating: 9, voteAverage: 7, runtime: 120 }),
];
const ids = (movies: WatchedMovie[]) => movies.map((m) => m.id);

describe("sortWatchlist", () => {
  it("recent: newest first (reverse of stored order)", () => {
    expect(ids(sortWatchlist(list, "recent"))).toEqual([3, 2, 1]);
  });

  it("yourRating: highest first, ties keep newest first", () => {
    // 2 and 3 are tied at 9 - 3 was added later, so it comes first
    expect(ids(sortWatchlist(list, "yourRating"))).toEqual([3, 2, 1]);
  });

  it("tmdbRating: highest first", () => {
    expect(ids(sortWatchlist(list, "tmdbRating"))).toEqual([1, 3, 2]);
  });

  it("runtime: longest first", () => {
    expect(ids(sortWatchlist(list, "runtime"))).toEqual([2, 3, 1]);
  });

  it("title: A-Z, case-insensitive-ish via localeCompare", () => {
    expect(ids(sortWatchlist(list, "title"))).toEqual([2, 1, 3]);
  });

  it("does not mutate the input array", () => {
    const copy = [...list];
    sortWatchlist(list, "title");
    expect(list).toEqual(copy);
  });

  it("handles an empty watchlist", () => {
    expect(sortWatchlist([], "runtime")).toEqual([]);
  });
});

describe("isWatchlistSort", () => {
  it("accepts known values and rejects everything else", () => {
    expect(isWatchlistSort("runtime")).toBe(true);
    expect(isWatchlistSort("nope")).toBe(false);
    expect(isWatchlistSort(null)).toBe(false);
    expect(isWatchlistSort(42)).toBe(false);
  });
});