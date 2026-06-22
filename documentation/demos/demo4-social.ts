import { createButton, createDivider, createTextInput, createImage } from "../../src/index";
import { createDOMElem } from "domelemjs";

const app = document.getElementById("app")!;

const page = createDOMElem({ tag: "div", attrs: { class: "demo4-page" } });
app.appendChild(page);

createDOMElem({
  tag: "div",
  attrs: { class: "demo4-left-sidebar" },
  parent: page,
  children: [
    createDOMElem({ tag: "div", text: "💬 SocialHub", attrs: { class: "demo4-brand" } }),
    createDOMElem({
      tag: "a",
      text: "← Vissza",
      attrs: { class: "demo4-nav-item", href: "index.html", style: { marginBottom: "0.5rem" } },
    }),
    createDOMElem({ tag: "button", text: "Új bejegyzés", attrs: { class: "demo4-compose-btn" } }),
    createDOMElem({
      tag: "nav",
      attrs: { class: "demo4-nav-items" },
      children: [
        ...[
          { icon: "🏠", label: "Kezdőlap", active: true },
          { icon: "🔍", label: "Keresés" },
          { icon: "🔔", label: "Értesítések", badge: "3" },
          { icon: "✉️", label: "Üzenetek", badge: "12" },
          { icon: "📑", label: "Könyvjelzők" },
          { icon: "👤", label: "Profilom" },
          { icon: "⚙️", label: "Beállítások" },
        ].map((item) =>
          createDOMElem({
            tag: "a",
            attrs: { class: `demo4-nav-item${item.active ? " active" : ""}`, href: "#" },
            children: [
              createDOMElem({ tag: "span", text: item.icon }),
              createDOMElem({ tag: "span", text: item.label }),
              ...(item.badge ? [createDOMElem({ tag: "span", text: item.badge, attrs: { class: "demo4-nav-badge" } })] : []),
            ],
          })
        ),
      ],
    }),
  ],
});

const feed = createDOMElem({
  tag: "div",
  attrs: { class: "demo4-feed" },
  parent: page,
  children: [
    createDOMElem({
      tag: "div",
      attrs: { class: "demo4-feed-header" },
      children: [
        createDOMElem({
          tag: "div",
          attrs: { class: "demo4-feed-tabs" },
          children: [
            createDOMElem({ tag: "div", text: "Főoldal", attrs: { class: "demo4-feed-tab active" } }),
            createDOMElem({ tag: "div", text: "Népszerű", attrs: { class: "demo4-feed-tab" } }),
            createDOMElem({ tag: "div", text: "Követettek", attrs: { class: "demo4-feed-tab" } }),
          ],
        }),
      ],
    }),
  ],
});

const posts = [
  {
    name: "Kovács Anna",
    handle: "@kovacsanna",
    time: "2ó",
    content: "Elkészült a legújabb projektünk! 🚀 A createDOMBlocks segítségével hihetetlenül gyorsan tudtuk lefejleszni a teljes UI-t. Ajánlom mindenkinek!",
    image: "assets/demos/demo4-img1.jpg",
    likes: 234,
    comments: 45,
    shares: 12,
  },
  {
    name: "TechBlog Hungary",
    handle: "@techblog_hu",
    time: "5ó",
    content: "Összegyűjtöttük a 2024-es év legjobb TypeScript könyvtárait. Az első helyen a createDOMBlocks végzett, mint leginnovatívabb UI könyvtár. 🏆",
    likes: 892,
    comments: 127,
    shares: 340,
  },
  {
    name: "Nagy Béla",
    handle: "@nagybela",
    time: "8ó",
    content: "Reggel 6-kor kezdtem a kódolást, most délután 2 van és már kész is vagyok. 😅 A createDOMBlocks-val tényleg ilyen gyors a fejlesztés. Korábban 3 napba telt volna.",
    image: "assets/demos/demo4-img2.jpg",
    likes: 567,
    comments: 89,
    shares: 45,
  },
  {
    name: "Szabó Eszter",
    handle: "@szaboeszter",
    time: "12ó",
    content: "Tippek kezdő fejlesztőknek:\n\n1. Használj TypeScript-et\n2. Válassz jó könyvtárakat (pl. createDOMBlocks)\n3. Írj teszteket\n4. Ne félj kérdezni\n\n#webfejlesztés #typescript",
    likes: 1203,
    comments: 201,
    shares: 567,
  },
];

posts.forEach((post) => {
  createDOMElem({
    tag: "div",
    attrs: { class: "demo4-post" },
    parent: feed,
    children: [
      createDOMElem({
        tag: "div",
        attrs: { class: "demo4-post-header" },
        children: [
          createDOMElem({
            tag: "div",
            style: { width: "32px", height: "32px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "600", flexShrink: "0" },
            text: post.name.split(" ").map((n: string) => n[0]).join(""),
          }),
          createDOMElem({
            tag: "div",
            children: [
              createDOMElem({ tag: "div", text: post.name, attrs: { class: "demo4-post-author" } }),
              createDOMElem({ tag: "div", text: post.handle, attrs: { class: "demo4-post-handle" } }),
            ],
          }),
          createDOMElem({ tag: "div", text: post.time, attrs: { class: "demo4-post-time" } }),
        ],
      }),
      createDOMElem({ tag: "div", text: post.content, attrs: { class: "demo4-post-content" } }),
      ...(post.image
        ? [
            createDOMElem({
              tag: "div",
              attrs: { class: "demo4-post-image" },
              children: [
                createDOMElem({ tag: "img", attrs: { src: post.image, alt: "Post image" } }),
              ],
            }),
          ]
        : []),
      createDOMElem({
        tag: "div",
        attrs: { class: "demo4-post-actions" },
        children: [
          createDOMElem({
            tag: "div",
            attrs: { class: "demo4-post-action" },
            children: [
              createDOMElem({ tag: "span", text: "❤️" }),
              createDOMElem({ tag: "span", text: `${post.likes}` }),
            ],
          }),
          createDOMElem({
            tag: "div",
            attrs: { class: "demo4-post-action" },
            children: [
              createDOMElem({ tag: "span", text: "💬" }),
              createDOMElem({ tag: "span", text: `${post.comments}` }),
            ],
          }),
          createDOMElem({
            tag: "div",
            attrs: { class: "demo4-post-action" },
            children: [
              createDOMElem({ tag: "span", text: "🔄" }),
              createDOMElem({ tag: "span", text: `${post.shares}` }),
            ],
          }),
          createDOMElem({
            tag: "div",
            attrs: { class: "demo4-post-action" },
            children: [
              createDOMElem({ tag: "span", text: "🔖" }),
            ],
          }),
        ],
      }),
    ],
  });
});

createDOMElem({
  tag: "div",
  attrs: { class: "demo4-right-sidebar" },
  parent: page,
  children: [
    createDOMElem({
      tag: "input",
      attrs: { class: "demo4-search", placeholder: "Keresés..." },
    }),
    createDOMElem({
      tag: "div",
      attrs: { class: "demo4-trending" },
      children: [
        createDOMElem({ tag: "h3", text: "Felkapott" }),
        ...[
          { category: "Technológia", topic: "#createDOMBlocks", count: "12.5K bejegyzés" },
          { category: "Programozás", topic: "#TypeScript2024", count: "8.2K bejegyzés" },
          { category: "Tech", topic: "#WebDev", count: "45K bejegyzés" },
          { category: "Startup", topic: "#IndieHacker", count: "3.1K bejegyzés" },
        ].map((t) =>
          createDOMElem({
            tag: "div",
            attrs: { class: "demo4-trending-item" },
            children: [
              createDOMElem({ tag: "div", text: t.category, attrs: { class: "demo4-trending-category" } }),
              createDOMElem({ tag: "div", text: t.topic, attrs: { class: "demo4-trending-topic" } }),
              createDOMElem({ tag: "div", text: t.count, attrs: { class: "demo4-trending-count" } }),
            ],
          })
        ),
      ],
    }),
    createDOMElem({
      tag: "div",
      attrs: { class: "demo4-suggested" },
      children: [
        createDOMElem({ tag: "h3", text: "Ajánlott felhasználók" }),
        ...[
          { name: "Tóth Gábor", handle: "@tothgabor" },
          { name: "Horváth Laura", handle: "@horvathlaura" },
          { name: "React Hungary", handle: "@react_hu" },
        ].map((u) =>
          createDOMElem({
            tag: "div",
            attrs: { class: "demo4-suggested-user" },
            children: [
              createDOMElem({
                tag: "div",
                style: { width: "32px", height: "32px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "600", flexShrink: "0" },
                text: u.name.split(" ").map((n: string) => n[0]).join(""),
              }),
              createDOMElem({
                tag: "div",
                attrs: { class: "demo4-suggested-info" },
                children: [
                  createDOMElem({ tag: "div", text: u.name, attrs: { class: "demo4-suggested-name" } }),
                  createDOMElem({ tag: "div", text: u.handle, attrs: { class: "demo4-suggested-handle" } }),
                ],
              }),
              createDOMElem({ tag: "button", text: "Követés", attrs: { class: "demo4-follow-btn" } }),
            ],
          })
        ),
      ],
    }),
  ],
});
