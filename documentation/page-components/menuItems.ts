import type { DrawerMenuItem } from "../../src/types";

export function getDrawerMenuItems(): DrawerMenuItem[] {
  return [
    { label: "Kezdőlap", href: "index.html" },
    {
      label: "Forms",
      children: [
        { label: "Form Inputok", href: "forms.html" },
        { label: "Select / Radio", href: "selection.html" },
        { label: "Egyedi Inputok", href: "customInputs.html" },
        { label: "Drop file input", href: "draganddrop.html" },
      ],
    },
    { label: "Gombok", href: "buttons.html" },
    {
      label: "Tartalom",
      children: [
        { label: "Komponensek", href: "content.html" },
        { label: "Listák", href: "lists.html" },
        { label: "Táblázatok", href: "tables.html" },
        { label: "Avatar", href: "avatars.html" },
      ],
    },
    {
      label: "Navigáció",
      children: [
        { label: "Nav / Breadcrumb", href: "navigation.html" },
        { label: "Menu", href: "menu.html" },
        { label: "Drawer", href: "drawer.html" },
      ],
    },
    { label: "Visszajelzés", href: "feedback.html" },
    {
      label: "Interaktív",
      children: [
        { label: "Accordion / Tooltip", href: "interactive.html" },
        { label: "Carousel", href: "carousel.html" },
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
