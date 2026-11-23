import { initDocPage, renderSections, example } from "../page-components/index";
import { createButton } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createButton", description: "Általános button elem szöveggel és eseménykezelővel.", component: createButton },
    (parent) => createButton({ parent, id: "b4", text: "Gomb", click: () => console.log("clicked") }),
  ),
  example(
    { title: "createButton – throttle", description: "A `click` azonnal lefut, majd a gomb a megadott ms-ig disabled; a jobb felső sarokban visszaszámláló badge látszik.", component: createButton },
    (parent) => {
      const out = document.createElement("span");
      out.style.marginLeft = "1rem";
      let count = 0;
      const btn = createButton({ parent, id: "b5", text: "Throttle 3s", throttle: 3000, click: () => { out.textContent = `Lefutott: ${++count}×`; } });
      parent.appendChild(out);
      return btn;
    },
  ),
  example(
    { title: "createButton – debounce", description: "A `click` a várakozás letelte után fut le; addig a gomb disabled, a badge visszaszámlál.", component: createButton },
    (parent) => {
      const out = document.createElement("span");
      out.style.marginLeft = "1rem";
      let count = 0;
      const btn = createButton({ parent, id: "b6", text: "Debounce 2s", debounce: 2000, click: () => { out.textContent = `Lefutott: ${++count}×`; } });
      parent.appendChild(out);
      return btn;
    },
  ),
];

renderSections(sections);
done();
