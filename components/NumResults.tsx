import { MovieSearchResult } from "@/types/movie";

interface NumResultsProps {
  movies: MovieSearchResult[];
}

export default function NumResults({ movies }: NumResultsProps) {
  return (
    <p className="num-results">
      Found <strong>{movies ? movies.length : 0}</strong> results
    </p>
  );
}
