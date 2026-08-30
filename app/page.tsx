import { Suspense } from "react";
import { Metadata } from "next";
import App from "@/components/App";
import { tmdbFetch } from "@/lib/tmdb";
import { toMovieDetails } from "@/lib/mappers";
import { posterUrl } from "@/utils/tmdbImage";

type Props = {
  searchParams: Promise<{ movie?: string }>;
};

const defaultMetadata: Metadata = {
  title: "usePopcorn",
  description: "Search, rate, and track movies with usePopcorn.",
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { movie: movieId } = await searchParams;
  if (!movieId) return defaultMetadata;

  try {
    const raw = await tmdbFetch(`/movie/${movieId}`);
    const movie = toMovieDetails(raw);
    const description = movie.overview
      ? movie.overview.slice(0, 160)
      : `Check out ${movie.title} on usePopcorn.`;
    const image = movie.posterPath ? [posterUrl(movie.posterPath, "w500")] : [];

    return {
      title: `${movie.title} | usePopcorn`,
      description,
      openGraph: { title: movie.title, description, images: image },
      twitter: { card: "summary_large_image", title: movie.title, description, images: image },
    };
  } catch {
    // If TMDB is unreachable or the id is invalid, fall back quietly
    // rather than breaking the page over a metadata problem.
    return defaultMetadata;
  }
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}
