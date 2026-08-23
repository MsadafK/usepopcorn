import { WatchedMovie } from "../types/movie";
import WatchedMovieItem from "./WatchedMovieItem";

interface WatchedMoviesListProps {
  watched: WatchedMovie[];
  onDeleteWatched: (id: string) => void;
}

export default function WatchedMoviesList({
  watched,
  onDeleteWatched,
}: WatchedMoviesListProps) {
  return (
    <ul className="list list-watched">
      {watched.map((movie) => (
        <WatchedMovieItem
          movie={movie}
          key={movie.imdbID || movie.title}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
