import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import { section, div, heading, para, button, stars, avatar, stepper, img, ASSET } from "./_shared";

const app = document.getElementById("app")!;
const page = createDOMElem(div("demo3-page"));
app.appendChild(page);

function buildBreadcrumb(): CreateDOMElemOptions {
  return div("demo3-breadcrumb", [
    { tag: "span", text: "F\u0151oldal", attrs: { class: "demo3-bc-link" } },
    { tag: "span", text: " \u203a " },
    { tag: "span", text: "Cip\u0151k", attrs: { class: "demo3-bc-link" } },
    { tag: "span", text: " \u203a " },
    { tag: "span", text: "Fut\u00f3cip\u0151" },
  ]);
}

function buildProduct(): CreateDOMElemOptions {
  const images = ["demo3-img1.jpg", "demo3-img2.jpg", "demo3-img3.jpg", "demo3-img4.jpg"];

  const thumbs = images.map((file, i) =>
    ({
      tag: "img",
      attrs: { src: `${ASSET}${file}`, alt: `Ultra Futócipő Pro – nézet ${i + 1}`, loading: "lazy", class: `demo3-gallery-thumb${i === 0 ? " demo3-gallery-thumb--active" : ""}` },
      handleEvent: {
        event: "click",
        cb: () => {
          document.querySelectorAll(".demo3-gallery-thumb").forEach((t) => t.classList.remove("demo3-gallery-thumb--active"));
          const allThumbs = document.querySelectorAll(".demo3-gallery-thumb");
          if (allThumbs[i]) allThumbs[i].classList.add("demo3-gallery-thumb--active");
          const main = document.querySelector(".demo3-gallery-main-img") as HTMLImageElement | null;
          if (main) main.src = `${ASSET}${file}`;
        },
      },
    } as CreateDOMElemOptions)
  );

  const swatchColors = ["#1a1a2e", "#3b82f6", "#ef4444"];
  const swatches = swatchColors.map((c, i) =>
    ({
      tag: "div",
      attrs: { class: `demo3-swatch${i === 0 ? " demo3-swatch--active" : ""}` },
      style: { background: c },
      handleEvent: {
        event: "click",
        cb: () => {
          document.querySelectorAll(".demo3-swatch").forEach((s) => s.classList.remove("demo3-swatch--active"));
          const allSwatches = document.querySelectorAll(".demo3-swatch");
          if (allSwatches[i]) allSwatches[i].classList.add("demo3-swatch--active");
        },
      },
    } as CreateDOMElemOptions)
  );

  const sizes = ["40", "41", "42"];
  const sizeButtons = sizes.map((s, i) =>
    ({
      tag: "div",
      text: s,
      attrs: { class: `demo3-size${i === 0 ? " demo3-size--active" : ""}` },
      handleEvent: {
        event: "click",
        cb: () => {
          document.querySelectorAll(".demo3-size").forEach((sz) => sz.classList.remove("demo3-size--active"));
          const allSizes = document.querySelectorAll(".demo3-size");
          if (allSizes[i]) allSizes[i].classList.add("demo3-size--active");
        },
      },
    } as CreateDOMElemOptions)
  );

  return section("demo3-product", [
    div("demo3-gallery", [
      div("demo3-gallery-main", [
        { tag: "img", attrs: { src: `${ASSET}${images[0]}`, alt: "Ultra Futócipő Pro", class: "demo3-gallery-main-img" } },
      ]),
      div("demo3-gallery-thumbs", thumbs),
    ]),
    div("demo3-info", [
      heading(1, "Ultra Fut\u00f3cip\u0151 Pro"),
      div("demo3-rating", [
        stars(4),
        para("(128 \u00e9rt\u00e9kel\u00e9s)", "demo3-rating-count"),
      ]),
      para("24 990 Ft", "demo3-price"),
      para("Sz\u00edn", "demo3-label"),
      div("demo3-swatches", swatches),
      para("M\u00e9ret", "demo3-label"),
      div("demo3-sizes", sizeButtons),
      para("Mennyis\u00e9g", "demo3-label"),
      stepper(1),
      button("Kos\u00e1rba", "demo-btn demo3-add-cart"),
    ]),
  ]);
}

function buildTabs(): CreateDOMElemOptions {
  const labels = ["Le\u00edr\u00e1s", "Param\u00e9terek", "\u00c9rt\u00e9kel\u00e9sek"];

  const panelContents: CreateDOMElemOptions[][] = [
    [
      para("Az Ultra Futt\u00f3cip\u00f3 Pro a legfejletteb technol\u00f3gi\u00e1val k\u00e9sz\u00fclt fut\u00f3cip\u0151, amely kiv\u00e1l\u00f3 teljes\u00edtm\u00e9nyt ny\u00fajt minden terepen."),
      para("A l\u00e9g\u00e1teres mesh fels\u0151r\u00e9s\u00e9s az EVA hab talp k\u00f6nny\u0171s\u00e9get \u00e9s k\u00f6nnyed\u00e9t biztos\u00edt minden l\u00e9p\u00e9sn\u00e9l. Ide\u00e1lis hossz\u00fa t\u00e1v\u00f3 futasokhoz \u00e9s maratoni versenyekhez."),
    ],
    [
      div("demo3-param", [para("T\u00f6meg", "demo3-param-label"), para("280g", "demo3-param-value")]),
      div("demo3-param", [para("Anyag", "demo3-param-label"), para("Mesh", "demo3-param-value")]),
      div("demo3-param", [para("Talp", "demo3-param-label"), para("EVA hab", "demo3-param-value")]),
      div("demo3-param", [para("Sz\u00edn", "demo3-param-label"), para("T\u00f6bbf\u00e9le", "demo3-param-value")]),
    ],
    [
      ...([
        { name: "Kov\u00e1cs B\u00e9la", initials: "KB", rating: 5, date: "2024.03.15.", text: "Fantasztikus cip\u0151! A t\u00e1mogat\u00e1s kiv\u00e1l\u00f3, k\u00f6nny\u0171 \u00e9s k\u00e9nyelmes." },
        { name: "Nagy Eszter", initials: "NE", rating: 4, date: "2024.03.10.", text: "J\u00f3 min\u0151s\u00e9g, de egy kicsit sz\u0171knek \u00e9rzem a l\u00e1bujj r\u00e9szt." },
        { name: "Szab\u00f3 P\u00e9ter", initials: "SP", rating: 4, date: "2024.02.28.", text: "Sz\u00e9p design \u00e9s j\u00f3 tapad\u00e1s. Aj\u00e1nlom fut\u00f3knak." },
      ]).map((r) =>
        div("demo3-review", [
          avatar(r.initials),
          div("demo3-review-body", [
            div("demo3-review-header", [
              para(r.name, "demo3-review-name"),
              para(r.date, "demo3-review-date"),
            ]),
            stars(r.rating, 5, "demo3-stars demo3-stars--sm"),
            para(r.text, "demo3-review-text"),
          ]),
        ])
      ),
    ],
  ];

  const tabItems: CreateDOMElemOptions[] = [];
  labels.forEach((label, i) => {
    tabItems.push({
      tag: "div",
      text: label,
      attrs: { class: `demo3-tab${i === 0 ? " demo3-tab--active" : ""}` },
      handleEvent: {
        event: "click",
        cb: () => {
          document.querySelectorAll(".demo3-tab").forEach((t) => t.classList.remove("demo3-tab--active"));
          const allTabs = document.querySelectorAll(".demo3-tab");
          if (allTabs[i]) allTabs[i].classList.add("demo3-tab--active");
          const container = document.querySelector(".demo3-tab-panels");
          if (container) {
            container.innerHTML = "";
            container.appendChild(createDOMElem(div("demo3-panel demo3-panel--active", panelContents[i])));
          }
        },
      },
    });
  });

  return section("demo3-tabs", [
    div("demo3-tabs-header", tabItems),
    div("demo3-tab-panels", [div("demo3-panel demo3-panel--active", panelContents[0])]),
  ]);
}

function buildRelated(): CreateDOMElemOptions {
  const products = [
    { name: "Trail Runner X", price: "19 990 Ft", image: "demo3-img5.jpg" },
    { name: "Urban Sneaker", price: "15 990 Ft", image: "demo3-img6.jpg" },
    { name: "Marathon Elite", price: "29 990 Ft", image: "demo3-img7.jpg" },
    { name: "Sport Sand\u00e1l", price: "12 990 Ft", image: "demo3-img8.jpg" },
  ];
  return section("demo3-related", [
    heading(2, "Kapcsol\u00f3d\u00f3 term\u00e9kek", "demo3-section-title"),
    div("demo3-related-grid", products.map((p) =>
      div("demo3-related-card", [
        img(p.image, p.name, "demo3-related-img"),
        div("demo3-related-info", [
          heading(3, p.name, "demo3-related-name"),
          para(p.price, "demo3-related-price"),
          button("Megtekint\u00e9s", "demo-btn demo-btn-outline"),
        ]),
      ])
    )),
  ]);
}

page.appendChild(createDOMElem(buildBreadcrumb()));
page.appendChild(createDOMElem(buildProduct()));
page.appendChild(createDOMElem(buildTabs()));
page.appendChild(createDOMElem(buildRelated()));
