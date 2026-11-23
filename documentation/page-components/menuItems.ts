import type { DrawerMenuItem } from "../../src/types";

export function getDrawerMenuItems(): DrawerMenuItem[] {
  return [
    { label: "Kezdőlap", href: "index.html" },
    {
      label: "Forms",
      children: [
        { label: "CustomDatePicker", href: "custom-date-picker.html" },
        { label: "CustomWeekPicker", href: "custom-week-picker.html" },
        { label: "CustomMonthPicker", href: "custom-month-picker.html" },
        { label: "CustomDateTimePicker", href: "custom-date-time-picker.html" },
        { label: "CustomDateRangePicker", href: "custom-date-range-picker.html" },
        { label: "DragAndDropFileInput", href: "drag-and-drop-file-input.html" },
        { label: "TextInput", href: "text-input.html" },
        { label: "TelInput", href: "tel-input.html" },
        { label: "UrlInput", href: "url-input.html" },
        { label: "SearchInput", href: "search-input.html" },
        { label: "EmailInput", href: "email-input.html" },
        { label: "PasswordInput", href: "password-input.html" },
        { label: "NumberInput", href: "number-input.html" },
        { label: "DateInput", href: "date-input.html" },
        { label: "DatetimeInput", href: "datetime-input.html" },
        { label: "TimeInput", href: "time-input.html" },
        { label: "MonthInput", href: "month-input.html" },
        { label: "WeekInput", href: "week-input.html" },
        { label: "Checkbox", href: "checkbox.html" },
        { label: "ColorInput", href: "color-input.html" },
        { label: "FileInput", href: "file-input.html" },
        { label: "RangeInput", href: "range-input.html" },
        { label: "Form", href: "form.html" },
        { label: "Select", href: "select.html" },
        { label: "Radio", href: "radio.html" },
        { label: "CustomSelect", href: "custom-select.html" },
        { label: "Textarea", href: "textarea.html" },
      ],
    },
    {
      label: "Gombok",
      children: [
        { label: "ButtonInput", href: "button-input.html" },
        { label: "SubmitInput", href: "submit-input.html" },
        { label: "ResetInput", href: "reset-input.html" },
        { label: "Button", href: "button.html" },
      ],
    },
    {
      label: "Tartalom",
      children: [
        { label: "Avatar", href: "avatar.html" },
        { label: "Card", href: "card.html" },
        { label: "Grid", href: "grid.html" },
        { label: "Paragraph", href: "paragraph.html" },
        { label: "Title", href: "title.html" },
        { label: "Blockquote", href: "blockquote.html" },
        { label: "CodeBlock", href: "code-block.html" },
        { label: "Image", href: "image.html" },
        { label: "Link", href: "link.html" },
        { label: "Divider", href: "divider.html" },
        { label: "UnorderedList", href: "unordered-list.html" },
        { label: "OrderedList", href: "ordered-list.html" },
        { label: "Table", href: "table.html" },
      ],
    },
    {
      label: "Navigáció",
      children: [
        { label: "Drawer", href: "drawer.html" },
        { label: "Menu", href: "menu.html" },
        { label: "Nav", href: "nav.html" },
        { label: "Breadcrumb", href: "breadcrumb.html" },
        { label: "Tabs", href: "tabs.html" },
      ],
    },
    {
      label: "Visszajelzés",
      children: [
        { label: "Alert", href: "alert.html" },
        { label: "Badge", href: "badge.html" },
        { label: "Spinner", href: "spinner.html" },
        { label: "ProgressBar", href: "progress-bar.html" },
        { label: "Toast", href: "toast.html" },
      ],
    },
    {
      label: "Interaktív",
      children: [
        { label: "Carousel", href: "carousel.html" },
        { label: "Accordion", href: "accordion.html" },
        { label: "Tooltip", href: "tooltip.html" },
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
