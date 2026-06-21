import { createButtonInput, createSubmitInput, createResetInput, createButton } from "../../src/index";

createButtonInput({ parent: "#app-btn-input", id: "btnInput", text: "Button input", click: () => console.log("clicked") });
createSubmitInput({ parent: "#app-submit", id: "submitInput", text: "Kuldes" });
createResetInput({ parent: "#app-reset", id: "resetInput", text: "Visszaallitas" });
createButton({ parent: "#app-btn", id: "btn1", text: "Gomb", click: () => console.log("clicked") });
