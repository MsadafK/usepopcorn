import { describe, it, expect } from "vitest";
import { computeWatchlistStats, formatWatchTime } from "../watchlistStats";
import { WatchedMovie } from "@/types/movie";

const movie = (over: Partial<WatchedMovie>): WatchedMovie => ({
  id: 1,
  title: "T",
  posterPath: null,
  releaseDate: "2020-01-01",
  voteAverage: 7,
  runtime: 100,
  userRating: 8,
  countRatingDecisions: 1,
  ...over,
});

describe("computeWatchlistStats", () => {
  it("returns zeros for an empty watchlist (no NaN)", () => {
    expect(computeWatchlistStats([])).toEqual({
      count: 0,
      avgUserRating: 0,
      avgVoteAverage: 0,
      totalMinutes: 0,
    });
  });

  it("averages ratings and sums runtime", () => {
    const stats = computeWatchlistStats([
      movie({ id: 1, userRating: 10, voteAverage: 8, runtime: 90 }),
      movie({ id: 2, userRating: 6, voteAverage: 6, runtime: 120 }),
    ]);
    expect(stats.count).toBe(2);
    expect(stats.avgUserRating).toBe(8);
    expect(stats.avgVoteAverage).toBe(7);
    expect(stats.totalMinutes).toBe(210);
  });
});

describe("formatWatchTime", () => {
  it("formats minutes, hours, and both", () => {
    expect(formatWatchTime(45)).toBe("45m");
    expect(formatWatchTime(120)).toBe("2h");
    expect(formatWatchTime(150)).toBe("2h 30m");
    expect(formatWatchTime(0)).toBe("0m");
  });
});