import { WatchedMovie } from "@/types/movie";

export type WatchlistSort =
  | "recent"
  | "yourRating"
  | "tmdbRating"
  | "runtime"
  | "title";

export const WATCHLIST_SORT_OPTIONS: { value: WatchlistSort; label: string }[] =
  [
    { value: "recent", label: "Recently added" },
    { value: "yourRating", label: "Your rating" },
    { value: "tmdbRating", label: "TMDB rating" },
    { value: "runtime", label: "Longest first" },
    { value: "title", label: "Title A-Z" },
  ];

// localStorage can hold anything (old value, hand-edited, renamed option) -
// anything unrecognised falls back to the default instead of breaking sorting.
export function isWatchlistSort(value: unknown): value is WatchlistSort {
  return WATCHLIST_SORT_OPTIONS.some((o) => o.value === value);
}

// New movies are appended to the stored array, so array order = oldest first.
// We reverse once up front: "recent" is then newest-first, and for every other
// sort the (stable) sort keeps ties newest-first too.
export function sortWatchlist(
  watched: WatchedMovie[],
  sort: WatchlistSort
): WatchedMovie[] {
  const newestFirst = [...watched].reverse();

  switch (sort) {
    case "yourRating":
      return newestFirst.sort((a, b) => b.userRating - a.userRating);
    case "tmdbRating":
      return newestFirst.sort((a, b) => b.voteAverage - a.voteAverage);
    case "runtime":
      return newestFirst.sort((a, b) => b.runtime - a.runtime);
    case "title":
      return newestFirst.sort((a, b) => a.title.localeCompare(b.title));
    case "recent":
    default:
      return newestFirst;
  }
}