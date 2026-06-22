import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import { div, heading, para, avatarImg } from "./_shared";

const app = document.getElementById("app")!;
const page = createDOMElem(div("demo4-page"));
app.appendChild(page);

function buildSidebar(): CreateDOMElemOptions {
  const navItems = [
    { icon: "\ud83d\udcca", label: "\u00c1ttekint\u00e9s", active: true },
    { icon: "\ud83d\udcc8", label: "Forgalom", active: false },
    { icon: "\ud83d\udc65", label: "Felhaszn\u00e1l\u00f3k", active: false },
    { icon: "\ud83d\udcac", label: "\u00dczenetek", active: false },
    { icon: "\u2699\ufe0f", label: "Be\u00e1ll\u00edt\u00e1sok", active: false },
  ];
  return ({
    tag: "aside",
    attrs: { class: "demo4-sidebar" },
    children: [
      div("demo4-brand", [
        para("\u25e7", "demo4-brand-icon"),
        para("Pulse", "demo4-brand-text"),
      ]),
      { tag: "a", text: "\u2190 Vissza", attrs: { href: "index.html", class: "demo4-sidebar-link" } },
      ({
        tag: "nav",
        attrs: { class: "demo4-nav" },
        children: navItems.map((item) =>
          ({
            tag: "div",
            attrs: { class: `demo4-nav-item${item.active ? " demo4-nav-item--active" : ""}` },
            children: [
              para(item.icon, "demo4-nav-icon"),
              para(item.label, "demo4-nav-label"),
            ],
          } as CreateDOMElemOptions)
        ),
      } as CreateDOMElemOptions),
    ],
  } as CreateDOMElemOptions);
}

function buildTopbar(): CreateDOMElemOptions {
  return div("demo4-topbar", [
    heading(1, "\u00c1ttekint\u00e9s", "demo4-topbar-title"),
    div("demo4-topbar-right", [
      div("demo4-search-icon", [para("\ud83d\udd0d")]),
      avatarImg("demo4-img1.jpg", "Bejelentkezett felhaszn\u00e1l\u00f3", 36),
    ]),
  ]);
}

function buildKpis(): CreateDOMElemOptions {
  const kpis = [
    { label: "Bev\u00e9tel", value: "2.4M Ft", trend: "+12.5%", up: true },
    { label: "Rendel\u00e9sek", value: "1,234", trend: "+8.2%", up: true },
    { label: "Felhaszn\u00e1l\u00f3k", value: "5,678", trend: "+3.1%", up: true },
    { label: "Visszamutat\u00f3", value: "4.2%", trend: "-0.8%", up: false },
  ];
  return div("demo4-kpis", kpis.map((k) =>
    div("demo4-kpi", [
      para(k.label, "demo4-kpi-label"),
      para(k.value, "demo4-kpi-value"),
      para(`${k.up ? "\u2191" : "\u2193"} ${k.trend}`, `demo4-kpi-trend ${k.up ? "demo4-kpi-trend--up" : "demo4-kpi-trend--down"}`),
    ])
  ));
}

function buildCharts(): CreateDOMElemOptions {
  const heights = [40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100];
  const months = ["Jan", "Feb", "M\u00e1r", "\u00c1pr", "M\u00e1j", "J\u00fan", "J\u00fal", "Aug", "Szep", "Okt", "Nov", "Dec"];

  const activities = [
    { color: "var(--d-success)", text: "\u00daj rendel\u00e9s \u00e9rkezett: #1234", time: "2 perce" },
    { color: "var(--d-accent)", text: "Kov\u00e1cs Anna fizet\u00e9st teljes\u00edtett", time: "15 perce" },
    { color: "var(--d-warning)", text: "\u00daj regisztr\u00e1ci\u00f3: Szab\u00f3 P\u00e9ter", time: "1 \u00f3r\u00e1ja" },
    { color: "var(--d-success)", text: "Rendel\u00e9s kisz\u00e1ll\u00edtva: #1230", time: "2 \u00f3r\u00e1ja" },
    { color: "var(--d-error)", text: "Fizet\u00e9s sikertelen: #1228", time: "3 \u00f3r\u00e1ja" },
  ];

  return div("demo4-charts", [
    div("demo4-chart-card", [
      para("Havi bev\u00e9tel", "demo4-chart-title"),
      div("demo4-bar-chart", heights.map((h) =>
        ({
          tag: "div",
          attrs: { class: "demo4-bar" },
          style: { height: `${h}%`, background: h > 80 ? "var(--d-accent)" : "var(--d-accent-soft)" },
        } as CreateDOMElemOptions)
      )),
      div("demo4-bar-labels", months.map((m) => para(m, "demo4-bar-label"))),
    ]),
    div("demo4-chart-card", [
      para("Aktivit\u00e1s", "demo4-chart-title"),
      div("demo4-activity-list", activities.map((a) =>
        div("demo4-activity-item", [
          ({ tag: "div", attrs: { class: "demo4-activity-dot" }, style: { background: a.color } } as CreateDOMElemOptions),
          div("demo4-activity-content", [
            para(a.text, "demo4-activity-text"),
            para(a.time, "demo4-activity-time"),
          ]),
        ])
      )),
    ]),
  ]);
}

function buildTable(): CreateDOMElemOptions {
  const rows = [
    { customer: "Kov\u00e1cs Anna", avatar: "demo4-img2.jpg", product: "Pro csomag", amount: "49 900 Ft", status: "Teljes\u00edtve", badge: "success" },
    { customer: "Nagy B\u00e9la", avatar: "demo4-img3.jpg", product: "V\u00e1llalati", amount: "199 000 Ft", status: "Folyamatban", badge: "info" },
    { customer: "Szab\u00f3 Eszter", avatar: "demo4-img4.jpg", product: "Alap csomag", amount: "9 900 Ft", status: "Teljes\u00edtve", badge: "success" },
    { customer: "T\u00f3th G\u00e1bor", avatar: "demo4-img5.jpg", product: "Pro csomag", amount: "49 900 Ft", status: "Visszak\u00fcldve", badge: "error" },
  ];

  return div("demo4-table-card", [
    div("demo4-table-header", [
      heading(2, "Legut\u00f3bbi rendel\u00e9sek", "demo4-table-title"),
      para("\u00d6sszes megtekint\u00e9se", "demo4-table-link"),
    ]),
    ({
      tag: "table",
      attrs: { class: "demo4-table" },
      children: [
        ({
          tag: "thead",
          children: [
            ({
              tag: "tr",
              children: ["\u00dcgyf\u00e9l", "Term\u00e9k", "\u00d6sszeg", "St\u00e1tusz"].map((h) => ({ tag: "th", text: h })),
            }),
          ],
        }),
        ({
          tag: "tbody",
          children: rows.map((r) =>
            ({
              tag: "tr",
              children: [
                { tag: "td", children: [div("demo4-customer", [avatarImg(r.avatar, r.customer, 28), para(r.customer, "demo4-customer-name")])] },
                { tag: "td", text: r.product },
                { tag: "td", text: r.amount },
                { tag: "td", children: [({ tag: "span", text: r.status, attrs: { class: `demo4-badge demo4-badge--${r.badge}` } })] },
              ],
            })
          ),
        }),
      ],
    } as CreateDOMElemOptions),
  ]);
}

page.appendChild(createDOMElem(buildSidebar()));
const mainEl = createDOMElem(div("demo4-main"));
page.appendChild(mainEl);
mainEl.appendChild(createDOMElem(buildTopbar()));
mainEl.appendChild(createDOMElem(buildKpis()));
mainEl.appendChild(createDOMElem(buildCharts()));
mainEl.appendChild(createDOMElem(buildTable()));
