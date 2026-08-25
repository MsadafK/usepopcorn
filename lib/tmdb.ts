const TOKEN = process.env.TMDB_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export class TmdbError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Every API route calls this instead of fetch() directly, so the Bearer
// auth and error handling only live in one place.
export async function tmdbFetch<T>(
  path: string,
  searchParams?: Record<string, string>
): Promise<T> {
  if (!TOKEN) {
    throw new TmdbError(
      "TMDB_ACCESS_TOKEN is not set on the server — check .env.local",
      500
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: "application/json",
      },
      next: { revalidate: 3600 },
    });
  } catch (err) {
    throw new TmdbError(
      `Could not reach TMDB: ${
        err instanceof Error ? err.message : "unknown network error"
      }`,
      502
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok || !data) {
    throw new TmdbError(
      data?.status_message || `TMDB responded with status ${res.status}`,
      res.status || 502
    );
  }

  return data as T;
}
