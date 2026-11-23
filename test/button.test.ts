import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createButton } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe("createButton throttle / debounce", () => {
  it("throttle: azonnal fut, utána disabled + badge, lejártkor újra kattintható", () => {
    const click = vi.fn();
    const btn = createButton({ parent: "root", id: "b", text: "x", throttle: 1000, click }) as HTMLButtonElement;
    btn.click();
    expect(click).toHaveBeenCalledTimes(1);
    expect(btn.disabled).toBe(true);
    expect(btn.querySelector(".btn-countdown-badge")).not.toBeNull();
    btn.click();
    expect(click).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1100);
    expect(btn.disabled).toBe(false);
    expect(btn.querySelector(".btn-countdown-badge")).toBeNull();
    btn.click();
    expect(click).toHaveBeenCalledTimes(2);
  });

  it("debounce: a várakozás végén fut, addig disabled", () => {
    const click = vi.fn();
    const btn = createButton({ parent: "root", id: "b", text: "x", debounce: 1000, click }) as HTMLButtonElement;
    btn.click();
    expect(click).not.toHaveBeenCalled();
    expect(btn.disabled).toBe(true);
    vi.advanceTimersByTime(1100);
    expect(click).toHaveBeenCalledTimes(1);
    expect(btn.disabled).toBe(false);
  });
});
