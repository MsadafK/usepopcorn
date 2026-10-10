import { WatchedMovie } from "@/types/movie";
import { computeWatchlistStats, formatWatchTime } from "@/lib/watchlistStats";

export default function WatchlistStats({ watched }: { watched: WatchedMovie[] }) {
  if (watched.length === 0) return null;

  const stats = computeWatchlistStats(watched);
  const items = [
    { label: "Movies", value: String(stats.count) },
    { label: "Your avg", value: `⭐ ${stats.avgUserRating.toFixed(1)}` },
    { label: "TMDB avg", value: `⭐ ${stats.avgVoteAverage.toFixed(1)}` },
    { label: "Watch time", value: formatWatchTime(stats.totalMinutes) },
  ];

  return (
    <dl
      aria-label="Watchlist statistics"
      className="mt-4 flex flex-wrap gap-2 px-4 sm:px-8"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-md bg-surface px-3 py-2"
        >
          <dt className="text-xs text-zinc-500">{item.label}</dt>
          <dd className="text-sm font-semibold text-white">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}