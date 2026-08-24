import { MovieSearchResult } from "@/types/movie";
import Movie from "./Movie";

interface MovieListProps {
  movies: MovieSearchResult[];
  onSelectMovie: (id: string) => void;
}

export default function MovieList({ movies, onSelectMovie }: MovieListProps) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}
