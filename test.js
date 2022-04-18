function separator() {
  createDOMElem({
    tag: p,
    parent: document.getElementById("app"),
    text: "-----------------------------------------------",
  });
}
separator();
/* Creating a text input */
createInput({
  parent: document.getElementById("app"),
  id: "myInput",
  labelText: "Text input:",
  value: "something",
  name: "textInputName",
  labelfirst: false,
  placeholder: "placeholder",
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
});
/* Creating a number input */
createNumberInput({
  parent: document.getElementById("app"),
  id: "myNumInput",
  name: "numInputName",
  labelText: "Number input:",
  value: "521",
  placeholder: "Number placeholder",
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
});
/* Creating a date input */
createDateInput({
  parent: document.getElementById("app"),
  id: "myDateInput",
  labelText: "Date input:",
  name: "dateInputName",
  value: "2021-04-24",
  placeholder: "Date placeholder",
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
});
/* Creating a time input */
createTimeInput({
  parent: document.getElementById("app"),
  id: "myTimeInput",
  labelText: "Time input:",
  name: "timeInputName",
  value: "18:24",
  placeholder: "Number placeholder",
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
});
separator();
/* create a Select input */
createSelect({
  parent: document.getElementById("app"),
  id: "mySelectInput",
  labelText: "Select input:",
  name: "selectInputName",
  value: 2,
  placeholder: "Number placeholder",
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
  options: [
    { text: "first", value: 1 },
    { text: "second", value: 2 },
    { text: "third", value: 3 },
  ],
});
separator();
/* create a checkbox input */
createCheckbox({
  parent: document.getElementById("app"),
  id: "myCheckbox",
  name: "checkboxName",
  labelText: "Checkbox input:",
  type: "checkbox",
  value: "something",
  checked: true,
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
});
separator();
/* create a textarea input */
createTextarea({
  parent: document.getElementById("app"),
  id: "myTextareaInput",
  labelText: "Textarea input:",
  value: "Delete this text to show up the placeholder.",
  name: "textareaInputName",
  placeholder: "Write something here...",
  rows: 10,
  cols: 50,
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
});
separator();
/* create a checkbox input */
createRadio({
  parent: document.getElementById("app"),
  id: "myRadioInput",
  labelText: "Radio input:",
  name: "radioInputName",
  labelfirst: false,
  value: 2, //here can you add the value or text of the option you want to be selected by default
  options: [
    {
      text: "first",
      value: 1,
      onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
      click: (e) => console.log(`Clicked: ${e.target.id}`),
      handleEvent: [
        {
          event: "mouseenter",
          cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
        },
        {
          event: "mouseleave",
          cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
        },
      ],
    },
    {
      text: "second",
      value: 2,
      onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
      click: (e) => console.log(`Clicked: ${e.target.id}`),
      handleEvent: [
        {
          event: "mouseenter",
          cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
        },
        {
          event: "mouseleave",
          cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
        },
      ],
    },
    {
      text: "third",
      value: 3,
      onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
      click: (e) => console.log(`Clicked: ${e.target.id}`),
      handleEvent: [
        {
          event: "mouseenter",
          cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
        },
        {
          event: "mouseleave",
          cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
        },
      ],
    },
  ],
});
separator();
createButtonInput({
  parent: document.getElementById("app"),
  id: "myButtonInput",
  text: "I'm a button!",
  name: "selectIButtonName",
  value: 3,
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
});
separator();
createSubmitInput({
  parent: document.getElementById("app"),
  id: "mySubmitInput",
  text: "Submit!",
  name: "selectISubmitName",
  value: 3,
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
});
separator();
createColorInput({
  parent: document.getElementById("app"),
  id: "myColor",
  labelText: "Color input:",
  value: "#ff0000",
  name: "colorInputName",
  placeholder: "placeholder",
  onChange: (e) => console.log(`Changed ${e.target.id}: ${e.target.value}`),
  click: (e) => console.log(`Clicked: ${e.target.id}`),
  handleEvent: [
    {
      event: "mouseenter",
      cb: (e) => console.log(`Mouse entering: ${e.target.id}`),
    },
    {
      event: "mouseleave",
      cb: (e) => console.log(`Mouse leaving: ${e.target.id}`),
    },
  ],
});
separator();
