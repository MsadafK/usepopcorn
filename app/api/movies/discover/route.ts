import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb";
import { toMovieSummary } from "@/lib/mappers";

export async function GET(request: NextRequest) {
  const genreId = request.nextUrl.searchParams.get("genre");

  if (!genreId) {
    return NextResponse.json({ error: "Missing genre id" }, { status: 400 });
  }

  try {
    const data = await tmdbFetch<{ results: unknown[] }>("/discover/movie", {
      with_genres: genreId,
      sort_by: "popularity.desc",
    });
    return NextResponse.json(data.results.map(toMovieSummary));
  } catch (err) {
    const status = err instanceof TmdbError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status });
  }
}
