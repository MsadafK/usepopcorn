import { useState, useEffect } from "react";
import { Genre } from "@/types/movie";
import { fetchGenres } from "@/services/tmdbApi";

export function useGenres(): Genre[] {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch((err) => console.error(err));
  }, []);

  return genres;
}
