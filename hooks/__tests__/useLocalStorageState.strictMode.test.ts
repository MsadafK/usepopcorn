import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { renderHook, waitFor, act, configure } from "@testing-library/react";
import { useLocalStorageState } from "../useLocalStorageState";

// Next.js dev runs every component under React Strict Mode, which mounts
// effects twice. Testing Library doesn't do that by default, so turn it on
// here - this is a regression test for "watchlist wiped on page refresh".
configure({ reactStrictMode: true });
afterAll(() => configure({ reactStrictMode: false }));

describe("useLocalStorageState under React Strict Mode", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("does not wipe saved data on mount", async () => {
    localStorage.setItem("k", JSON.stringify(["saved"]));

    const { result } = renderHook(() =>
      useLocalStorageState<string[]>([], "k")
    );

    await waitFor(() => expect(result.current[0]).toEqual(["saved"]));
    expect(JSON.parse(localStorage.getItem("k")!)).toEqual(["saved"]);
  });

  it("still persists updates after hydration", async () => {
    const { result } = renderHook(() =>
      useLocalStorageState<string[]>([], "k")
    );

    act(() => {
      result.current[1](["new"]);
    });

    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem("k")!)).toEqual(["new"])
    );
  });

  it("falls back to initialState on corrupted JSON instead of crashing", async () => {
    localStorage.setItem("k", "{not valid json");

    const { result } = renderHook(() =>
      useLocalStorageState<string[]>(["default"], "k")
    );

    await waitFor(() => expect(result.current[0]).toEqual(["default"]));
  });
});