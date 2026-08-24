"use client";

import { WatchedMovie } from "@/types/movie";

interface WatchedMovieItemProps {
  movie: WatchedMovie;
  onDeleteWatched: (id: string) => void;
}

export default function WatchedMovieItem({
  movie,
  onDeleteWatched,
}: WatchedMovieItemProps) {
  return (
    <li>
      <img
        src={
          movie.poster !== "N/A"
            ? movie.poster
            : "https://placehold.co/300x450?text=No+Image"
        }
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>

      <div>
        <p>⭐ {movie.imdbRating}</p>
        <p>🌟 {movie.userRating}</p>
        <p>⏳ {movie.runtime} min</p>

        <button
          className="btn-delete"
          aria-label={`Remove ${movie.title} from watched list`}
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
