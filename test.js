function separator() {
  createDOMElem({
    tag: p,
    parent: document.getElementById("app"),
    text: "-----------------------------------------------",
  });
}
separator();
/* Creating a text input */
createTextInput({
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
createTelInput({
  parent: document.getElementById("app"),
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
  parent: document.getElementById("app"),
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
  parent: document.getElementById("app"),
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
  parent: document.getElementById("app"),
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
  parent: document.getElementById("app"),
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
createDatetimeInput({
  parent: document.getElementById("app"),
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
createMonthInput({
  parent: document.getElementById("app"),
  id: "myMonthInput",
  labelText: "Month input:",
  name: "weekInputName",
  value: "18:24",
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
  parent: document.getElementById("app"),
  id: "myWeekInput",
  labelText: "Week input:",
  name: "weekInputName",
  value: "18:24",
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
createResetInput({
  parent: document.getElementById("app"),
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
createHiddenInput({
  parent: document.getElementById("app"),
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
