import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFocusTrap } from "../useFocusTrap";

function makeDialog(buttonCount: number) {
  const container = document.createElement("div");
  const buttons = Array.from({ length: buttonCount }, () => {
    const b = document.createElement("button");
    container.appendChild(b);
    return b;
  });
  document.body.appendChild(container);
  return { container, buttons };
}

function pressTab(shiftKey = false) {
  const event = new KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey,
    cancelable: true,
    bubbles: true,
  });
  document.dispatchEvent(event);
  return event;
}

describe("useFocusTrap", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("wraps Tab from the last element to the first", () => {
    const { container, buttons } = makeDialog(3);
    renderHook(() => useFocusTrap({ current: container }));
    buttons[2].focus();
    const event = pressTab();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("wraps Shift+Tab from the first element to the last", () => {
    const { container, buttons } = makeDialog(3);
    renderHook(() => useFocusTrap({ current: container }));
    buttons[0].focus();
    const event = pressTab(true);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[2]);
  });

  it("leaves Tab alone in the middle of the dialog", () => {
    const { container, buttons } = makeDialog(3);
    renderHook(() => useFocusTrap({ current: container }));
    buttons[1].focus();
    expect(pressTab().defaultPrevented).toBe(false);
  });

  it("pulls focus back in when it is outside the dialog", () => {
    const { container, buttons } = makeDialog(2);
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    renderHook(() => useFocusTrap({ current: container }));
    outside.focus();
    pressTab();
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("only the topmost trap handles Tab, and the lower one resumes after unmount", () => {
    const lower = makeDialog(2);
    const upper = makeDialog(2);
    renderHook(() => useFocusTrap({ current: lower.container }));
    const top = renderHook(() => useFocusTrap({ current: upper.container }));

    upper.buttons[1].focus();
    pressTab();
    expect(document.activeElement).toBe(upper.buttons[0]);

    top.unmount();
    lower.buttons[1].focus();
    pressTab();
    expect(document.activeElement).toBe(lower.buttons[0]);
  });
});