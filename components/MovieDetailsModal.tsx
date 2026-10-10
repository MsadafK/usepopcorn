"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MovieDetails, WatchedMovie } from "@/types/movie";
import { fetchMovieDetails } from "@/services/tmdbApi";
import { backdropUrl } from "@/utils/tmdbImage";
import { useKey } from "@/hooks/useKey";
import { useRecommendations } from "@/hooks/useRecommendations";
import Skeleton from "./Skeleton";
import StarRating from "./StarRating";
import Row from "./Row";

interface MovieDetailsModalProps {
  selectedId: number;
  watched: WatchedMovie[];
  onClose: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
  onRemoveWatched: (id: number) => void;
  onSelectMovie: (id: number) => void;
}

export default function MovieDetailsModal({
  selectedId,
  watched,
  onClose,
  onAddWatched,
  onRemoveWatched,
  onSelectMovie,
}: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<Partial<MovieDetails>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleId = `movie-details-title-${selectedId}`;

  // The modal doesn't unmount when navigating from one movie to a "More
  // like this" pick - only selectedId changes. Reset the in-progress
  // rating so it doesn't carry over to the new movie. This adjusts state
  // during render (the documented pattern for "reset state when a prop
  // changes") rather than in an effect, which avoids an extra render pass.
  const [prevSelectedId, setPrevSelectedId] = useState(selectedId);
  if (selectedId !== prevSelectedId) {
    setPrevSelectedId(selectedId);
    setUserRating(0);
  }

  // Triggers the enter transition on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Plays the exit transition before actually unmounting (the parent
  // removes this component the instant onClose fires, which would
  // otherwise cut the animation off)
  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }

  // Lock background scroll while the modal is open, and restore it on close
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Move focus into the modal on open, and back to whatever triggered it
  // (e.g. the poster card that was clicked) when it closes
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    if (userRating) countRef.current += 1;
  }, [userRating]);

  // Scroll back to the top and reset the rating-decision counter when
  // navigating to a different movie within the same mounted modal. These
  // are DOM/ref side effects, so (unlike the userRating reset above) they
  // belong in an effect rather than during render.
  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
    countRef.current = 0;
  }, [selectedId]);

  const { movies: similarMovies, isLoading: similarLoading } =
    useRecommendations(selectedId);

  useKey("Escape", handleClose);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        const data = await fetchMovieDetails(selectedId);
        if (!cancelled) setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  useEffect(() => {
    if (!movie.title) return;
    document.title = `${movie.title} | usePopcorn`;
    return () => {
      document.title = "usePopcorn";
    };
  }, [movie.title]);

  const isWatched = watched.some((m) => m.id === selectedId);
  const watchedEntry = watched.find((m) => m.id === selectedId);

  function handleAdd() {
    const { title, posterPath, releaseDate, runtime, voteAverage } = movie;
    if (!title || releaseDate === undefined) return;

    onAddWatched({
      id: selectedId,
      title,
      posterPath: posterPath ?? null,
      releaseDate,
      voteAverage: voteAverage ?? 0,
      runtime: runtime ?? 0,
      userRating,
      countRatingDecisions: countRef.current,
    });
    handleClose();
  }

  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "";

  return (
    <div
      ref={scrollContainerRef}
      className={`fixed inset-0 z-30 flex items-start justify-center overflow-y-auto px-4 py-8 transition-opacity duration-200 ${
        isVisible ? "bg-black/80 opacity-100" : "bg-black/80 opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`w-full max-w-2xl overflow-hidden rounded-lg bg-surface-raised transition-all duration-200 ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div>
            <Skeleton className="h-56 w-full rounded-none sm:h-72" />
            <div className="px-5 py-5 sm:px-8">
              <Skeleton className="mb-4 h-4 w-24" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-5 h-4 w-2/3" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={backdropUrl(movie.backdropPath ?? null)}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 672px"
                className="object-cover"
              />
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                aria-label="Close movie details"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white outline-none hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white"
              >
                ✕
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-raised px-5 pb-4 pt-10 sm:px-8">
                <h2
                  id={titleId}
                  className="text-2xl font-bold text-white sm:text-3xl"
                >
                  {movie.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-300">
                  {year} &middot; {movie.runtime} min &middot; ⭐{" "}
                  {movie.voteAverage?.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-8">
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="rounded-full border border-zinc-600 px-3 py-1 text-xs text-zinc-300"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.tagline && (
                <p className="mb-3 text-sm italic text-zinc-400">
                  {movie.tagline}
                </p>
              )}
              <p className="mb-5 text-sm leading-relaxed text-zinc-200">
                {movie.overview}
              </p>

              {movie.cast && movie.cast.length > 0 && (
                <p className="mb-1 text-sm text-zinc-400">
                  <span className="text-zinc-500">Starring </span>
                  {movie.cast.join(", ")}
                </p>
              )}
              {movie.director && (
                <p className="mb-5 text-sm text-zinc-400">
                  <span className="text-zinc-500">Directed by </span>
                  {movie.director}
                </p>
              )}

              <div className="mb-5 flex flex-col items-start gap-3 rounded-md bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                {isWatched ? (
                  <>
                    <p className="text-sm text-zinc-200">
                      You rated this {watchedEntry?.userRating} ⭐
                    </p>
                    <button
                      onClick={() => {
                        onRemoveWatched(selectedId);
                        handleClose();
                      }}
                      className="rounded border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300 outline-none transition-colors hover:border-red-400 hover:text-red-400 focus-visible:ring-2 focus-visible:ring-brand-light"
                    >
                      Remove from watchlist
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <StarRating
                      maxRating={10}
                      size={22}
                      onSetRating={setUserRating}
                    />
                    <button
                      onClick={handleAdd}
                      disabled={!userRating}
                      className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white outline-none transition-colors hover:bg-brand-light focus-visible:ring-2 focus-visible:ring-brand-light disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      + Add to watchlist
                    </button>
                  </div>
                )}
              </div>

              {movie.trailerKey && (
                <div className="aspect-video w-full overflow-hidden rounded-md">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${movie.trailerKey}`}
                    title={`${movie.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {(similarLoading || similarMovies.length > 0) && (
              <div className="pb-5">
                <Row
                  title="More like this"
                  movies={similarMovies}
                  isLoading={similarLoading}
                  onSelectMovie={onSelectMovie}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}