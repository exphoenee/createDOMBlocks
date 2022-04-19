const parent = document.getElementById("app");
function separator() {
  createDOMElem({
    tag: p,
    parent,
    text: "_____________________________________________________________",
  });
}
separator();
/* Creating a text input */
createTextInput({
  parent,
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
createTelInput({
  parent,
  id: "myTelInput",
  labelText: "Tel input:",
  value: "+363066677788",
  name: "telInputName",
  placeholder: "phone number",
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
createUrlInput({
  parent,
  id: "myURLInput",
  labelText: "Url input:",
  value: "http://bozzayviktor.hu",
  name: "textInputName",
  placeholder: "webpage adress",
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
createSearchInput({
  parent,
  id: "mySearchInput",
  labelText: "Search input:",
  value: "Searching",
  name: "SearchtextInputName",
  placeholder: "I don't find it!",
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
createEmailInput({
  parent,
  id: "myEmailInput",
  labelText: "Email input:",
  value: "email@email.email",
  name: "emailInputName",
  placeholder: "email",
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
createPasswordInput({
  parent,
  id: "myPasswordInput",
  labelText: "Password input:",
  value: "password",
  name: "passwordInputName",
  placeholder: "password",
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
  parent,
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
  parent,
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
createDatetimeInput({
  parent,
  id: "myDatetimeInput",
  labelText: "Datetime input:",
  name: "datetimeInputName",
  value: "2018-06-12T19:30",
  placeholder: "Datetime placeholder",
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
  parent,
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
createMonthInput({
  parent,
  id: "myMonthInput",
  labelText: "Month input:",
  name: "weekInputName",
  value: "2022-04",
  placeholder: "Month placeholder",
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
createWeekInput({
  parent,
  id: "myWeekInput",
  labelText: "Week input:",
  name: "weekInputName",
  value: "2022-W15",
  placeholder: "Week placeholder",
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
  parent,
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
  parent,
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
  parent,
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
  parent,
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
  parent,
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
  parent,
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
createResetInput({
  parent,
  id: "myResetInput",
  text: "Reset!",
  name: "selectResetName",
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
  parent,
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
createHiddenInput({
  parent,
  id: "myHiddenInput",
  text: "Hidden!",
  name: "selectIHiddenName",
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
createFileInput({
  parent,
  id: "myFileInput",
  labelText: "File hozzáadása: ",
  text: "Add a file!",
  name: "selectIFileName",
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
createRangeInput({
  parent,
  id: "myRangeInput",
  labelText: "Range input: ",
  name: "selectIRangeName",
  placeholder: "placeholder",
  min: 0,
  max: 10,
  step: 2,
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
createUnorderedList(["first", "second", "third", "fourth", "fifth"], {
  parent,
  class: "listOfNumbers",
  id: "myUnsortedList",
});
separator();
createOrderedList(["ten", "eleven", "twelve", "thirteen", "forthteen"], {
  parent,
  class: "listOfNumbers",
  id: "myUnsortedList",
  start: 10,
});
separator();
newLine(document.getElementById("app"));
separator();
createParagraph({
  parent,
  text: "This is a text",
  class: "text",
});
separator();
createTitle(
  {
    parent,
    text: "Title level 1",
    class: "text",
  },
  1
);
createTitle(
  {
    parent,
    text: "Title level 2",
    class: "text",
  },
  2
);
createTitle(
  {
    parent,
    text: "Title level 3",
    class: "text",
  },
  3
);
createTitle(
  {
    parent,
    text: "Title level 4",
    class: "text",
  },
  4
);
createTitle(
  {
    parent,
    text: "Title level 5",
    class: "text",
  },
  5
);
createTitle(
  {
    parent,
    text: "Title level 6",
    class: "text",
  },
  6
);
createTitle(
  {
    parent,
    text: "Title level 50",
    class: "text",
  },
  50
);
createTitle(
  {
    parent,
    text: "Title level -1",
    class: "text",
  },
  -1
);
createTitle({
  parent,
  text: "Title without given level",
  class: "text",
});
separator();
const data1 = [
  ["Fisrt column", "Second column", "Third column", "Fourth column"],
  ["Data1", "1", "Data3", "Data4"],
  ["2", "1", "2", "2"],
  ["Data9", "1", "Data11", "Data12"],
  ["Data13", "1", "Data15", "Data16"],
  ["Data17", "1", "Data19", "Data20"],
];
createTable(data1, {
  parent,
  hasHeader: true,
  hasFooter: true,
  addRowNumbers: true,
  sumRowValues: true,
  cellNames: { sum: "Összesen", total: "Összeg", rowNr: "Sor száma" },
  precision: 2,
  class: "listOfNumbers",
  id: "myUnsortedList",
});
separator();
const data2 = [
  ["Data1", "1", "Data3", "Data4"],
  ["2", "1", "2", "2"],
  ["Data9", "1", "Data11", "Data12"],
  ["Data13", "1", "Data15", "Data16"],
  ["Data17", "1", "Data19", "Data20"],
];
createTable(data2, {
  parent,
  hasHeader: true,
  hasFooter: true,
  addRowNumbers: false,
  sumRowValues: true,
  cellNames: { sum: "Összesen", total: "Összeg", rowNr: "Sor száma" },
  precision: 2,
  class: "listOfNumbers",
  id: "myUnsortedList",
});
separator();
const data3 = [
  {
    "Fisrt column": "Data1",
    "Second column": "Data2",
    "Third column": "Data3",
    "Fourth column": "Data4",
  },
  {
    "Fisrt column": "Data5",
    "Second column": "Data6",
    "Third column": "Data7",
    "Fourth column": "Data8",
  },
  {
    "Fisrt column": "Data9",
    "Second column": "Data10",
    "Third column": "Data11",
    "Fourth column": "Data12",
  },
  {
    "Fisrt column": "Data13",
    "Second column": "Data14",
    "Third column": "Data15",
    "Fourth column": "Data16",
  },
  {
    "Fisrt column": "Data17",
    "Second column": "Data18",
    "Third column": "Data19",
    "Fourth column": "Data20",
  },
];
createTable(data3, {
  parent,
  hasHeader: false,
  hasFooter: true,
  addRowNumbers: false,
  sumRowValues: true,
  cellNames: { sum: "Összesen", total: "Összeg", rowNr: "Sor száma" },
  precision: 2,
  class: "listOfNumbers",
  id: "myUnsortedList",
});
