import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMovies } from "../useMovies";
import * as tmdbApi from "@/services/tmdbApi";
import { MovieSummary } from "@/types/movie";

vi.mock("@/services/tmdbApi", () => ({
  searchMovies: vi.fn(),
}));

const mockMovie: MovieSummary = {
  id: 27205,
  title: "Inception",
  posterPath: "/abc.jpg",
  backdropPath: "/def.jpg",
  releaseDate: "2010-07-15",
  voteAverage: 8.4,
  overview: "A thief who steals corporate secrets...",
  genreIds: [28, 878],
};

describe("useMovies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call the API while the query is under 3 characters", () => {
    renderHook(() => useMovies("in"));
    expect(tmdbApi.searchMovies).not.toHaveBeenCalled();
  });

  it("fetches and returns results once the query reaches 3 characters", async () => {
    vi.mocked(tmdbApi.searchMovies).mockResolvedValue([mockMovie]);

    const { result } = renderHook(() => useMovies("ince"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.movies).toEqual([mockMovie]);
    expect(result.current.error).toBe("");
  });

  it("surfaces the error message when the fetch fails", async () => {
    vi.mocked(tmdbApi.searchMovies).mockRejectedValue(
      new Error("Something went wrong while fetching movies")
    );

    const { result } = renderHook(() => useMovies("batman"));

    await waitFor(() =>
      expect(result.current.error).toBe(
        "Something went wrong while fetching movies"
      )
    );
    expect(result.current.isLoading).toBe(false);
  });

  it("ignores AbortError instead of showing it as a real error", async () => {
    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";
    vi.mocked(tmdbApi.searchMovies).mockRejectedValue(abortError);

    const { result } = renderHook(() => useMovies("batman"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("");
  });
});
