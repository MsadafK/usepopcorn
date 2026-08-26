"use client";

import { useState, useEffect, useRef } from "react";
import { MovieDetails, WatchedMovie } from "@/types/movie";
import { fetchMovieDetails } from "@/services/tmdbApi";
import { backdropUrl } from "@/utils/tmdbImage";
import { useKey } from "@/hooks/useKey";
import Loader from "./Loader";
import StarRating from "./StarRating";

interface MovieDetailsModalProps {
  selectedId: number;
  watched: WatchedMovie[];
  onClose: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
}

export default function MovieDetailsModal({
  selectedId,
  watched,
  onClose,
  onAddWatched,
}: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<Partial<MovieDetails>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = `movie-details-title-${selectedId}`;

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

  useKey("Escape", onClose);

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
    onClose();
  }

  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "";

  return (
    <div
      className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-black/80 px-4 py-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-2xl overflow-hidden rounded-lg bg-surface-raised"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="p-12">
            <Loader />
          </div>
        ) : (
          <>
            <div className="relative">
              <img
                src={backdropUrl(movie.backdropPath ?? null)}
                alt=""
                className="h-56 w-full object-cover sm:h-72"
              />
              <button
                ref={closeButtonRef}
                onClick={onClose}
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

              <div className="mb-5 rounded-md bg-surface p-4">
                {isWatched ? (
                  <p className="text-sm text-zinc-200">
                    You rated this {watchedEntry?.userRating} ⭐
                  </p>
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
          </>
        )}
      </div>
    </div>
  );
}
