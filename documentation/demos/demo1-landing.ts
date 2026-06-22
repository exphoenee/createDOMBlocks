import { createCard, createGrid, createContainer, createImage, createLink, createDivider, createTitle, createParagraph, createBadge, createAvatar, createCarousel } from "../../src/index";
import { createDOMElem } from "domelemjs";

const app = document.getElementById("app")!;

createContainer({ parent: app, id: "demo1-container" });
const container = document.getElementById("demo1-container")!;

createDOMElem({
  tag: "div",
  attrs: { class: "demo1-hero" },
  parent: container,
  children: [
    createDOMElem({ tag: "h1", text: "Alakítsd át a webfejlesztést" }),
    createDOMElem({ tag: "p", text: "Gyors, moduláris és rugalmas TypeScript könyvtár komplex HTML blokkok létrehozásához. Több mint 50 komponens." }),
    createDOMElem({
      tag: "div",
      style: { display: "flex", gap: "1rem", justifyContent: "center" },
      children: [
      createDOMElem({ tag: "button", text: "Kezd el most", attrs: { class: "btn", id: "hero-cta" } }),
      createDOMElem({ tag: "button", text: "Dokumentáció", attrs: { class: "btn", id: "hero-docs" } }),
      ],
    }),
  ],
});

createTitle({ parent: container, id: "demo1-features-title", text: "Főbb jellemzők" }, 2);

createCarousel({
  parent: container,
  id: "demo1-features-carousel",
  slides: [
    { icon: "⚡", title: "Villámgyors", description: "Optimalizált teljesítmény" },
    { icon: "🧩", title: "Moduláris", description: "Tree-shakable" },
    { icon: "🎨", title: "Testreszabható", description: "Teljesen konfigurálható" },
    { icon: "🔒", title: "TypeScript", description: "Típusbiztonság" },
    { icon: "📦", title: "Egyszerű telepítés", description: "npm install" },
    { icon: "🌍", title: "Univerzális", description: "Bármilyen projektben" },
  ],
  showArrows: true,
  showDots: true,
});

createDivider({ parent: container, id: "demo1-divider-1" });

createDOMElem({
  tag: "div",
  attrs: { class: "demo1-features" },
  parent: container,
  children: [
    ...[
      { icon: "⚡", title: "Villámgyors", desc: "Optimalizált teljesítmény, minimális bundle méret." },
      { icon: "🧩", title: "Moduláris", desc: "Csak azt használod, amire szükséged van. Tree-shakable." },
      { icon: "🎨", title: "Testreszabható", desc: "Minden komponens teljesen konfigurálható." },
      { icon: "🔒", title: "TypeScript", desc: "Teljes típusbiztonság és IntelliSense támogatás." },
      { icon: "📦", title: "Egyszerű telepítés", desc: "npm install, és máris használhatod." },
      { icon: "🌍", title: "Univerzális", desc: "Működik bármilyen projektben: React, Vue, vagy vanilla JS." },
    ].map((f) =>
      createDOMElem({
        tag: "div",
        attrs: { class: "demo1-feature-card" },
        children: [
          createDOMElem({ tag: "div", text: f.icon, attrs: { class: "demo1-feature-icon" } }),
          createDOMElem({ tag: "h3", text: f.title }),
          createDOMElem({ tag: "p", text: f.desc }),
        ],
      })
    ),
  ],
});

createDivider({ parent: container, id: "demo1-divider-2" });

createTitle({ parent: container, id: "demo1-gallery-title", text: "Galéria" }, 2);

createDOMElem({
  tag: "div",
  attrs: { class: "demo1-gallery" },
  parent: container,
  children: [
    ...[
      { src: "assets/demos/demo1-img2.jpg", caption: "UI/UX Tervezés" },
      { src: "assets/demos/demo1-img3.jpg", caption: "Adatvizualizáció" },
      { src: "assets/demos/demo1-img4.jpg", caption: "Mobil fejlesztés" },
      { src: "assets/demos/demo1-img5.jpg", caption: "Felhő szolgáltatások" },
      { src: "assets/demos/demo1-img6.jpg", caption: "AI & Machine Learning" },
    ].map((img) =>
      createDOMElem({
        tag: "div",
        attrs: { class: "demo1-gallery-item" },
        children: [
          createDOMElem({ tag: "img", attrs: { src: img.src, alt: img.caption } }),
          createDOMElem({ tag: "div", text: img.caption, attrs: { class: "demo1-gallery-caption" } }),
        ],
      })
    ),
  ],
});

createDivider({ parent: container, id: "demo1-divider-3" });

createTitle({ parent: container, id: "demo1-pricing-title", text: "Árazás" }, 2);

createDOMElem({
  tag: "div",
  attrs: { class: "demo1-pricing" },
  parent: container,
  children: [
    ...[
      { name: "Ingyenes", price: "0", features: ["5 komponens", "Közösségi támogatás", "Alap dokumentáció"] },
      { name: "Pro", price: "990", featured: true, features: ["Összes komponens", "Prioritás támogatás", "Prémium dokumentáció", "Frissítések"] },
      { name: "Vállalati", price: "4990", features: ["Korlátlan", "Dedikált támogatás", "Forráskód", "SLA garancia"] },
    ].map((plan) =>
      createDOMElem({
        tag: "div",
        attrs: { class: `demo1-price-card${plan.featured ? " featured" : ""}` },
        children: [
          createDOMElem({ tag: "h3", text: plan.name }),
          createDOMElem({
            tag: "div",
            attrs: { class: "demo1-price-amount" },
            children: [
              createDOMElem({ tag: "span", text: plan.price }),
              createDOMElem({ tag: "span", text: " Ft/hó" }),
            ],
          }),
          createDOMElem({
            tag: "ul",
            style: { listStyle: "none", padding: 0, margin: "1.5rem 0", textAlign: "left" },
            children: plan.features.map((f) =>
              createDOMElem({ tag: "li", text: `✓ ${f}`, style: { padding: "0.375rem 0", fontSize: "0.9rem" } })
            ),
          }),
          createDOMElem({ tag: "button", text: plan.featured ? "Választom" : "Elindítás", attrs: { class: "btn", id: `plan-${plan.name.toLowerCase()}` } }),
        ],
      })
    ),
  ],
});

createDOMElem({
  tag: "div",
  attrs: { class: "demo1-cta" },
  parent: container,
  children: [
    createDOMElem({ tag: "h2", text: "Készen állsz?" }),
    createDOMElem({ tag: "p", text: "Csatlakozz több ezer fejlesztőhöz, akik már használják a createDOMBlocks-t." }),
    createDOMElem({ tag: "button", text: "Ingyenes letöltés", attrs: { class: "btn", id: "cta-download" } }),
  ],
});
