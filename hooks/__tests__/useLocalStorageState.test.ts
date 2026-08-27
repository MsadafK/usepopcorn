import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useLocalStorageState } from "../useLocalStorageState";

describe("useLocalStorageState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with the initial state when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorageState<string[]>([], "test-key")
    );
    expect(result.current[0]).toEqual([]);
  });

  it("loads an existing value from localStorage after mount", async () => {
    // This has to happen in an effect (not the lazy useState initializer)
    // to stay SSR-safe — see the comment in the hook itself. This test
    // locks in that the deferred read still actually works.
    localStorage.setItem("test-key", JSON.stringify(["saved movie"]));

    const { result } = renderHook(() =>
      useLocalStorageState<string[]>([], "test-key")
    );

    await waitFor(() => {
      expect(result.current[0]).toEqual(["saved movie"]);
    });
  });

  it("persists updates to localStorage", async () => {
    const { result } = renderHook(() =>
      useLocalStorageState<string[]>([], "test-key")
    );

    act(() => {
      result.current[1](["new movie"]);
    });

    await waitFor(() => {
      expect(localStorage.getItem("test-key")).toBe(
        JSON.stringify(["new movie"])
      );
    });
  });

  it("keeps separate keys independent of each other", async () => {
    localStorage.setItem("key-a", JSON.stringify(["a"]));
    localStorage.setItem("key-b", JSON.stringify(["b"]));

    const { result: resultA } = renderHook(() =>
      useLocalStorageState<string[]>([], "key-a")
    );
    const { result: resultB } = renderHook(() =>
      useLocalStorageState<string[]>([], "key-b")
    );

    await waitFor(() => {
      expect(resultA.current[0]).toEqual(["a"]);
      expect(resultB.current[0]).toEqual(["b"]);
    });
  });
});
