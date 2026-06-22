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
