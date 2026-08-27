import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function useLocalStorageState<T>(
  initialState: T,
  key: string
): [T, Dispatch<SetStateAction<T>>] {
  // Starts as initialState on BOTH server and client so the first client
  // render matches the server-rendered HTML exactly (no hydration mismatch).
  const [value, setValue] = useState<T>(initialState);

  // Reading from localStorage has to happen in an effect, not in the lazy
  // useState initializer — localStorage doesn't exist during Next.js's
  // server render pass (the old CRA setup never rendered on a server at
  // all, so this problem never came up there).
  useEffect(() => {
    // This is the "subscribe to an external system on mount" case the
    // set-state-in-effect rule's own docs carve out as legitimate — there's
    // no derived-value alternative since localStorage lives outside React.
    const storedValue = localStorage.getItem(key);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedValue) setValue(JSON.parse(storedValue) as T);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
