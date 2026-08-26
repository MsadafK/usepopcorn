"use client";

import { useState } from "react";
import { useMovies } from "@/hooks/useMovies";
import { useMovieList } from "@/hooks/useMovieList";
import { useMoviesByGenre } from "@/hooks/useMoviesByGenre";
import { useGenres } from "@/hooks/useGenres";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { fetchTrending, fetchTopRated } from "@/services/tmdbApi";
import { WatchedMovie } from "@/types/movie";

import TopBar from "./TopBar";
import Hero from "./Hero";
import Row from "./Row";
import GenreFilter from "./GenreFilter";
import MovieGrid from "./MovieGrid";
import MovieDetailsModal from "./MovieDetailsModal";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>(
    [],
    "watched"
  );

  const { movies: searchResults, isLoading: searchLoading, error: searchError } =
    useMovies(query);
  const { movies: trending, isLoading: trendingLoading } =
    useMovieList(fetchTrending);
  const { movies: topRated, isLoading: topRatedLoading } =
    useMovieList(fetchTopRated);
  const genres = useGenres();
  const {
    movies: genreMovies,
    isLoading: genreLoading,
    error: genreError,
  } = useMoviesByGenre(selectedGenre);

  const isSearching = query.trim().length >= 3;
  const isGenreMode = !isSearching && selectedGenre !== null;
  const featured = trending[0];
  const selectedGenreName = genres.find((g) => g.id === selectedGenre)?.name;

  function handleAddWatched(movie: WatchedMovie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleSelectGenre(id: number | null) {
    setSelectedGenre(id);
  }

  return (
    <>
      <TopBar query={query} setQuery={setQuery} />

      <main className="pb-16">
        {isSearching ? (
          <MovieGrid
            heading={`Results for "${query}"`}
            movies={searchResults}
            isLoading={searchLoading}
            error={searchError}
            onSelectMovie={setSelectedId}
          />
        ) : (
          <>
            <GenreFilter
              genres={genres}
              selectedGenre={selectedGenre}
              onSelectGenre={handleSelectGenre}
            />

            {isGenreMode ? (
              <MovieGrid
                heading={`${selectedGenreName ?? "Genre"} movies`}
                movies={genreMovies}
                isLoading={genreLoading}
                error={genreError}
                onSelectMovie={setSelectedId}
              />
            ) : (
              <>
                {featured && (
                  <Hero movie={featured} onSelectMovie={setSelectedId} />
                )}
                <Row
                  title="Your watchlist"
                  movies={watched}
                  onSelectMovie={setSelectedId}
                />
                <Row
                  title="Trending now"
                  movies={trending}
                  isLoading={trendingLoading}
                  onSelectMovie={setSelectedId}
                />
                <Row
                  title="Top rated"
                  movies={topRated}
                  isLoading={topRatedLoading}
                  onSelectMovie={setSelectedId}
                />
              </>
            )}
          </>
        )}
      </main>

      {selectedId !== null && (
        <MovieDetailsModal
          selectedId={selectedId}
          watched={watched}
          onClose={() => setSelectedId(null)}
          onAddWatched={handleAddWatched}
        />
      )}
    </>
  );
}
