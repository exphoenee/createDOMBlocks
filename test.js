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
new domBlock(
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
  })
);
new domBlock(
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
  })
);
new domBlock(
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
  })
);
new domBlock(
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
  })
);
new domBlock(
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
  })
);
new domBlock(
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
  })
);
/* Creating a number input */
new domBlock(
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
  })
);
/* Creating a date input */
new domBlock(
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
  })
);
new domBlock(
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
  })
);
/* Creating a time input */
new domBlock(
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
  })
);
new domBlock(
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
  })
);
new domBlock(
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
  })
);
separator();
/* create a Select input */
new domBlock(
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
  })
);
separator();
/* create a checkbox input */
new domBlock(
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
  })
);
separator();
/* create a textarea input */
new domBlock(
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
  })
);
separator();
/* create a checkbox input */
new domBlock(
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
        onChange: (e) =>
          console.log(`Changed ${e.target.id}: ${e.target.value}`),
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
        onChange: (e) =>
          console.log(`Changed ${e.target.id}: ${e.target.value}`),
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
        onChange: (e) =>
          console.log(`Changed ${e.target.id}: ${e.target.value}`),
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
  })
);
separator();
new domBlock(
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
  })
);
separator();
new domBlock(
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
  })
);
separator();
new domBlock(
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
  })
);
separator();
new domBlock(
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
  })
);
separator();
new domBlock(
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
  })
);
separator();
new domBlock(
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
  })
);
separator();
new domBlock(
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
  })
);
separator();
new domBlock(
  createUnorderedList(["first", "second", "third", "fourth", "fifth"], {
    parent,
    class: "listOfNumbers",
    id: "myUnsortedList",
  })
);
separator();
new domBlock(
  createOrderedList(["ten", "eleven", "twelve", "thirteen", "forthteen"], {
    parent,
    class: "listOfNumbers",
    id: "myUnsortedList",
    start: 10,
  })
);
separator();
new domBlock(newLine(document.getElementById("app")));
separator();
new domBlock(
  createParagraph({
    parent,
    text: "This is a text",
    class: "text",
  })
);
separator();
new domBlock(
  createTitle(
    {
      parent,
      text: "Title level 1",
      class: "text",
    },
    1
  )
);
new domBlock(
  createTitle(
    {
      parent,
      text: "Title level 2",
      class: "text",
    },
    2
  )
);
new domBlock(
  createTitle(
    {
      parent,
      text: "Title level 3",
      class: "text",
    },
    3
  )
);
new domBlock(
  createTitle(
    {
      parent,
      text: "Title level 4",
      class: "text",
    },
    4
  )
);
new domBlock(
  createTitle(
    {
      parent,
      text: "Title level 5",
      class: "text",
    },
    5
  )
);
new domBlock(
  createTitle(
    {
      parent,
      text: "Title level 6",
      class: "text",
    },
    6
  )
);
new domBlock(
  createTitle(
    {
      parent,
      text: "Title level 50",
      class: "text",
    },
    50
  )
);
new domBlock(
  createTitle(
    {
      parent,
      text: "Title level -1",
      class: "text",
    },
    -1
  )
);
new domBlock(
  createTitle({
    parent,
    text: "Title without given level",
    class: "text",
  })
);
separator();
const data1 = [
  ["Fisrt column", "Second column", "Third column", "Fourth column"],
  ["1", "2", "3", "4"],
  ["5", "6", "7", "8"],
  ["9", "10", "11", "12"],
  ["13", "14", "15", "16"],
  ["17", "18", "19", "20"],
];
new domBlock(
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
  })
);
separator();
const data2 = [
  ["Column 1", "Column 2", "Column 3", "Column 4"],
  ["1", "2", "3", "4"],
  ["5", "6", "7", "8"],
  ["9", "10", "11", "12"],
  ["13", "14", "15", "16"],
  ["17", "18", "19", "20"],
];

new domBlock(
  createTable(data2, {
    parent,
    hasHeader: true,
    hasFooter: true,
    addRowNumbers: true,
    sumRowValues: true,
    cellNames: { sum: "Összesen", total: "Összeg", rowNr: "Sor száma" },
    precision: 2,
    class: "listOfNumbers",
    id: "myUnsortedList",
  })
);

separator();
const data3 = [
  {
    "Fisrt column": "1",
    "Second column": "2",
    "Third column": "3",
    "Fourth column": "4",
  },
  {
    "Fisrt column": "5",
    "Second column": "6",
    "Third column": "7",
    "Fourth column": "8",
  },
  {
    "Fisrt column": "9",
    "Second column": "10",
    "Third column": "11",
    "Fourth column": "12",
  },
  {
    "Fisrt column": "13",
    "Second column": "14",
    "Third column": "15",
    "Fourth column": "16",
  },
  {
    "Fisrt column": "17",
    "Second column": "18",
    "Third column": "19",
    "Fourth column": "20",
  },
];
new domBlock(
  createTable(data3, {
    parent,
    hasHeader: true,
    showHeader: true,
    hasFooter: true,
    showFooter: true,
    addRowNumbers: true,
    sumRowValues: true,
    cellNames: { sum: "Összesen", total: "Összeg", rowNr: "Sor száma" },
    precision: 2,
    class: "listOfNumbers",
    id: "myUnsortedList",
  })
);
separator();
new domBlock(
  createButton({
    parent,
    text: "Click me",
    id: "myButton2",
    click: (e) => {
      e.preventDefault();
      console.log(`${e.target.id} was clicked!`);
    },
    handleEvent: {
      event: "mouseover",
      cb: (e) => console.log(`Mouse over: ${e.target.id}`),
    },
  })
);
separator();

new domBlock(
  createModal(
    {
      modalTitle: "This is a modal",
      body: { tag: p, text: "This is a modal text" },
    },
    {
      okAction: (e) => console.log(`Clicked: ok`),
      cacnelAction: (e) => console.log(`Clicked: cancel`),
      closeAction: (e) => console.log(`Clicked: close`),
    },
    { parent, id: "myModal" }
  )
);

separator();
