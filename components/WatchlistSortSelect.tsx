import {
  WATCHLIST_SORT_OPTIONS,
  WatchlistSort,
  isWatchlistSort,
} from "@/lib/sortWatchlist";

interface WatchlistSortSelectProps {
  value: WatchlistSort;
  onChange: (sort: WatchlistSort) => void;
}

export default function WatchlistSortSelect({
  value,
  onChange,
}: WatchlistSortSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-400">
      <span>Sort by</span>
      <select
        value={value}
        onChange={(e) => {
          if (isWatchlistSort(e.target.value)) onChange(e.target.value);
        }}
        className="rounded border border-zinc-700 bg-surface px-2 py-1 text-sm text-zinc-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
      >
        {WATCHLIST_SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}