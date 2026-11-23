import type { DrawerMenuItem } from "../../src/types";

export function getDrawerMenuItems(): DrawerMenuItem[] {
  return [
    { label: "Kezdőlap", href: "index.html" },
    {
      label: "Forms",
      children: [
        { label: "Text input", href: "text-input.html" },
        { label: "Tel input", href: "tel-input.html" },
        { label: "Url input", href: "url-input.html" },
        { label: "Search input", href: "search-input.html" },
        { label: "Email input", href: "email-input.html" },
        { label: "Password input", href: "password-input.html" },
        { label: "Number input", href: "number-input.html" },
        { label: "Date input", href: "date-input.html" },
        { label: "Datetime input", href: "datetime-input.html" },
        { label: "Time input", href: "time-input.html" },
        { label: "Month input", href: "month-input.html" },
        { label: "Week input", href: "week-input.html" },
        { label: "Checkbox", href: "checkbox.html" },
        { label: "Color input", href: "color-input.html" },
        { label: "File input", href: "file-input.html" },
        { label: "Range input", href: "range-input.html" },
        { label: "Form", href: "form.html" },
        { label: "Select", href: "select.html" },
        { label: "Radio", href: "radio.html" },
        { label: "Custom select", href: "custom-select.html" },
        { label: "Textarea", href: "textarea.html" },
        { label: "Custom date picker", href: "custom-date-picker.html" },
        { label: "Custom week picker", href: "custom-week-picker.html" },
        { label: "Custom month picker", href: "custom-month-picker.html" },
        { label: "Custom date time picker", href: "custom-date-time-picker.html" },
        { label: "Custom date range picker", href: "custom-date-range-picker.html" },
        { label: "Drag and drop file input", href: "drag-and-drop-file-input.html" },
      ],
    },
    {
      label: "Gombok",
      children: [
        { label: "Button input", href: "button-input.html" },
        { label: "Submit input", href: "submit-input.html" },
        { label: "Reset input", href: "reset-input.html" },
        { label: "Button", href: "button.html" },
      ],
    },
    {
      label: "Tartalom",
      children: [
        { label: "Card", href: "card.html" },
        { label: "Grid", href: "grid.html" },
        { label: "Paragraph", href: "paragraph.html" },
        { label: "Title", href: "title.html" },
        { label: "Blockquote", href: "blockquote.html" },
        { label: "Code block", href: "code-block.html" },
        { label: "Image", href: "image.html" },
        { label: "Video", href: "video.html" },
        { label: "Music player", href: "music-player.html" },
        { label: "Link", href: "link.html" },
        { label: "Divider", href: "divider.html" },
        { label: "Unordered list", href: "unordered-list.html" },
        { label: "Ordered list", href: "ordered-list.html" },
        { label: "Table", href: "table.html" },
        { label: "Avatar", href: "avatar.html" },
      ],
    },
    {
      label: "Navigáció",
      children: [
        { label: "Nav", href: "nav.html" },
        { label: "Breadcrumb", href: "breadcrumb.html" },
        { label: "Tabs", href: "tabs.html" },
        { label: "Menu", href: "menu.html" },
        { label: "Drawer", href: "drawer.html" },
      ],
    },
    {
      label: "Visszajelzés",
      children: [
        { label: "Alert", href: "alert.html" },
        { label: "Badge", href: "badge.html" },
        { label: "Spinner", href: "spinner.html" },
        { label: "Progress bar", href: "progress-bar.html" },
        { label: "Toast", href: "toast.html" },
      ],
    },
    {
      label: "Interaktív",
      children: [
        { label: "Accordion", href: "accordion.html" },
        { label: "Tooltip", href: "tooltip.html" },
        { label: "Carousel", href: "carousel.html" },
        { label: "Timeline", href: "timeline.html" },
      ],
    },
    {
      label: "Átfedő elemek",
      children: [
        { label: "Modal", href: "modal.html" },
      ],
    },
  ];
}
