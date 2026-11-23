import type { PasswordInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";
import { builtin, resolveText, watchLocale } from "../i18n";

const EYE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

export function createPasswordInput(params: PasswordInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "password" as const };
  const container = createInputContainer(conf, createInputChildren("input", conf));

  if (params.showToggle === false) return container;

  const input = container.querySelector("input") as HTMLInputElement;
  const showLabel = params.showLabel ?? builtin("password.show", "Jelszó megjelenítése");
  const hideLabel = params.hideLabel ?? builtin("password.hide", "Jelszó elrejtése");

  const field = document.createElement("div");
  field.className = "password-field";
  input.replaceWith(field);
  field.appendChild(input);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "password-toggle";
  btn.id = `${params.id}-toggle`;

  const render = (visible: boolean) => {
    input.type = visible ? "text" : "password";
    btn.innerHTML = visible ? EYE_OFF : EYE;
    btn.setAttribute("aria-label", resolveText(visible ? hideLabel : showLabel));
    btn.setAttribute("aria-pressed", String(visible));
  };
  render(false);
  // nyelvváltáskor a gomb felirata frissül, a láthatóság állapota megmarad
  watchLocale(btn, () => render(input.type === "text"));

  btn.addEventListener("click", () => {
    render(input.type === "password");
    input.focus();
  });

  field.appendChild(btn);
  return container;
}
