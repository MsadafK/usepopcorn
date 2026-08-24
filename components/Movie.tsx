"use client";

import { MovieSearchResult } from "@/types/movie";

interface MovieProps {
  movie: MovieSearchResult;
  onSelectMovie: (id: string) => void;
}

export default function Movie({ movie, onSelectMovie }: MovieProps) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://placehold.co/300x450?text=No+Image"
        }
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
