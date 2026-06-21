import { createUnorderedList, createOrderedList } from "../../src/index";

createUnorderedList(["Els\u00F3", "Masodik", "Harmadik", "Negyedik"], { parent: "#app-ul", id: "ul1" });
createOrderedList(["Tizedik", "Tizenegyedik", "Tizenkettoedik"], { parent: "#app-ol", id: "ol1", start: 10 });
