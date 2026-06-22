import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import { section, div, heading, para, button, chip, img } from "./_shared";

const app = document.getElementById("app")!;
const page = createDOMElem(div("demo2-page"));
app.appendChild(page);

function buildNav(): CreateDOMElemOptions {
  return {
    tag: "nav",
    attrs: { class: "demo2-nav" },
    children: [
      div("demo2-nav-left", [
        { tag: "a", text: "\u2190 Vissza", attrs: { href: "index.html", class: "demo2-nav-back" } },
        div("demo2-nav-brand", [heading(3, "\u2726 Studio")]),
      ]),
      div("demo2-nav-links", [
        { tag: "a", text: "Munk\u00e1k", attrs: { href: "#gallery" } },
        { tag: "a", text: "R\u00f3lam", attrs: { href: "#timeline" } },
        { tag: "a", text: "Kapcsolat", attrs: { href: "#contact" } },
      ]),
    ],
  };
}

function buildHero(): CreateDOMElemOptions {
  return section("demo2-hero", [
    div("demo2-avatar", [
      img("demo2-img1.jpg", "Kovács Anna", "demo2-avatar-img"),
    ]),
    heading(1, "Kov\u00e1cs Anna"),
    para("Term\u00e9kdiz\u00e1jner & Frontend fejleszt\u0151", "demo2-hero-sub"),
    para("Gy\u00f6ny\u00f6r\u0171 \u00e9s funkcion\u00e1lis fel\u00fcleteket tervezek, amelyek az emberek \u00e9let\u00e9t egyszer\u0171bb\u00e9 teszik.", "demo2-hero-bio"),
    div("demo2-hero-actions", [button("Kapcsolat")]),
    div("demo2-chips", [
      chip("React"), chip("TypeScript"), chip("Figma"), chip("CSS"), chip("Node.js"),
    ]),
  ]);
}

function buildGallery(): CreateDOMElemOptions {
  const projects = [
    { title: "E-Commerce UI", cat: "Term\u00e9ktervez\u00e9s", image: "demo2-img2.jpg", cls: "demo2-gallery-item--wide" },
    { title: "Mobil App", cat: "UI/UX", image: "demo2-img3.jpg", cls: "" },
    { title: "Design Rendszer", cat: "Komponensk\u00f6nyvt\u00e1r", image: "demo2-img4.jpg", cls: "" },
    { title: "AI Dashboard", cat: "Adatvizualiz\u00e1ci\u00f3", image: "demo2-img5.jpg", cls: "demo2-gallery-item--tall" },
  ];
  return section("demo2-gallery", [
    heading(2, "Kiemelt munk\u00e1k", "demo2-section-title"),
    div("demo2-gallery-grid", projects.map((p) =>
      ({
        tag: "div",
        attrs: { class: `demo2-gallery-item${p.cls ? " " + p.cls : ""}` },
        children: [
          img(p.image, p.title, "demo2-gallery-img"),
          div("demo2-gallery-info", [
            heading(3, p.title),
            para(p.cat, "demo2-gallery-cat"),
          ]),
        ],
      } as CreateDOMElemOptions)
    )),
  ]);
}

function buildTimeline(): CreateDOMElemOptions {
  const entries = [
    { year: "2023\u2013jelenleg", role: "Senior Term\u00e9kdiz\u00e1jner", company: "TechFlow", desc: "Term\u00e9kstrat\u00e9gia \u00e9s UI/UX ir\u00e1ny\u00edt\u00e1s. Design rendszer ki\u00e9p\u00edt\u00e9se 50+ komponenssel." },
    { year: "2020\u20132023", role: "Frontend fejleszt\u0151", company: "WebStudio", desc: "React \u00e9s TypeScript alap\u00fa webalkalmaz\u00e1sok fejleszt\u00e9se. Performanciaoptimaliz\u00e1l\u00e1s." },
    { year: "2018\u20132020", role: "Junior diz\u00e1jner", company: "CreativeLabs", desc: "Mobil \u00e9s webes fel\u00fcletek tervez\u00e9se. Protot\u00edpusok k\u00e9sz\u00edt\u00e9se Figm\u00e1ban." },
  ];
  return section("demo2-timeline", [
    heading(2, "Tapasztalat", "demo2-section-title"),
    div("demo2-timeline-list", entries.map((e) =>
      ({
        tag: "div",
        attrs: { class: "demo2-timeline-item" },
        children: [
          para(e.year, "demo2-timeline-year"),
          div("demo2-timeline-card", [
            heading(3, e.role),
            para(e.company, "demo2-timeline-company"),
            para(e.desc, "demo2-timeline-desc"),
          ]),
        ],
      } as CreateDOMElemOptions)
    )),
  ]);
}

function buildContact(): CreateDOMElemOptions {
  return section("demo2-contact", [
    heading(2, "Kapcsolat", "demo2-section-title"),
    ({
      tag: "div",
      attrs: { class: "demo2-contact-card" },
      children: [
        div("demo2-form-field", [
          { tag: "label", text: "N\u00e9v", attrs: { for: "demo2-name" } },
          { tag: "div", text: "Kov\u00e1cs Anna", attrs: { class: "demo2-form-input" } },
        ]),
        div("demo2-form-field", [
          { tag: "label", text: "E-mail", attrs: { for: "demo2-email" } },
          { tag: "div", text: "anna@example.com", attrs: { class: "demo2-form-input" } },
        ]),
        div("demo2-form-field", [
          { tag: "label", text: "\u00dczenet", attrs: { for: "demo2-msg" } },
          { tag: "div", text: "Szeretn\u00e9k \u00e9rdekl\u0151dni a k\u00f6z\u00f6s munka lehet\u0151s\u00e9g\u00e9r\u0151l...", attrs: { class: "demo2-form-textarea" } },
        ]),
        button("K\u00fcld\u00e9s"),
      ],
    } as CreateDOMElemOptions),
  ]);
}

page.appendChild(createDOMElem(buildNav()));
page.appendChild(createDOMElem(buildHero()));
page.appendChild(createDOMElem(buildGallery()));
page.appendChild(createDOMElem(buildTimeline()));
page.appendChild(createDOMElem(buildContact()));
