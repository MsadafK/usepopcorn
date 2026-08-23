import { useState, useEffect, useRef } from "react";
import { MovieDetails as MovieDetailsType, WatchedMovie } from "../types/movie";
import { fetchMovieDetails } from "../services/omdbApi";
import { useKey } from "../hooks/useKey";
import Loader from "./Loader";
import StarRating from "./StarRating";

interface MovieDetailsProps {
  watched: WatchedMovie[];
  selectedId: string;
  onCloseMovie: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
}

export default function MovieDetails({
  watched,
  selectedId,
  onCloseMovie,
  onAddWatched,
}: MovieDetailsProps) {
  const [movie, setMovie] = useState<Partial<MovieDetailsType>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current += 1;
  }, [userRating]);

  const isWatched = watched.map((m) => m.imdbID).includes(selectedId);

  const watchedUserRating = watched.find(
    (m) => m.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    // Guards against the (rare) case of adding before the fetch has
    // resolved — after this, TS knows title/poster/year are real strings.
    if (!title || !poster || !year) return;

    const newWatchedMovie: WatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime?.split(" ")?.[0]) || 0,
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function loadDetails() {
      try {
        setIsLoading(true);
        const data = await fetchMovieDetails(selectedId);
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>

            <img
              src={
                poster !== "N/A"
                  ? poster
                  : "https://placehold.co/300x450?text=No+Image"
              }
              alt={`Poster of ${title}`}
            />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} • {runtime}
              </p>
              <p>{genre}</p>
              <p>⭐ {imdbRating} IMDb Rating</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to list
                  </button>
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} ⭐</p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
