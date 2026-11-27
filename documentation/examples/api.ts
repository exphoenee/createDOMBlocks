import { initDocPage } from "../page-components/index";
import { createCard, createCodeBlock, createLocalizedElem as createDOMElem } from "../../src/index";
import type { DOMOptions } from "../../src/index";
import { tr } from "../page-components/i18n";
// A referencia a forráskód JSDoc-jából generálódik (scripts/gen-api.mjs, a `@group` címkés exportok)
import api from "../generated/api.json";
import { API_GROUPS } from "../page-components/apiGroups";

const done = initDocPage();
const app = document.getElementById("app") as HTMLElement;

interface ApiMember { name: string; signature: string; summary: string }
interface ApiEntry { group: string; name: string; kind: string; signatures: string[]; summary: string; members: ApiMember[] }

// a csoportok sorrendje és címe; ismeretlen csoport a végére kerül a saját nevével (a teszt jelzi, hogy cím kell neki)
const known = new Set(API_GROUPS.map(([g]) => g));
const GROUPS: Array<readonly [string, string]> = [
  ...API_GROUPS,
  ...[...new Set((api as ApiEntry[]).map((e) => e.group))].filter((g) => !known.has(g)).map((g) => [g, g] as const),
];

/** A JSDoc-szöveg HTML-lé alakítása: a `kód` jelölés <code> elemmé válik. */
const html = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`([^`]+)`/g, "<code>$1</code>");

for (const [group, title] of GROUPS) {
  const entries = (api as ApiEntry[]).filter((e) => e.group === group);
  if (!entries.length) continue;
  const id = `api-${group}`;
  createCard({ parent: app, id, title: tr(title), body: { tag: "div", attrs: { class: "card-content" } } });
  const body = document.querySelector(`#${id} .card-body`) as HTMLElement;

  entries.forEach((entry, i) => {
    createDOMElem({ tag: "h3", parent: body, attrs: { id: `api-${entry.name}` }, text: entry.name, style: { margin: i === 0 ? "0 0 0.25rem" : "1.5rem 0 0.25rem", fontFamily: "ui-monospace,Consolas,monospace", fontSize: "1rem" } });
    createCodeBlock({ parent: body, id: `api-${entry.name}-sig`, language: "typescript", code: entry.signatures.join("\n") });
    if (entry.summary) createDOMElem({ tag: "p", parent: body, content: tr(html(entry.summary)), style: { margin: "0.5rem 0" } });
    if (entry.members.length) {
      createDOMElem({
        tag: "table",
        parent: body,
        attrs: { class: "table", id: `api-${entry.name}-members` },
        style: { width: "100%", margin: "0.5rem 0", borderCollapse: "collapse" },
        children: entry.members.map(
          (m): DOMOptions => ({
            tag: "tr",
            style: { borderTop: "1px solid var(--border)" },
            children: [
              { tag: "td", text: m.signature, style: { padding: "0.4rem", fontFamily: "ui-monospace,Consolas,monospace", fontSize: "0.8rem", verticalAlign: "top" } },
              { tag: "td", content: m.summary ? tr(html(m.summary)) : "", style: { padding: "0.4rem", verticalAlign: "top" } },
            ],
          }),
        ),
      });
    }
  });
}

done();
