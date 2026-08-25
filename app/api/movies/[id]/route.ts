import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb";
import { toMovieDetails } from "@/lib/mappers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // append_to_response pulls the trailer data in the same request instead
    // of needing a second round trip to /movie/{id}/videos
    const data = await tmdbFetch(`/movie/${id}`, {
      append_to_response: "videos",
    });
    return NextResponse.json(toMovieDetails(data));
  } catch (err) {
    const status = err instanceof TmdbError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status });
  }
}
