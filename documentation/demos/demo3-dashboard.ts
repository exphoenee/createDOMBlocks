import { createBadge, createTable, createAvatar, createDivider, createAlert, createProgressBar, createCard } from "../../src/index";
import { createDOMElem } from "domelemjs";

const app = document.getElementById("app")!;

const page = createDOMElem({ tag: "div", attrs: { class: "demo3-page" } });
app.appendChild(page);

const sidebar = createDOMElem({
  tag: "div",
  attrs: { class: "demo3-sidebar" },
  parent: page,
  children: [
    createDOMElem({ tag: "div", text: "📊 Dashboard", attrs: { class: "demo3-sidebar-brand" } }),
    createDOMElem({
      tag: "a",
      text: "← Vissza",
      attrs: { class: "demo3-sidebar-link", href: "index.html", style: { marginBottom: "1rem", display: "inline-block" } },
    }),
    createDOMElem({
      tag: "nav",
      attrs: { class: "demo3-sidebar-nav" },
      children: [
        ...[
          { icon: "📋", label: "Áttekintés", active: true },
          { icon: "📈", label: "Analitika" },
          { icon: "👥", label: "Felhasználók" },
          { icon: "🛒", label: "Rendelések" },
          { icon: "📦", label: "Termékek" },
          { icon: "💬", label: "Üzenetek" },
          { icon: "⚙️", label: "Beállítások" },
        ].map((item) =>
          createDOMElem({
            tag: "a",
            text: `${item.icon}  ${item.label}`,
            attrs: { class: `demo3-sidebar-link${item.active ? " active" : ""}`, href: "#" },
          })
        ),
      ],
    }),
  ],
});

const main = createDOMElem({
  tag: "div",
  attrs: { class: "demo3-main" },
  parent: page,
});

const topbar = createDOMElem({
  tag: "div",
  attrs: { class: "demo3-topbar" },
  parent: main,
  children: [
    createDOMElem({ tag: "h1", text: "Áttekintés" }),
    createDOMElem({
      tag: "div",
      attrs: { class: "demo3-topbar-actions" },
      children: [
        createDOMElem({ tag: "button", text: "+ Új rendelés", attrs: { class: "btn", id: "dash-new" } }),
        createDOMElem({
          tag: "div",
          style: { display: "flex", alignItems: "center", gap: "0.5rem" },
          children: [
            createDOMElem({ tag: "div", attrs: { class: "demo3-avatar-wrapper" }, children: [
              createDOMElem({ tag: "div", text: "VB", attrs: { style: { width: "28px", height: "28px", borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "600" } } }),
            ]}),
            createDOMElem({ tag: "span", text: "Viktor", style: { fontSize: "0.875rem" } }),
          ],
        }),
      ],
    }),
  ],
});

createDOMElem({
  tag: "div",
  attrs: { class: "demo3-stats" },
  parent: main,
  children: [
    ...[
      { label: "Bevétel", value: "2.4M Ft", change: "+12.5%", positive: true },
      { label: "Rendelések", value: "1,234", change: "+8.2%", positive: true },
      { label: "Felhasználók", value: "5,678", change: "+3.1%", positive: true },
      { label: "Visszamutató", value: "4.2%", change: "-0.8%", positive: false },
    ].map((s) =>
      createDOMElem({
        tag: "div",
        attrs: { class: "demo3-stat-card" },
        children: [
          createDOMElem({ tag: "div", text: s.label, attrs: { class: "demo3-stat-label" } }),
          createDOMElem({ tag: "div", text: s.value, attrs: { class: "demo3-stat-value" } }),
          createDOMElem({ tag: "div", text: s.change, attrs: { class: `demo3-stat-change ${s.positive ? "positive" : "negative"}` } }),
        ],
      })
    ),
  ],
});

createDOMElem({
  tag: "div",
  attrs: { class: "demo3-charts" },
  parent: main,
  children: [
    createDOMElem({
      tag: "div",
      attrs: { class: "demo3-chart-card" },
      children: [
        createDOMElem({ tag: "div", text: "Havi bevétel", attrs: { class: "demo3-chart-title" } }),
        createDOMElem({
          tag: "div",
          attrs: { class: "demo3-bar-chart" },
          children: [
            ...[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) =>
              createDOMElem({
                tag: "div",
                attrs: { class: "demo3-bar", style: { height: `${h}%`, background: h > 80 ? "#3b82f6" : "#93c5fd" } },
              })
            ),
          ],
        }),
        createDOMElem({
          tag: "div",
          style: { display: "flex", justifyContent: "space-between", marginTop: "0.5rem" },
          parent: undefined,
          children: [
            ...["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Szep", "Okt", "Nov", "Dec"].map((m) =>
              createDOMElem({ tag: "div", text: m, style: { fontSize: "0.7rem", color: "#94a3b8", flex: "1", textAlign: "center" } })
            ),
          ],
        }),
      ],
    }),
    createDOMElem({
      tag: "div",
      attrs: { class: "demo3-chart-card" },
      children: [
        createDOMElem({ tag: "div", text: "Rendelések forrása", attrs: { class: "demo3-chart-title" } }),
        createDOMElem({
          tag: "div",
          attrs: { class: "demo3-donut" },
          children: [
            createDOMElem({
              tag: "div",
              attrs: { class: "demo3-donut-circle", style: { background: "conic-gradient(#3b82f6 0% 45%, #22c55e 45% 70%, #f59e0b 70% 85%, #94a3b8 85% 100%)" } },
              children: [
                createDOMElem({
                  tag: "div",
                  style: { position: "absolute", inset: "25px", background: "#fff", borderRadius: "50%" },
                }),
              ],
            }),
            createDOMElem({
              tag: "div",
              attrs: { class: "demo3-donut-legend" },
              children: [
                ...[
                  { color: "#3b82f6", label: "Web (45%)" },
                  { color: "#22c55e", label: "Mobil (25%)" },
                  { color: "#f59e0b", label: "API (15%)" },
                  { color: "#94a3b8", label: "Egyéb (15%)" },
                ].map((l) =>
                  createDOMElem({
                    tag: "div",
                    attrs: { class: "demo3-legend-item" },
                    children: [
                      createDOMElem({ tag: "div", attrs: { class: "demo3-legend-dot", style: { background: l.color } } }),
                      createDOMElem({ tag: "span", text: l.label }),
                    ],
                  })
                ),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

createDOMElem({
  tag: "div",
  attrs: { class: "demo3-bottom" },
  parent: main,
  children: [
    createDOMElem({
      tag: "div",
      attrs: { class: "demo3-table-card" },
      children: [
        createDOMElem({
          tag: "div",
          attrs: { class: "demo3-table-header" },
          children: [
            createDOMElem({ tag: "h3", text: "Legutóbbi rendelések" }),
            createDOMElem({ tag: "a", text: "Összes megtekintése", attrs: { href: "#", style: { fontSize: "0.8rem", color: "#3b82f6", textDecoration: "none" } } }),
          ],
        }),
        createDOMElem({
          tag: "table",
          attrs: { class: "demo3-mini-table" },
          children: [
            createDOMElem({
              tag: "thead",
              children: [
                createDOMElem({
                  tag: "tr",
                  children: [
                    createDOMElem({ tag: "th", text: "Ügyfél" }),
                    createDOMElem({ tag: "th", text: "Termék" }),
                    createDOMElem({ tag: "th", text: "Összeg" }),
                    createDOMElem({ tag: "th", text: "Státusz" }),
                  ],
                }),
              ],
            }),
            createDOMElem({
              tag: "tbody",
              children: [
                ...[
                  { customer: "Kovács Anna", product: "Pro csomag", amount: "49,900 Ft", status: "Teljesítve", type: "success" },
                  { customer: "Nagy Béla", product: "Vállalati", amount: "199,000 Ft", status: "Folyamatban", type: "info" },
                  { customer: "Szabó Eszter", product: "Alap csomag", amount: "9,900 Ft", status: "Teljesítve", type: "success" },
                  { customer: "Tóth Gábor", product: "Pro csomag", amount: "49,900 Ft", status: "Visszaküldve", type: "error" },
                ].map((r) =>
                  createDOMElem({
                    tag: "tr",
                    children: [
                      createDOMElem({ tag: "td", text: r.customer }),
                      createDOMElem({ tag: "td", text: r.product }),
                      createDOMElem({ tag: "td", text: r.amount }),
                      createDOMElem({
                        tag: "td",
                        children: [
                          createDOMElem({
                            tag: "span",
                            text: r.status,
                            attrs: {
                              style: {
                                display: "inline-block",
                                padding: "0.125rem 0.5rem",
                                borderRadius: "1rem",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                background: r.type === "success" ? "#dcfce7" : r.type === "info" ? "#dbeafe" : "#fee2e2",
                                color: r.type === "success" ? "#166534" : r.type === "info" ? "#1e40af" : "#991b1b",
                              },
                            },
                          }),
                        ],
                      }),
                    ],
                  })
                ),
              ],
            }),
          ],
        }),
      ],
    }),
    createDOMElem({
      tag: "div",
      attrs: { class: "demo3-activity-card" },
      children: [
        createDOMElem({ tag: "h3", text: "Legutóbbi tevékenység", style: { fontSize: "0.9rem", fontWeight: "600", marginBottom: "1rem" } }),
        createDOMElem({
          tag: "div",
          attrs: { class: "demo3-activity-list" },
          children: [
            ...[
              { color: "#22c55e", text: "Új rendelés érkezett: #1234", time: "2 perce" },
              { color: "#3b82f6", text: "Kovács Anna fizetést teljesített", time: "15 perce" },
              { color: "#f59e0b", text: "Új regisztráció: Szabó Péter", time: "1 órája" },
              { color: "#22c55e", text: "Rendelés kiszállítva: #1230", time: "2 órája" },
              { color: "#ef4444", text: "Fizetés sikertelen: #1228", time: "3 órája" },
            ].map((a) =>
              createDOMElem({
                tag: "div",
                attrs: { class: "demo3-activity-item" },
                children: [
                  createDOMElem({ tag: "div", attrs: { class: "demo3-activity-dot", style: { background: a.color } } }),
                  createDOMElem({
                    tag: "div",
                    children: [
                      createDOMElem({ tag: "div", text: a.text, attrs: { class: "demo3-activity-text" } }),
                      createDOMElem({ tag: "div", text: a.time, attrs: { class: "demo3-activity-time" } }),
                    ],
                  }),
                ],
              })
            ),
          ],
        }),
      ],
    }),
  ],
});
