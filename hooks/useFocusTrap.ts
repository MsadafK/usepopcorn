import { RefObject, useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

// Stack of currently-mounted traps. If a dialog opens on top of another
// (e.g. the command palette over the movie modal), only the topmost one
// should handle Tab - otherwise the two handlers fight over focus.
const trapStack: symbol[] = [];

/**
 * Keeps Tab / Shift+Tab focus cycling inside `containerRef` while mounted.
 * Limitation: key events inside a cross-origin iframe (the YouTube embed)
 * never reach the page, so those can't be intercepted - focus is re-trapped
 * as soon as it comes back out to a regular element.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const id = Symbol("focus-trap");
    trapStack.push(id);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (trapStack[trapStack.length - 1] !== id) return;

      const container = containerRef.current;
      if (!container) return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!container.contains(active)) {
        // Focus escaped (or never entered) - pull it back in
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const i = trapStack.indexOf(id);
      if (i !== -1) trapStack.splice(i, 1);
    };
  }, [containerRef]);
}