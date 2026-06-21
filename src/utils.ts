import type { EventHandler } from "domelemjs";

export function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export function makeEventHandlerArray(
  onChange?: (e: Event) => void,
  click?: (e: Event) => void,
  handleEvent?: EventHandler | EventHandler[]
): EventHandler[] {
  const events: EventHandler[] = [];
  if (onChange) events.push({ event: "change", cb: onChange });
  if (click) events.push({ event: "click", cb: click });
  if (handleEvent) events.push(...toArray(handleEvent));
  return events;
}
