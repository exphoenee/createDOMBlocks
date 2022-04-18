/* Helper method */
function createChildren(elemType, params) {
  const children = [
    {
      tag: label,
      text: params.labelText,
      attrs: {
        for: params.id,
        class: `${elemType}-label${
          params.classes ? ` ${makeThatArray(params.classes)}` : ""
        }`,
      },
    },
    {
      tag: elemType,
      text: params.value,
      attrs: {
        type: params.type,
        value: params.value,
        id: params.id,
        checked: params.checked,
        rows: params.rows,
        cols: params.cols,
        placeholder: params.placeholder,
        name: params.name || params.id,
        class: `${params.type || elemType}-input${
          params.classes ? ` ${makeThatArray(params.classes)}` : ""
        }`,
      },
      handleEvent: [
        params.onChange && { event: "change", cb: params.onChange },
        params.click && { event: "click", cb: params.click },
        ...(params.handleEvent && makeThatArray(params.handleEvent)),
      ],
      children:
        params.options &&
        params.options.map((opt) => {
          return { tag: option, text: opt.text, attrs: { value: opt.value } };
        }),
    },
  ];
  return params.labelfirst ? children : children.reverse();
}
function createInputContainer(params, children) {
  return {
    tag: div,
    parent: params.parent,
    attrs: {
      class: `${params.type}-input${
        params.classes ? ` ${params.classes}` : ""
      }`,
    },
    children,
  };
}

/* DOM creator functions */
function createCheckbox({
  parent,
  labelfirst = true,
  classes,
  id,
  type = "checkbox",
  name,
  labelText,
  value,
  onChange,
  click,
  handleEvent,
  checked,
}) {
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `${type}-container${classes ? ` ${classes}` : ""}` },
    children: createChildren(input, {
      parent,
      labelfirst,
      classes,
      id,
      name,
      labelText,
      type,
      value,
      onChange,
      click,
      handleEvent,
      checked,
    }),
  });
}
function createCheckbox2({
  parent,
  labelfirst = true,
  classes,
  id,
  type = "checkbox",
  name,
  labelText,
  value,
  onChange,
  click,
  handleEvent,
  checked,
}) {
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `${type}-container${classes ? ` ${classes}` : ""}` },
    children: createChildren(input, {
      parent,
      labelfirst,
      classes,
      id,
      name,
      labelText,
      type,
      value,
      onChange,
      click,
      handleEvent,
      checked,
    }),
  });
}
function createInput({
  parent,
  labelfirst = true,
  classes,
  id,
  name,
  type = "text",
  labelText,
  value,
  placeholder,
  onChange,
  click,
  handleEvent,
}) {
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `${type}-input${classes ? ` ${classes}` : ""}` },
    children: createChildren(input, {
      labelfirst,
      classes,
      id,
      name,
      type,
      labelText,
      value,
      placeholder,
      onChange,
      click,
      handleEvent,
    }),
  });
}
function createSelect({
  parent,
  labelfirst = true,
  classes,
  id,
  name,
  labelText,
  value,
  onChange,
  click,
  handleEvent,
  options,
}) {
  const children = [
    {
      tag: label,
      text: labelText,
      parent,
      attrs: {
        for: id,
        class: `input-label${classes ? ` ${classes}` : ""}`,
      },
    },
    {
      tag: select,
      parent,
      attrs: {
        id,
        name: name || id,
        class: `select-input${classes ? ` ${classes}` : ""}`,
        value,
      },
      handleEvent: [
        onChange && { event: "change", cb: onChange },
        click && { event: "click", cb: click },
        ...(handleEvent && makeThatArray(handleEvent)),
      ],
      children: options.map(({ text, value }) => {
        return { tag: option, text, attrs: { value } };
      }),
    },
  ];
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `select-container${classes ? ` ${classes}` : ""}` },
    children: createChildren(select, {
      parent,
      labelfirst,
      classes,
      id,
      name,
      labelText,
      value,
      onChange,
      click,
      handleEvent,
      options,
    }),
  });
}
function createRadio({
  parent,
  labelfirst = true,
  classes,
  value,
  id,
  name,
  options,
}) {
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `radio-container${classes ? ` ${classes}` : ""}` },
    children: options
      .map((option, index) =>
        createChildren(input, {
          labelText: option.text,
          type: "radio",
          labelfirst,
          name: name || id,
          id: `${id}-${option.value}`,
          checked:
            typeof value === "string"
              ? option.text === value
              : typeof value === "number"
              ? value === index + 1
              : false,
          classes,
          name,
          onChange: option.onChange && { event: "change", cb: option.onChange },
          click: option.click && { event: "click", cb: option.click },
          handleEvent: option.handleEvent && option.handleEvent,
        })
      )
      .flat(),
  });
}
function createTextarea({
  parent,
  labelfirst = true,
  classes,
  id,
  name,
  labelText,
  placeholder,
  value,
  rows,
  cols,
  onChange,
  click,
  handleEvent,
}) {
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `textarea-container${classes ? ` ${classes}` : ""}` },
    children: createChildren(textarea, {
      parent,
      labelfirst,
      classes,
      id,
      name,
      labelText,
      placeholder,
      value,
      rows,
      cols,
      onChange,
      click,
      handleEvent,
    }),
  });
}
