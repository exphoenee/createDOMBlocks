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
          class: `input-container${classes ? ` ${classes}` : ""}`,
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
