import { WatchedMovie } from "@/types/movie";

export interface WatchlistStats {
  count: number;
  avgUserRating: number;
  avgVoteAverage: number;
  totalMinutes: number;
}

const average = (nums: number[]) =>
  nums.length === 0 ? 0 : nums.reduce((sum, n) => sum + n, 0) / nums.length;

export function computeWatchlistStats(watched: WatchedMovie[]): WatchlistStats {
  return {
    count: watched.length,
    avgUserRating: average(watched.map((m) => m.userRating)),
    avgVoteAverage: average(watched.map((m) => m.voteAverage)),
    totalMinutes: watched.reduce((sum, m) => sum + m.runtime, 0),
  };
}

// 150 -> "2h 30m", 45 -> "45m", 120 -> "2h"
export function formatWatchTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}