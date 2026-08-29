import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb";
import { toMovieSummary } from "@/lib/mappers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data = await tmdbFetch<{ results: unknown[] }>(
      `/movie/${id}/recommendations`
    );
    return NextResponse.json(data.results.map(toMovieSummary));
  } catch (err) {
    const status = err instanceof TmdbError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status });
  }
}
