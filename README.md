# createDOMBlocks

[Magyar README](README-hu.md)

A TypeScript library for creating complex HTML blocks and form elements using JavaScript. Built on top of [DOMelemJS](https://github.com/exphoenee/DOMelemJS).

## Features

- Create form inputs with labels and event handlers
- Build tables from arrays or objects with automatic footer calculations
- Generate modals with customizable actions
- Create ordered/unordered lists
- Type-safe with full TypeScript support

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

### With npm

```typescript
import { createTextInput, createButton, createTable } from "createdomblocks";
import "createdomblocks/style.css";
```

### CDN (unpkg)

```html
<script src="https://unpkg.com/createdomblocks"></script>
```

This exposes a global `createDOMBlocks` object with all exported functions.

## Quick Start

### With npm

```typescript
import { createTextInput, createButton, createTable } from "createdomblocks";

const parent = document.getElementById("app");

// Create a text input
createTextInput({
  parent,
  id: "myInput",
  labelText: "Name:",
  placeholder: "Enter your name",
});

// Create a button
createButton({
  parent,
  id: "submitBtn",
  text: "Submit",
  click: () => console.log("Clicked!"),
});
```

### With CDN

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <link rel="stylesheet" href="https://unpkg.com/createdomblocks/dist/style.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/createdomblocks/dist/index.js"></script>
    <script>
      const { createTextInput, createButton } = CreateDOMBlocks;
      const parent = document.getElementById("app");

      createTextInput({
        parent,
        id: "myInput",
        labelText: "Name:",
        placeholder: "Enter your name",
      });

      createButton({
        parent,
        id: "submitBtn",
        text: "Submit",
        click: () => console.log("Clicked!"),
      });
    </script>
  </body>
</html>
```

## API

### Form Inputs

#### `createTextInput(params)`
Creates a text input with optional label.

#### `createTelInput(params)`
Creates a telephone input.

#### `createUrlInput(params)`
Creates a URL input.

#### `createSearchInput(params)`
Creates a search input.

#### `createEmailInput(params)`
Creates an email input.

#### `createPasswordInput(params)`
Creates a password input.

#### `createNumberInput(params)`
Creates a number input.

#### `createDateInput(params)`
Creates a date input.

#### `createDatetimeInput(params)`
Creates a datetime-local input.

#### `createTimeInput(params)`
Creates a time input.

#### `createMonthInput(params)`
Creates a month input.

#### `createWeekInput(params)`
Creates a week input.

#### `createCheckbox(params)`
Creates a checkbox input.

#### `createColorInput(params)`
Creates a color input.

#### `createFileInput(params)`
Creates a file input.

#### `createRangeInput(params)`
Creates a range input with min/max/step.

#### `createHiddenInput(params)`
Creates a hidden input.

### Buttons

#### `createButtonInput(params)`
Creates an input button.

#### `createSubmitInput(params)`
Creates a submit button.

#### `createResetInput(params)`
Creates a reset button.

#### `createButton(params)`
Creates a button element.

### Selection

#### `createSelect(params)`
Creates a select dropdown with options.

#### `createRadio(params)`
Creates a radio button group.

### Other Elements

#### `createTextarea(params)`
Creates a textarea.

#### `createParagraph(params)`
Creates a paragraph element.

#### `createTitle(params, level)`
Creates a heading (h1-h6).

#### `createUnorderedList(data, params)`
Creates a ul list.

#### `createOrderedList(data, params)`
Creates an ol list.

#### `createTable(data, params)`
Creates a table with headers, rows, and optional footer calculations.

#### `createModal(content, actions, params)`
Creates a modal dialog.

#### `newLine(parent)`
Creates a line break.

### Common Parameters

All input functions accept these parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `parent` | `HTMLElement \| string` | Parent element or CSS selector |
| `id` | `string` | Element ID |
| `class` | `string` | CSS class name |
| `labelText` | `string` | Label text (for inputs) |
| `labelfirst` | `boolean` | Label before input (default: true) |
| `value` | `string \| number` | Initial value |
| `name` | `string` | Input name attribute |
| `placeholder` | `string` | Placeholder text |
| `onChange` | `(e: Event) => void` | Change event handler |
| `click` | `(e: Event) => void` | Click event handler |
| `handleEvent` | `EventHandler[]` | Additional event handlers |

### Table Options

| Parameter | Type | Description |
|-----------|------|-------------|
| `hasHeader` | `boolean` | First row is header |
| `hasFooter` | `boolean` | Show footer row |
| `addRowNumbers` | `boolean` | Add row numbers |
| `sumRowValues` | `boolean` | Add sum column |
| `cellNames` | `object` | Custom header names |

## Example

```typescript
import {
  createTextInput,
  createSelect,
  createButton,
  createTable,
  createModal
} from "createdomblocks";

const parent = document.getElementById("app");

// Form with multiple inputs
createTextInput({
  parent,
  id: "username",
  labelText: "Username:",
  placeholder: "Enter username",
});

createSelect({
  parent,
  id: "role",
  labelText: "Role:",
  options: [
    { text: "Admin", value: "admin" },
    { text: "User", value: "user" },
  ],
});

// Data table
const data = [
  ["Name", "Age", "City"],
  ["Alice", "30", "New York"],
  ["Bob", "25", "London"],
];

createTable(data, {
  parent,
  id: "userTable",
  hasHeader: true,
});

// Modal dialog
createModal(
  { modalTitle: "Confirm", body: { tag: "p", text: "Are you sure?" } },
  {
    okAction: () => console.log("Confirmed"),
    cancelAction: () => console.log("Cancelled"),
    closeAction: () => console.log("Closed"),
  },
  { parent, id: "confirmModal" }
);
```

## License

MIT © Viktor Bozzay
