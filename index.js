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
        rows: params.rows,
        cols: params.cols,
        placeholder: params.placeholder,
        name: params.name || params.id,
        class: `${elemType}-input${
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
/* DOM creator functions */

function createCheckbox({
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
  checked,
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
      tag: input,
      parent,
      attrs: {
        id,
        name: name || id,
        type: "checkbox",
        class: `checkbox-input${classes ? ` ${classes}` : ""}`,
        value,
        checked,
      },
      handleEvent: [
        onChange && { event: "change", cb: onChange },
        click && { event: "click", cb: click },
        ...(handleEvent && makeThatArray(handleEvent)),
      ],
    },
  ];
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `checkbox-container${classes ? ` ${classes}` : ""}` },
    children: labelfirst ? children : children.reverse(),
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
      tag: textarea,
      parent,
      text: value,
      attrs: {
        id,
        rows,
        cols,
        placeholder,
        name: name || id,
        class: `textarea-input${classes ? ` ${classes}` : ""}`,
      },
      handleEvent: [
        onChange && { event: "change", cb: onChange },
        click && { event: "click", cb: click },
        ...(handleEvent && makeThatArray(handleEvent)),
      ],
    },
  ];
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `textarea-container${classes ? ` ${classes}` : ""}` },
    children: labelfirst ? children : children.reverse(),
  });
}
/* they are the refactored functions!!! */
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
  console.log(type);
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
  id,
  name,
  options,
}) {
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `radio-container${classes ? ` ${classes}` : ""}` },
    children: options
      .map((option) =>
        createChildren(input, {
          labelText: option.text,
          type: "radio",
          labelfirst,
          name: name || id,
          id: `${id}-${option.value}`,
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
