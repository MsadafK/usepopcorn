"use client";

import { useState } from "react";
import { useMovies } from "@/hooks/useMovies";
import { useMovieList } from "@/hooks/useMovieList";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { fetchTrending, fetchTopRated } from "@/services/tmdbApi";
import { WatchedMovie } from "@/types/movie";

import TopBar from "./TopBar";
import Hero from "./Hero";
import Row from "./Row";
import SearchGrid from "./SearchGrid";
import MovieDetailsModal from "./MovieDetailsModal";

export default function App() {
  const [query, setQuery] = useState("");
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

  const isSearching = query.trim().length >= 3;
  const featured = trending[0];

  function handleAddWatched(movie: WatchedMovie) {
    setWatched((watched) => [...watched, movie]);
  }

  return (
    <>
      <TopBar query={query} setQuery={setQuery} />

      <main className="pb-16">
        {isSearching ? (
          <SearchGrid
            query={query}
            movies={searchResults}
            isLoading={searchLoading}
            error={searchError}
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
