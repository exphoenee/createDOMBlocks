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
createInput({
  parent: document.getElementById("app"),
  id: "myNumInput",
  type: "number",
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
createInput({
  parent: document.getElementById("app"),
  id: "myDateInput",
  type: "date",
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
createInput({
  parent: document.getElementById("app"),
  id: "myTimeInput",
  type: "time",
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
/* create a Select input */
createSelect({
  parent: document.getElementById("app"),
  id: "mySelectInput",
  labelText: "Select input:",
  name: "selectInputName",
  value: 3,
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
/* create a checkbox input */
createCheckbox({
  parent: document.getElementById("app"),
  id: "myCheckbox",
  name: "checkboxName",
  labelText: "Checkbox input:",
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
/* create a checkbox input */
createRadio({
  parent: document.getElementById("app"),
  id: "myRadioInput",
  labelText: "Radio input:",
  name: "radioInputName",
  labelfirst: false,
  value: 3,
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
/* refactored functions */
inputTest({
  parent: document.getElementById("app"),
  id: "myInput2",
  labelText: "Text input2:",
  value: "something",
  name: "textInputName2",
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
selectTest({
  parent: document.getElementById("app"),
  id: "mySelectInput2",
  labelText: "Select input2:",
  name: "selectInputName2",
  value: 3,
  placeholder: "Number placeholder2",
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
