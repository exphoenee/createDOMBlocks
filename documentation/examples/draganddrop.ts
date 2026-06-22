import { initDocPage, renderSections, example } from "../page-components/index";
import { createDragAndDropFileInput } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    { title: "createDragAndDropFileInput (alap)", description: "Egyszerű fájl feltöltő mező, drag-and-drop támogatással és tallózás gombbal.", component: createDragAndDropFileInput },
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

];

renderSections(sections);
done();
