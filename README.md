# createDOMBlocks

[Magyar README](README-hu.md)

A TypeScript library for creating complex HTML blocks and form elements using JavaScript. Built on top of [DOMelemJS](https://github.com/exphoenee/DOMelemJS).

**50+ components** – form inputs, buttons, navigation, content blocks, custom pickers, drawers, modals, carousels, and more.

## Features

- 50+ UI components – inputs, buttons, tables, modals, navigation, alerts, and more
- Framework-agnostic – works with any JS framework or vanilla JS
- Type-safe – full TypeScript support with IntelliSense
- Tree-shakable – import only what you need
- Portal support – drawers and modals render to `document.body` automatically

## Installation

### npm

```bash
npm install createdomblocks
```

### CDN (unpkg)

```html
<link rel="stylesheet" href="https://unpkg.com/createdomblocks/dist/style.css" />
<script src="https://unpkg.com/createdomblocks/dist/index.js"></script>
```

This exposes a global `CreateDOMBlocks` object with all exported functions.

## Quick Start

```typescript
import { createTextInput, createButton, createCard } from "createdomblocks";
import "createdomblocks/style.css";

const parent = document.getElementById("app");

createTextInput({
  parent,
  id: "name",
  labelText: "Name:",
  placeholder: "Enter your name",
});

createButton({
  parent,
  id: "submitBtn",
  text: "Submit",
  click: () => console.log("Clicked!"),
});

createCard({
  parent,
  id: "infoCard",
  title: "Welcome",
  body: { tag: "p", text: "Hello from createDOMBlocks!" },
});
```

## API

### Form Inputs

| Function | Description |
|----------|-------------|
| `createTextInput(params)` | Text input with label |
| `createTelInput(params)` | Telephone input |
| `createUrlInput(params)` | URL input |
| `createSearchInput(params)` | Search input |
| `createEmailInput(params)` | Email input |
| `createPasswordInput(params)` | Password input |
| `createNumberInput(params)` | Number input |
| `createDateInput(params)` | Date input |
| `createDatetimeInput(params)` | Datetime-local input |
| `createTimeInput(params)` | Time input |
| `createMonthInput(params)` | Month input |
| `createWeekInput(params)` | Week input |
| `createCheckbox(params)` | Checkbox input |
| `createColorInput(params)` | Color input |
| `createFileInput(params)` | File input |
| `createRangeInput(params)` | Range slider (min/max/step) |
| `createHiddenInput(params)` | Hidden input |

### Buttons

| Function | Description |
|----------|-------------|
| `createButton(params)` | `<button>` element with click handler |
| `createButtonInput(params)` | `<input type="button">` |
| `createSubmitInput(params)` | `<input type="submit">` |
| `createResetInput(params)` | `<input type="reset">` |

### Selection & Textarea

| Function | Description |
|----------|-------------|
| `createSelect(params)` | Native `<select>` dropdown |
| `createRadio(params)` | Radio button group |
| `createCustomSelect(params)` | Styled custom dropdown |
| `createTextarea(params)` | Textarea input element |

### Custom Pickers

| Function | Description |
|----------|-------------|
| `createCustomDatePicker(params)` | Interactive date picker |
| `createCustomDateTimePicker(params)` | Date + time picker |
| `createCustomDateRangePicker(params)` | Date range picker |
| `createCustomMonthPicker(params)` | Month picker |
| `createCustomWeekPicker(params)` | Week picker |

### Layout & Containers

| Function | Description |
|----------|-------------|
| `createCard(params)` | Card with header / body / footer |
| `createContainer(params)` | Max-width wrapper container |
| `createGrid(params)` | CSS grid with configurable columns |
| `createDivider(params)` | Horizontal rule `<hr>` |

### Navigation

| Function | Description |
|----------|-------------|
| `createNav(params)` | Navigation bar with items and dropdowns |
| `createBreadcrumb(params)` | Breadcrumb trail |
| `createTabs(params)` | Tabbed interface |
| `createMenu(params)` | Menu list (used inside drawers) |
| `createDrawer(params)` | Side panel (portal – renders to body) |
| `openDrawer(id)` | Open a drawer by ID |
| `closeDrawer(id)` | Close a drawer by ID |

### Feedback

| Function | Description |
|----------|-------------|
| `createAlert(params)` | Alert box (success/error/warning/info) |
| `createToast(params)` | Auto-dismissing notification |
| `createBadge(params)` | Status badge / pill |
| `createSpinner(params)` | Loading spinner (sm/md/lg) |
| `createProgressBar(params)` | Progress bar with percentage |

### Content

| Function | Description |
|----------|-------------|
| `createParagraph(params)` | `<p>` element |
| `createTitle(params, level)` | Heading (h1–h6) |
| `createImage(params)` | Figure with image + optional caption |
| `createVideo(params)` | Self-loading video (mp4, webm, ogg) with spinner, error fallback and sized frame |
| `createMusicPlayer(params)` | Music player with playlist, seek bar, volume and repeat |
| `createLink(params)` | Styled `<a>` link |
| `createCodeBlock(params)` | Code block with syntax highlighting |
| `createBlockquote(params)` | Blockquote with optional author |
| `createAccordion(params)` | Collapsible accordion sections |
| `createTooltip(params)` | Tooltip (hover or click trigger) |
| `createAvatar(params)` | User avatar (image or initials) |
| `createUnorderedList(data, params)` | Unordered (bulleted) list |
| `createOrderedList(data, params)` | Ordered (numbered) list |
| `newLine(parent)` | Line break `<br>` |
| `asyncImage(params)` | Lazy-loaded image |

### Data Display

| Function | Description |
|----------|-------------|
| `createTable(data, params)` | Table with header/footer/sum/row numbers |

### Overlays (Portal)

| Function | Description |
|----------|-------------|
| `createModal(content, actions, params)` | Modal dialog (portal – renders to body) |
| `openModal(id)` | Open a modal by ID |
| `closeModal(id)` | Close a modal by ID |

### Forms

| Function | Description |
|----------|-------------|
| `createForm(params)` | Form element with input configs |

### Interactive

| Function | Description |
|----------|-------------|
| `createCarousel(params)` | 3D carousel with navigation and touch |
| `createTimeline(params)` | Vertical timeline with alternating cards and compact view |
| `createGantt(params)` | Gantt chart: rows, groups, milestones (dot / diamond / card), today line, selection, draggable rows, drag-scroll |
| `createDragAndDropFileInput(params)` | Drag & drop file uploader |

### Common Parameters

All components accept a `params` object. Common fields:

| Parameter | Type | Description |
|-----------|------|-------------|
| `parent` | `HTMLElement \| string` | Parent element or CSS selector (required) |
| `id` | `string` | Element ID (required) |
| `class` | `string` | Additional CSS class |
| `handleEvent` | `EventHandler \| EventHandler[]` | Event handlers |

Input components additionally support:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `labelText` | `string` | – | Label text |
| `labelfirst` | `boolean` | `true` | Label before input |
| `value` | `string \| number` | – | Initial value |
| `name` | `string` | – | Input name attribute |
| `placeholder` | `string` | – | Placeholder text |
| `onChange` | `(e: Event) => void` | – | Change handler |
| `click` | `(e: Event) => void` | – | Click handler |

---

### Table Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hasHeader` | `boolean` | `true` | First row is header |
| `showFooter` | `boolean` | `true` | Show footer row |
| `addRowNumbers` | `boolean` | `false` | Add row number column |
| `sumRowValues` | `boolean` | `false` | Add sum column |
| `cellNames` | `object` | – | Custom header names |

---

### Drawer / Modal (Portal)

`createDrawer` and `createModal` are **portal components** – they automatically render their HTML to `document.body`. They do **not** accept a `parent` parameter.

```typescript
// Drawer with menu
createDrawer({
  id: "sidebar",
  title: "Menu",
  children: [createMenu({ id: "nav", items: menuItems })],
  mode: "push",
  defaultState: "closed",
});
openDrawer("sidebar");

// Modal
createModal(
  { modalTitle: "Confirm", body: { tag: "p", text: "Are you sure?" } },
  { okAction: () => console.log("OK"), cancelAction: () => console.log("Cancelled") },
  { id: "confirmModal" }
);
openModal("confirmModal");
```

---

## Declarative YAML descriptor

Instead of calling `createX` one by one, the whole page can be described in YAML (or a plain JS object) and built with `mountYaml` / `buildUI`:

```html
<script type="text/yaml" id="page">
state: { count: 0 }
ui:
  - Card#demo:
      title: Counter
      body:
        - Paragraph: "Clicks: ${count}"
        - Button: { text: Add, click: { inc: count } }
</script>
<script>CreateDOMBlocks.mountYaml("#app", "#page");</script>
```

A node is a single key: `Component#id.class` (capitalized = library component, lowercase = raw HTML element). Scalars are the main text, lists are the children. `"@name"` binds an event handler, `${...}` is a safe expression (no `eval`), `state` / `bind` / `each` / `if` / `define` give reactivity, `messages` plugs into the i18n layer, `theme` sets CSS variables. A JSON Schema (`assets/createDOMBlocks.schema.json`) gives editor autocompletion. See the "YAML descriptor" page of the documentation and `plans/yaml-leiro-terv.md`.

## Localization (i18n)

Every text parameter of every component (labels, placeholders, button text, titles, messages, aria-labels, table cells …) accepts a plain string, a `tr("key")` reference, or a function. References and functions are **recomputed automatically when the locale changes**: the component stays the same element, so its state (typed value, active tab, page, playback) is preserved. Built-in labels (table pager, modal buttons, password toggle, calendar month names …) switch too. Hungarian (`hu`, the default) and English (`en`) catalogs are included.

```ts
import { registerMessages, setLocale, tr, createTextInput } from "createdomblocks";

registerMessages("hu", { "form.name": "Név" });
registerMessages("en", { "form.name": "Name" });

createTextInput({ parent: "app", id: "name", labelText: tr("form.name") });
setLocale("en"); // the label updates, the typed value stays
```

Also available: `loadMessages(lang, urlOrLoader)`, `t(key, params)` with `{name}` interpolation and plurals (`key_one` / `key_other`), `onLocaleChange(cb)`, `setFallbackLocale(lang)`. See the [Localization guide](https://exphoenee.github.io/createDOMBlocks/i18n.html) for a live demo, the full API and the list of built-in `cdb.*` keys.

## Theming

All colors, radii, shadows and the transition speed come from CSS custom properties, so you can restyle every component without touching the library. Load your own CSS **after** `style.css` and override the variables:

```css
:root {
  --primary: #7c3aed;        /* brand color: buttons, active items, focus */
  --primary-hover: #6d28d9;
  --radius: 0.25rem;         /* less rounded corners everywhere */
}

/* or scope a theme to a part of the page */
.admin-panel { --primary: #16a34a; --bg: #f0fdf4; }
```

Available variables: `--primary`, `--primary-hover`, `--on-primary`, `--secondary`, `--text`, `--text-light`, `--bg`, `--bg-alt`, `--border`, `--success|error|warning|info|neutral` (+ `-bg`), `--radius`, `--radius-lg`, `--shadow`, `--shadow-md`, `--shadow-lg`, `--transition`. See the [Theming guide](https://exphoenee.github.io/createDOMBlocks/theming.html) for a live demo, dark mode and class-level customization.

## Example

```typescript
import {
  createTextInput, createSelect, createButton,
  createTable, createCard, createToast
} from "createdomblocks";

const parent = document.getElementById("app");

createCard({
  parent,
  id: "formCard",
  title: "User Form",
  body: [
    createTextInput({ parent, id: "name", labelText: "Name:", placeholder: "Enter name" }),
    createSelect({ parent, id: "role", labelText: "Role:", options: [
      { text: "Admin", value: "admin" },
      { text: "User", value: "user" },
    ]}),
    createButton({ parent, id: "saveBtn", text: "Save", click: () => {
      createToast({ parent: document.body, message: "Saved!", type: "success" });
    }}),
  ],
});
```

## License

MIT © Viktor Bozzay
