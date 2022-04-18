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
function createInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: params.type ?? "text",
  };
  createDOMElem(createInputContainer(conf, createChildren(input, conf)));
}
function createCheckbox(params) {
  createInput({ ...params, type: "checkbox" });
}
function createSelect(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
  };
  createDOMElem(createInputContainer(conf, createChildren(select, conf)));
}
function createRadio(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "radio",
  };
  const options = conf.options;
  createDOMElem(
    createInputContainer(
      conf,
      options
        .map((option, index) =>
          createChildren(input, {
            labelText: option.text,
            type: conf.type,
            labelfirst: conf.labelfirst,
            name: conf.name || conf.id,
            id: `${conf.id}-${option.value}`,
            checked:
              typeof value === "string"
                ? option.text === value
                : typeof value === "number"
                ? value === index + 1
                : false,
            classes: conf.classes,
            onChange: option.onChange && {
              event: "change",
              cb: option.onChange,
            },
            click: option.click && { event: "click", cb: option.click },
            handleEvent: option.handleEvent && option.handleEvent,
          })
        )
        .flat()
    )
  );
  /*
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
  */
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
