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
        class: `${type}-input${classes ? ` ${classes}` : ""}`,
        type,
        placeholder,
        value,
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
    attrs: { class: `${type}-input${classes ? ` ${classes}` : ""}` },
    children: labelfirst ? children : children.reverse(),
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
    children: labelfirst ? children : children.reverse(),
  });
}
function createRadio({
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
  const children = options.map((option) => [
    {
      tag: label,
      text: option.text,
      parent,
      attrs: {
        for: id,
        class: `input-label${classes ? ` ${classes}` : ""}`,
      },
    },
    {
      tag: "radio",
      parent,
      attrs: {
        id,
        name: name || id,
        class: `select-input${classes ? ` ${classes}` : ""}`,
        value: option.value,
      },
      handleEvent: [
        onChange && { event: "change", cb: onChange },
        click && { event: "click", cb: click },
        ...(handleEvent && makeThatArray(handleEvent)),
      ],
    },
  ]);
  console.log(children);
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `radio-container${classes ? ` ${classes}` : ""}` },
    children: labelfirst ? children : children.reverse(),
  });
}
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
