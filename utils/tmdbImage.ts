const IMAGE_BASE = "https://image.tmdb.org/t/p";
const FALLBACK = "https://placehold.co/300x450?text=No+Image";

export type PosterSize = "w185" | "w342" | "w500";
export type BackdropSize = "w780" | "w1280" | "original";

export function posterUrl(
  path: string | null,
  size: PosterSize = "w342"
): string {
  return path ? `${IMAGE_BASE}/${size}${path}` : FALLBACK;
}

export function backdropUrl(
  path: string | null,
  size: BackdropSize = "w1280"
): string {
  return path ? `${IMAGE_BASE}/${size}${path}` : FALLBACK;
}
