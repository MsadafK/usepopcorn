import { NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb";
import { Genre } from "@/types/movie";

export async function GET() {
  try {
    const data = await tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");
    return NextResponse.json(data.genres);
  } catch (err) {
    const status = err instanceof TmdbError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status });
  }
}
