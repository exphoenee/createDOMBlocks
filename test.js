/* Creating a text input */
createInput({
  parent: document.getElementById("app"),
  id: "myInput",
  labelText: "Text input:",
  value: "something",
  placeholder: "placeholder",
  onChange: (e) => console.log(`Changed: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    { event: "mouseenter", cb: (e) => console.log("Mouse entering") },
    { event: "mouseleave", cb: (e) => console.log("Mouse leaving") },
  ],
});
/* Creating a number input */
createInput({
  parent: document.getElementById("app"),
  id: "myNumInput",
  type: "number",
  labelText: "Number input:",
  value: "521",
  placeholder: "Number placeholder",
  onChange: (e) => console.log(`Changed: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    { event: "mouseenter", cb: (e) => console.log("Mouse entering") },
    { event: "mouseleave", cb: (e) => console.log("Mouse leaving") },
  ],
});
/* Creating a date input */
createInput({
  parent: document.getElementById("app"),
  id: "myDateInput",
  type: "date",
  labelText: "Date input:",
  value: "2021-04-24",
  placeholder: "Date placeholder",
  onChange: (e) => console.log(`Changed: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    { event: "mouseenter", cb: (e) => console.log("Mouse entering") },
    { event: "mouseleave", cb: (e) => console.log("Mouse leaving") },
  ],
});
/* Creating a time input */
createInput({
  parent: document.getElementById("app"),
  id: "myTimeInput",
  type: "time",
  labelText: "Time input:",
  value: "18:24",
  placeholder: "Number placeholder",
  onChange: (e) => console.log(`Changed: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    { event: "mouseenter", cb: (e) => console.log("Mouse entering") },
    { event: "mouseleave", cb: (e) => console.log("Mouse leaving") },
  ],
});
