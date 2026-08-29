import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb";
import { toMovieSummary } from "@/lib/mappers";

export async function GET(request: NextRequest) {
  const genreId = request.nextUrl.searchParams.get("genre");
  const page = request.nextUrl.searchParams.get("page") ?? "1";

  if (!genreId) {
    return NextResponse.json({ error: "Missing genre id" }, { status: 400 });
  }

  try {
    const data = await tmdbFetch<{
      results: unknown[];
      page: number;
      total_pages: number;
    }>("/discover/movie", {
      with_genres: genreId,
      sort_by: "popularity.desc",
      page,
    });
    return NextResponse.json({
      results: data.results.map(toMovieSummary),
      page: data.page,
      totalPages: data.total_pages,
    });
  } catch (err) {
    const status = err instanceof TmdbError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status });
  }
}
