"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import WatchlistStats from "./WatchlistStats";

export default function App() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the single source of truth for these two - makes both
  // shareable/bookmarkable, and survives a refresh or browser back/forward.
  const selectedId = searchParams.get("movie")
    ? Number(searchParams.get("movie"))
    : null;
  const selectedGenre = searchParams.get("genre")
    ? Number(searchParams.get("genre"))
    : null;

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
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
    isLoadingMore: genreLoadingMore,
    hasMore: genreHasMore,
    loadMore: loadMoreGenreMovies,
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

  function withParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  // Opening/closing a movie is a "navigation" - worth a back-button entry.
  function openMovie(id: number) {
    router.push(withParams({ movie: String(id) }));
  }

  function closeMovie() {
    router.push(withParams({ movie: null }));
  }

  // Switching genres is a filter adjustment, not a navigation - replace so
  // clicking through five genres doesn't mean pressing Back five times.
  function selectGenre(id: number | null) {
    router.replace(withParams({ genre: id === null ? null : String(id) }));
  }

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

  function handleRemoveWatched(id: number) {
    setWatched((watched) => watched.filter((movie) => movie.id !== id));
  }

  return (
    <>
      <TopBar onOpenPalette={() => setIsPaletteOpen(true)} />

      <main className="pb-16">
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={selectGenre}
        />

        {isGenreMode ? (
          <MovieGrid
            heading={`${selectedGenreName ?? "Genre"} movies`}
            movies={genreMovies}
            isLoading={genreLoading}
            error={genreError}
            onSelectMovie={openMovie}
            isLoadingMore={genreLoadingMore}
            hasMore={genreHasMore}
            onLoadMore={loadMoreGenreMovies}
          />
        ) : (
          <>
            {trendingLoading && <HeroSkeleton />}
            {featured && <Hero movie={featured} onSelectMovie={openMovie} />}
            <Row
              title="Your watchlist"
              movies={watched}
              onSelectMovie={openMovie}
            />
            <WatchlistStats watched={watched} />
            {topRatedWatched && (
              <Row
                title={`Because you rated "${topRatedWatched.title}" highly`}
                movies={recommendations}
                isLoading={recommendationsLoading}
                onSelectMovie={openMovie}
              />
            )}
            <Row
              title="Trending now"
              movies={trending}
              isLoading={trendingLoading}
              onSelectMovie={openMovie}
              showRank
            />
            <Row
              title="Top rated"
              movies={topRated}
              isLoading={topRatedLoading}
              onSelectMovie={openMovie}
            />
          </>
        )}
      </main>

      {isPaletteOpen && (
        <CommandPalette
          onClose={() => setIsPaletteOpen(false)}
          onSelectMovie={openMovie}
        />
      )}

      {selectedId !== null && (
        <MovieDetailsModal
          selectedId={selectedId}
          watched={watched}
          onClose={closeMovie}
          onAddWatched={handleAddWatched}
          onRemoveWatched={handleRemoveWatched}
          onSelectMovie={openMovie}
        />
      )}
    </>
  );
}