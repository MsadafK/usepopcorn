import { NextRequest, NextResponse } from "next/server";

const KEY = process.env.OMDB_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!KEY) {
    return NextResponse.json(
      { error: "OMDB_KEY is not set on the server — check .env.local" },
      { status: 500 }
    );
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}?apikey=${KEY}&i=${id}`, {
      next: { revalidate: 3600 },
    });
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

  return NextResponse.json(data);
}