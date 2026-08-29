"use client";

import { useState, useEffect } from "react";
import { useMovieList } from "@/hooks/useMovieList";
import { useMoviesByGenre } from "@/hooks/useMoviesByGenre";
import { useGenres } from "@/hooks/useGenres";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { fetchTrending, fetchTopRated } from "@/services/tmdbApi";
import { WatchedMovie } from "@/types/movie";

import TopBar from "./TopBar";
import CommandPalette from "./CommandPalette";
import Hero from "./Hero";
import HeroSkeleton from "./HeroSkeleton";
import Row from "./Row";
import GenreFilter from "./GenreFilter";
import MovieGrid from "./MovieGrid";
import MovieDetailsModal from "./MovieDetailsModal";

export default function App() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>(
    [],
    "watched"
  );

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

  const topRatedWatched = [...watched].sort(
    (a, b) => b.userRating - a.userRating
  )[0];
  const { movies: recommendations, isLoading: recommendationsLoading } =
    useRecommendations(topRatedWatched?.id ?? null);

  const isGenreMode = selectedGenre !== null;
  const featured = trending[0];
  const selectedGenreName = genres.find((g) => g.id === selectedGenre)?.name;

  // Global ⌘K / Ctrl+K shortcut to open the command palette from anywhere
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleAddWatched(movie: WatchedMovie) {
    setWatched((watched) => [...watched, movie]);
  }

  return (
    <>
      <TopBar onOpenPalette={() => setIsPaletteOpen(true)} />

      <main className="pb-16">
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
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
            {trendingLoading && <HeroSkeleton />}
            {featured && (
              <Hero movie={featured} onSelectMovie={setSelectedId} />
            )}
            <Row
              title="Your watchlist"
              movies={watched}
              onSelectMovie={setSelectedId}
            />
            {topRatedWatched && (
              <Row
                title={`Because you rated "${topRatedWatched.title}" highly`}
                movies={recommendations}
                isLoading={recommendationsLoading}
                onSelectMovie={setSelectedId}
              />
            )}
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

      {isPaletteOpen && (
        <CommandPalette
          onClose={() => setIsPaletteOpen(false)}
          onSelectMovie={setSelectedId}
        />
      )}

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
