import { NextRequest, NextResponse } from "next/server";

const KEY = process.env.OMDB_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("s");

  if (!query) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 }
    );
  }

  if (!KEY) {
    return NextResponse.json(
      { error: "OMDB_KEY is not set on the server — check .env.local" },
      { status: 500 }
    );
  }

  let res: Response;
  try {
    res = await fetch(
      `${BASE_URL}?apikey=${KEY}&s=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } } // cache each search term for an hour
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: `Could not reach OMDb: ${
          err instanceof Error ? err.message : "unknown network error"
        }`,
      },
      { status: 502 }
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    return NextResponse.json(
      { error: data?.Error || `OMDb responded with status ${res.status}` },
      { status: res.status || 502 }
    );
  }

  // OMDb returns Response as "True" / "False" (capitalized)
  if (data.Response === "False") {
    return NextResponse.json(
      { error: data.Error || "Movie not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data.Search);
}