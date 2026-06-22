import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import { section, div, heading, para, button, chip, img } from "./_shared";

const app = document.getElementById("app")!;
const page = createDOMElem(div("demo1-page"));
app.appendChild(page);

function buildNav(): CreateDOMElemOptions {
  return {
    tag: "nav",
    attrs: { class: "demo1-nav" },
    children: [
      div("demo1-nav-brand", [heading(3, "\u25cf Lumen")]),
      div("demo1-nav-links", [
        { tag: "a", text: "Funkci\u00f3k", attrs: { href: "#features" } },
        { tag: "a", text: "\u00c1rak", attrs: { href: "#pricing" } },
        { tag: "a", text: "Dokument\u00e1ci\u00f3", attrs: { href: "#" } },
      ]),
      div("demo1-nav-cta", [button("Kezd\u00e9s")]),
    ],
  };
}

function buildBadge(): CreateDOMElemOptions {
  return div("demo1-badge", [chip("\u00daj: v2.1 megjelent")]);
}

function buildHero(): CreateDOMElemOptions {
  return section("demo1-hero", [
    heading(1, "\u00c9p\u00edts gyorsabban, kevesebb k\u00f3ddal"),
    para("Gyors, modul\u00e1ris \u00e9s rugalmas TypeScript k\u00f6nyvt\u00e1r komplex HTML blokkok l\u00e9trehoz\u00e1s\u00e1hoz. T\u00f6bb mint 50 komponens, nulla f\u00fcgg\u0151s\u00e9g.", "demo1-hero-sub"),
    div("demo1-hero-actions", [
      button("Ingyenes pr\u00f3ba"),
      button("Dem\u00f3", "demo-btn demo-btn-outline"),
    ]),
    div("demo1-hero-media", [
      img("demo1-img1.jpg", "Lumen vez\u00e9rl\u0151pult el\u0151n\u00e9zet", "demo1-hero-img"),
    ]),
  ]);
}

function buildLogos(): CreateDOMElemOptions {
  const logos = ["React", "Vue", "Angular", "Svelte", "Next.js"];
  return div("demo1-logos", logos.map((name) => para(name, "demo1-logo-item")));
}

function buildBento(): CreateDOMElemOptions {
  const features = [
    { image: "demo1-img2.jpg", title: "Vill\u00e1mgyors", desc: "Optimaliz\u00e1lt teljes\u00edtm\u00e9ny, minim\u00e1lis bundle m\u00e9ret." },
    { image: "demo1-img3.jpg", title: "Modul\u00e1ris", desc: "Csak azt haszn\u00e1lod, amire sz\u00fcks\u00e9ged van. Tree-shakable architekt\u00fara.", wide: true },
    { image: "demo1-img4.jpg", title: "Testreszabhat\u00f3", desc: "Minden komponens teljesen konfigur\u00e1lhat\u00f3." },
    { image: "demo1-img5.jpg", title: "TypeScript", desc: "Teljes t\u00edpusbiztons\u00e1g \u00e9s IntelliSense t\u00e1mogat\u00e1s." },
    { image: "demo1-img6.jpg", title: "Egyszer\u0171 telep\u00edt\u00e9s", desc: "npm install, \u00e9s m\u00e1ris haszn\u00e1lhatod." },
    { image: "demo1-img7.jpg", title: "Univerz\u00e1lis", desc: "M\u0171k\u00f6dik b\u00e1rmilyen projektben: React, Vue, vagy vanilla JS." },
  ];
  return section("demo1-bento", [
    heading(2, "F\u0151bb jellemz\u0151k", "demo1-section-title"),
    div("demo1-bento-grid", features.map((f) =>
      div(`demo1-bento-item${f.wide ? " demo1-bento-item--wide" : ""}`, [
        img(f.image, f.title, "demo1-bento-img"),
        heading(3, f.title),
        para(f.desc, "demo1-bento-desc"),
      ])
    )),
  ]);
}

function buildStats(): CreateDOMElemOptions {
  const stats = [
    { value: "50+", label: "komponens" },
    { value: "0", label: "f\u00fcgg\u0151s\u00e9g" },
    { value: "100%", label: "TypeScript" },
  ];
  return section("demo1-stats", stats.map((s) =>
    div("demo1-stat", [
      para(s.value, "demo1-stat-value"),
      para(s.label, "demo1-stat-label"),
    ])
  ));
}

function buildPricing(): CreateDOMElemOptions {
  const plans = [
    { name: "Ingyenes", price: "0", period: "", features: ["5 komponens", "K\u00f6z\u00f6ss\u00e9gi t\u00e1mogat\u00e1s", "Alap dokument\u00e1ci\u00f3"], featured: false },
    { name: "Pro", price: "9 990", period: " Ft/h\u00f3", features: ["\u00d6sszes komponens", "Priorit\u00e1s t\u00e1mogat\u00e1s", "Pr\u00e9mium dokument\u00e1ci\u00f3", "Friss\u00edt\u00e9sek"], featured: true },
    { name: "V\u00e1llalati", price: "29 990", period: " Ft/h\u00f3", features: ["Korl\u00e1tlan", "Dedik\u00e1lt t\u00e1mogat\u00e1s", "Forr\u00e1sk\u00f3d", "SLA garancia"], featured: false },
  ];
  return section("demo1-pricing", [
    heading(2, "\u00c1raz\u00e1s", "demo1-section-title"),
    para("V\u00e1laszd ki az ig\u00e9nyeidnek megfelel\u0151 csomagot.", "demo1-section-desc"),
    div("demo1-pricing-grid", plans.map((p) =>
      div(`demo1-price-card${p.featured ? " demo1-price-card--featured" : ""}`, [
        heading(3, p.name),
        div("demo1-price-amount", [
          para(p.price, "demo1-price-value"),
          para(p.period, "demo1-price-period"),
        ]),
        div("demo1-price-features", p.features.map((f) =>
          div("demo1-price-feature", [para(`\u2713 ${f}`)])
        )),
        button(p.featured ? "V\u00e1lasztom" : "Elind\u00edt\u00e1s", p.featured ? "demo-btn" : "demo-btn demo-btn-outline"),
      ])
    )),
  ]);
}

function buildFaq(): CreateDOMElemOptions {
  const items = [
    { q: "Milyen licensz alatt m\u0171k\u00f6dik?", a: "MIT licensz alatt, teljesen ingyenesen haszn\u00e1lhatod b\u00e1rmilyen projektben, ak\u00e1r kereskedelmi c\u00e9lra is." },
    { q: "Sz\u00fcks\u00e9ges-e framework?", a: "Nem. A k\u00f6nyvt\u00e1r f\u00fcggetlen b\u00e1rmilyen frameworkt\u0151l. Haszn\u00e1lhatod vanilla JS-ben, Reactben, Vue-ban vagy b\u00e1rmilyen m\u00e1s k\u00f6rnyezetben." },
    { q: "Hogyan telep\u00edthetem?", a: "Egyszer\u0171en futtasd az 'npm install createDOMBlocks' parancsot, vagy haszn\u00e1ld a CDN linket egyetlen HTML f\u00e1jlban." },
    { q: "Van-e TypeScript t\u00e1mogat\u00e1s?", a: "Igen, teljes TypeScript t\u00edpusbiztons\u00e1got k\u00edn\u00e1lunk, bele\u00e9rtve az IntelliSense t\u00e1mogat\u00e1st is." },
  ];
  return section("demo1-faq", [
    heading(2, "Gyakori k\u00e9rd\u00e9sek", "demo1-section-title"),
    div("demo1-faq-list", items.map((item, i) => {
      const answerId = `faq-a-${i}`;
      return div("demo1-faq-item", [
        {
          tag: "div",
          attrs: { class: "demo1-faq-q" },
          text: item.q,
          handleEvent: {
            event: "click",
            cb: () => {
              const answer = document.getElementById(answerId);
              if (answer) answer.classList.toggle("demo1-faq-a--open");
            },
          },
        },
        { tag: "div", attrs: { class: "demo1-faq-a", id: answerId }, children: [para(item.a)] },
      ]);
    })),
  ]);
}

function buildCta(): CreateDOMElemOptions {
  return section("demo1-cta", [
    heading(2, "Kezdd el m\u00e9g ma"),
    para("Csatlakozz t\u00f6bb ezer fejleszt\u0151h\u00f6z, akik m\u00e1r haszn\u00e1lj\u00e1k a createDOMBlocks-t."),
    button("Ingyenes let\u00f6lt\u00e9s"),
  ]);
}

function buildFooter(): CreateDOMElemOptions {
  return {
    tag: "footer",
    attrs: { class: "demo1-footer" },
    children: [
      para("\u00a9 2024 createDOMBlocks. Minden jog fenntartva."),
      div("demo1-footer-links", [
        { tag: "a", text: "Adatv\u00e9delem", attrs: { href: "#" } },
        { tag: "a", text: "Felhaszn\u00e1l\u00e1si felt\u00e9telek", attrs: { href: "#" } },
        { tag: "a", text: "Kapcsolat", attrs: { href: "#" } },
      ]),
    ],
  };
}

page.appendChild(createDOMElem(buildNav()));
page.appendChild(createDOMElem(buildBadge()));
page.appendChild(createDOMElem(buildHero()));
page.appendChild(createDOMElem(buildLogos()));
page.appendChild(createDOMElem(buildBento()));
page.appendChild(createDOMElem(buildStats()));
page.appendChild(createDOMElem(buildPricing()));
page.appendChild(createDOMElem(buildFaq()));
page.appendChild(createDOMElem(buildCta()));
page.appendChild(createDOMElem(buildFooter()));
