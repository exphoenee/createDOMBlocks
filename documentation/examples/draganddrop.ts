import { initDocPage, renderSections, example } from "../page-components/index";
import { createDragAndDropFileInput, createCard } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    { title: "createDragAndDropFileInput (alap)", description: "Egyszerű fájl feltöltő mező, drag-and-drop támogatással és tallózás gombbal." },
    (parent) => createDragAndDropFileInput({
      parent, id: "dd-doc1", labelText: "Fájl feltöltése:",
      dropText: "Húzd ide a fájlokat", accept: [".jpg", ".png", ".pdf"],
      multiple: true,
      onFiles: (f: File[]) => console.log(f.map((x) => x.name)),
    }),
  ),
  example(
    { title: "createDragAndDropFileInput (max fájl korláttal)", description: "Fájl feltöltő maximum 2 fájlra korlátozva, csak PDF formátum." },
    (parent) => createDragAndDropFileInput({
      parent, id: "dd-doc2", labelText: "PDF feltöltés (max 2 fájl):",
      dropText: "Húzz ide PDF fájlokat", accept: [".pdf"],
      maxFiles: 2,
      onFiles: (f: File[]) => console.log(f.map((x) => x.name)),
    }),
  ),
  example(
    { title: "Paraméterek", description: "A createDragAndDropFileInput függvény paraméterei." },
    (parent) => {
      createCard({
        parent,
        id: "dd-params-card",
        title: "Paraméterek",
        body: {
          tag: "table",
          attrs: { class: "table" },
          children: [
            { tag: "thead", children: [{ tag: "tr", children: [
              { tag: "th", text: "Paraméter" },
              { tag: "th", text: "Típus" },
              { tag: "th", text: "Kötelező" },
              { tag: "th", text: "Leírás" },
            ]}]},
            { tag: "tbody", children: [
              { tag: "tr", children: [
                { tag: "td", text: "parent" },
                { tag: "td", text: "HTMLElement | string" },
                { tag: "td", text: "Igen" },
                { tag: "td", text: "Szülő elem" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "id" },
                { tag: "td", text: "string" },
                { tag: "td", text: "Igen" },
                { tag: "td", text: "Egyedi azonosító" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "labelText" },
                { tag: "td", text: "string" },
                { tag: "td", text: "Nem" },
                { tag: "td", text: "Címke szöveg" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "dropText" },
                { tag: "td", text: "string" },
                { tag: "td", text: "Nem" },
                { tag: "td", text: "Drop zóna szövege" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "accept" },
                { tag: "td", text: "string[]" },
                { tag: "td", text: "Nem" },
                { tag: "td", text: "Támogatott fájlkiterjesztések (pl. [\".jpg\", \".pdf\"])" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "multiple" },
                { tag: "td", text: "boolean" },
                { tag: "td", text: "Nem" },
                { tag: "td", text: "Több fájl feltöltésének engedélyezése" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "maxFiles" },
                { tag: "td", text: "number" },
                { tag: "td", text: "Nem" },
                { tag: "td", text: "Maximum feltölthető fájlok száma" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "onFiles" },
                { tag: "td", text: "(files: File[]) => void" },
                { tag: "td", text: "Nem" },
                { tag: "td", text: "Callback a fájlok kiválasztása után" },
              ]},
            ]},
          ],
        },
      });
    },
  ),
];

renderSections(sections);
done();
