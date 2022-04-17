function createInput({
  parent,
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
    attrs: { class: `input-container${classes ? ` ${classes}` : ""}` },
    children: [
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
          class: `input-container${classes ? ` ${classes}` : ""}`,
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
    ],
  });
}
function createSelect({
  parent,
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
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `select-container${classes ? ` ${classes}` : ""}` },
    children: [
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
          class: `input-container${classes ? ` ${classes}` : ""}`,
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
    ],
  });
}

function createTextarea({
  parent,
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
  createDOMElem({
    tag: div,
    parent,
    attrs: { class: `textarea-container${classes ? ` ${classes}` : ""}` },
    children: [
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
        attrs: {
          id,
          name: name || id,
          class: `input-container${classes ? ` ${classes}` : ""}`,
          value,
        },
        handleEvent: [
          onChange && { event: "change", cb: onChange },
          click && { event: "click", cb: click },
          ...(handleEvent && makeThatArray(handleEvent)),
        ],
      },
    ],
  });
}
