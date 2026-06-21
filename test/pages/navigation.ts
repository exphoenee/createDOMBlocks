import { createNav, createBreadcrumb, createTabs } from "../../src/index";

createNav({ parent: "#app-nav", id: "nav1", items: [
  { text: "Fooldal", href: "#", active: true },
  { text: "Rolunk", href: "#about" },
  { text: "Szolgaltatasok", href: "#services", children: [
    { text: "Webfejlesztes", href: "#" },
    { text: "Mobil app", href: "#" },
  ]},
  { text: "Kapcsolat", href: "#contact" },
]});

createBreadcrumb({ parent: "#app-bc", id: "breadcrumb1", items: [
  { text: "Fooldal", href: "#" },
  { text: "Termek", href: "#" },
  { text: "Laptop", href: "#" },
  { text: "Dell XPS 15" },
]});

createTabs({ parent: "#app-tabs", id: "tabs1", tabs: [
  { id: "tab1", label: "Beallitasok", content: { tag: "p", text: "Beallitasok tartalma" } },
  { id: "tab2", label: "Profil", content: { tag: "p", text: "Profil tartalma" } },
  { id: "tab3", label: "Ertesitesek", content: { tag: "p", text: "Ertesitesek tartalma" } },
]});
