import { createCard, createContainer, createBadge, createDivider, createCodeBlock, createTitle, createParagraph } from "../../src/index";
import { createDOMElem } from "domelemjs";

const app = document.getElementById("app")!;

const page = createDOMElem({ tag: "div", attrs: { class: "demo2-page" } });
app.appendChild(page);

const nav = createDOMElem({
  tag: "div",
  attrs: { class: "demo2-nav" },
  parent: page,
  children: [
    createDOMElem({ tag: "div", text: "⟨/⟩ TechFlow", attrs: { class: "demo2-nav-brand" } }),
    createDOMElem({
      tag: "ul",
      attrs: { class: "demo2-nav-links" },
      children: [
        createDOMElem({ tag: "li", children: [createDOMElem({ tag: "a", text: "← Vissza", attrs: { href: "index.html" } })] }),
        createDOMElem({ tag: "li", children: [createDOMElem({ tag: "a", text: "Főoldal", attrs: { href: "#" } })] }),
        createDOMElem({ tag: "li", children: [createDOMElem({ tag: "a", text: "Funkciók", attrs: { href: "#" } })] }),
        createDOMElem({ tag: "li", children: [createDOMElem({ tag: "a", text: "Dokumentáció", attrs: { href: "#" } })] }),
        createDOMElem({ tag: "li", children: [createDOMElem({ tag: "a", text: "Blog", attrs: { href: "#" } })] }),
      ],
    }),
  ],
});

createDOMElem({
  tag: "div",
  attrs: { class: "demo2-hero" },
  parent: page,
  children: [
    createDOMElem({ tag: "h1", text: "Építsd a jövőt velünk" }),
    createDOMElem({ tag: "p", text: "A legmodernebb technológiák egy helyen. Gyors, megbízható és skálázható megoldások a mindennapi fejlesztéshez." }),
    createDOMElem({
      tag: "div",
      style: { display: "flex", gap: "1rem", justifyContent: "center" },
      children: [
        createDOMElem({ tag: "button", text: "Megtekintés", attrs: { class: "btn", id: "tech-cta" } }),
        createDOMElem({ tag: "button", text: "Forráskód", attrs: { class: "btn", id: "tech-github" } }),
      ],
    }),
  ],
});

createDOMElem({
  tag: "div",
  attrs: { class: "demo2-stats" },
  parent: page,
  children: [
    ...[
      { value: "12K+", label: "GitHub csillag" },
      { value: "500K+", label: "Letöltés" },
      { value: "99.9%", label: "Uptime" },
      { value: "50ms", label: "Átlag válaszidő" },
    ].map((s) =>
      createDOMElem({
        tag: "div",
        attrs: { class: "demo2-stat" },
        children: [
          createDOMElem({ tag: "div", text: s.value, attrs: { class: "demo2-stat-value" } }),
          createDOMElem({ tag: "div", text: s.label, attrs: { class: "demo2-stat-label" } }),
        ],
      })
    ),
  ],
});

createDOMElem({
  tag: "div",
  attrs: { class: "demo2-terminal" },
  parent: page,
  children: [
    createDOMElem({
      tag: "div",
      attrs: { class: "demo2-terminal-header" },
      children: [
        createDOMElem({ tag: "div", attrs: { class: "demo2-terminal-dot red" } }),
        createDOMElem({ tag: "div", attrs: { class: "demo2-terminal-dot yellow" } }),
        createDOMElem({ tag: "div", attrs: { class: "demo2-terminal-dot green" } }),
      ],
    }),
    createDOMElem({
      tag: "div",
      attrs: { class: "demo2-terminal-body" },
      children: [
        createDOMElem({ tag: "div", content: '<span class="comment">// Telepítés</span>' }),
        createDOMElem({ tag: "div", content: '<span class="func">npm</span> <span class="keyword">install</span> <span class="string">techflow</span>' }),
        createDOMElem({ tag: "div", content: "" }),
        createDOMElem({ tag: "div", content: '<span class="comment">// Használat</span>' }),
        createDOMElem({ tag: "div", content: '<span class="keyword">import</span> { <span class="func">createApp</span> } <span class="keyword">from</span> <span class="string">"techflow"</span>;' }),
        createDOMElem({ tag: "div", content: "" }),
        createDOMElem({ tag: "div", content: '<span class="keyword">const</span> <span class="func">app</span> = <span class="func">createApp</span>({ <span class="string">debug</span>: <span class="keyword">true</span> });' }),
        createDOMElem({ tag: "div", content: '<span class="func">app</span>.<span class="func">mount</span>(<span class="string">"#root"</span>);' }),
      ],
    }),
  ],
});

createDOMElem({
  tag: "div",
  attrs: { class: "demo2-features" },
  parent: page,
  children: [
    ...[
      { icon: "🚀", title: "Gyors indulás", desc: "Másodpercek alatt elindulhatsz. Zero-config setup, azonnali hot-reload." },
      { icon: "🛡️", title: "Biztonság", desc: "Beépített XSS védelem, Content Security Policy és automatikus sérülékenység-figyelés." },
      { icon: "📊", title: "Monitoring", desc: "Valós idejű teljesítmény monitoring, hibakövetés és részletes naplózás." },
      { icon: "🔄", title: "CI/CD", desc: "Automatizált build, tesztelés és deployment pipeline-ok." },
      { icon: "🌐", title: "Edge Computing", desc: "Globális CDN hálózat, 300+ edge node világszerte." },
      { icon: "🤖", title: "AI Integráció", desc: "Beépített AI segéd, kód generálás és intelligens hibajavítás." },
    ].map((f) =>
      createDOMElem({
        tag: "div",
        attrs: { class: "demo2-feature" },
        children: [
          createDOMElem({ tag: "div", text: f.icon, attrs: { class: "demo2-feature-icon" } }),
          createDOMElem({ tag: "h3", text: f.title }),
          createDOMElem({ tag: "p", text: f.desc }),
        ],
      })
    ),
  ],
});

createDOMElem({ tag: "div", attrs: { style: { borderTop: "1px solid #334155", margin: "2rem 0" } }, parent: page });

createDOMElem({
  tag: "div",
  attrs: { class: "demo2-tech-stack" },
  parent: page,
  children: [
    ...[
      { icon: "⚛️", name: "React" },
      { icon: "🟢", name: "Node.js" },
      { icon: "🔷", name: "TypeScript" },
      { icon: "🐘", name: "PostgreSQL" },
      { icon: "🐳", name: "Docker" },
      { icon: "☸️", name: "Kubernetes" },
    ].map((t) =>
      createDOMElem({
        tag: "div",
        attrs: { class: "demo2-tech-item" },
        children: [
          createDOMElem({ tag: "div", text: t.icon, attrs: { class: "demo2-tech-item-icon" } }),
          createDOMElem({ tag: "div", text: t.name, attrs: { class: "demo2-tech-item-name" } }),
        ],
      })
    ),
  ],
});
