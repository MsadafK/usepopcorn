import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function useLocalStorageState<T>(
  initialState: T,
  key: string
): [T, Dispatch<SetStateAction<T>>] {
  // Starts as initialState on BOTH server and client so the first client
  // render matches the server-rendered HTML exactly (no hydration mismatch).
  const [value, setValue] = useState<T>(initialState);

  // Becomes true in the same render that receives the stored value. Writes
  // are blocked until then - otherwise the very first write would save the
  // EMPTY initialState over the real saved data. That is exactly what
  // happened under React Strict Mode (Next.js dev), which runs effects
  // twice: the second read saw the empty value the first pass had just
  // written, and the saved watchlist was wiped on every refresh.
  const [isHydrated, setIsHydrated] = useState(false);

  // Reading from localStorage has to happen in an effect, not in the lazy
  // useState initializer — localStorage doesn't exist during Next.js's
  // server render pass (the old CRA setup never rendered on a server at
  // all, so this problem never came up there).
  useEffect(() => {
    // This is the "subscribe to an external system on mount" case the
    // set-state-in-effect rule's own docs carve out as legitimate — there's
    // no derived-value alternative since localStorage lives outside React.
    try {
      const storedValue = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedValue) setValue(JSON.parse(storedValue) as T);
    } catch {
      // Corrupted JSON or storage unavailable - keep initialState
    }
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    function () {
      if (!isHydrated) return;
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key, isHydrated]
  );

  return [value, setValue];
}