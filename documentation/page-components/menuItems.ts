import type { DrawerMenuItem } from "../../src/components/createDrawer";

export function getDrawerMenuItems(): DrawerMenuItem[] {
  return [
    { label: "Kezdőlap", href: "index.html" },
    {
      label: "Forms",
      children: [
        { label: "Form Inputok", href: "forms.html" },
        { label: "Egyedi Inputok", href: "customInputs.html" },
      ],
    },
    { label: "Gombok", href: "buttons.html" },
    { label: "Select / Radio", href: "selection.html" },
    { label: "Táblázatok", href: "tables.html" },
    { label: "Listák", href: "lists.html" },
    {
      label: "Navigáció",
      children: [
        { label: "Nav / Breadcrumb", href: "navigation.html" },
      ],
    },
    {
      label: "Tartalom",
      children: [
        { label: "Komponensek", href: "content.html" },
      ],
    },
    { label: "Visszajelzés", href: "feedback.html" },
    { label: "Interaktív", href: "interactive.html" },
    { label: "Modal", href: "modal.html" },
    { label: "Avatar", href: "avatars.html" },
  ];
}
