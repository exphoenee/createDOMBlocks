/* Helper methods */
function createLabelElem(elemType, params) {
  return {
    tag: label,
    text: params.labelText,
    attrs: {
      for: params.id,
      class: `${elemType}-label${
        params.classes ? ` ${makeThatArray(params.classes)}` : ""
      }`,
    },
  };
}

function createInputElem(elemType, params) {
  return {
    tag: elemType,
    text: params.value,
    parent: params.parent,
    attrs: {
      type: params.type,
      value: params.value,
      id: params.id,
      checked:
        params.checked ?? [("radio", "checkbox")].includes(params.type)
          ? params.checked
          : null,
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
      elemType === select &&
      params.options.map((opt, index) => {
        return {
          tag: option,
          text: opt.text,
          attrs: {
            value: opt.value,
            selected:
              params.value && params.value === opt.value ? "selected" : null,
          },
        };
      }),
  };
}

function createChildren(elemType, params) {
  const inputElem = createInputElem(elemType, params);

  const children = params.labelText
    ? [createLabelElem(elemType, params), inputElem]
    : [inputElem];

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
function createTextInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "text",
  };
  createDOMElem(createInputContainer(conf, createChildren(input, conf)));
}
function createTelInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "tel",
  };
  createDOMElem(createInputContainer(conf, createChildren(input, conf)));
}
function createUrlInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "url",
  };
  createDOMElem(createInputContainer(conf, createChildren(input, conf)));
}
function createSearchInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "search",
  };
  createDOMElem(createInputContainer(conf, createChildren(input, conf)));
}
function createEmailInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "email",
  };
  createDOMElem(createInputContainer(conf, createChildren(input, conf)));
}
function createPasswordInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "password",
  };
  createDOMElem(createInputContainer(conf, createChildren(input, conf)));
}
function createCheckbox(params) {
  createInput({ ...params, type: "checkbox" });
}
function createNumberInput(params) {
  createInput({ ...params, type: "number" });
}
function createDatetimeInput(params) {
  createInput({ ...params, type: "datetime-local" });
}
function createMonthInput(params) {
  createInput({ ...params, type: "month" });
}
function createWeekInput(params) {
  createInput({ ...params, type: "week" });
}
function createDateInput(params) {
  createInput({ ...params, type: "date" });
}
function createTimeInput(params) {
  createInput({ ...params, type: "time" });
}
function createSelect(params) {
  const conf = {
    ...params,
    type: select,
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
  const { value, options, type, labelfirst, name, id, classes } = conf;
  createDOMElem(
    createInputContainer(
      conf,
      options
        .map((option, index) => {
          return {
            tag: div,
            attrs: { class: "radio-option" },
            children: createChildren(input, {
              labelText: option.text,
              type,
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
              onChange: option.onChange && {
                event: "change",
                cb: option.onChange,
              },
              click: option.click && { event: "click", cb: option.click },
              handleEvent: option.handleEvent && option.handleEvent,
            }),
          };
        })
        .flat()
    )
  );
}
function createTextarea(params) {
  const conf = {
    ...params,
    type: textarea,
    labelfirst: params.labelfirst ?? true,
  };
  createDOMElem(createInputContainer(conf, createChildren(textarea, conf)));
}
function createResetInput(params) {
  createDOMElem(
    createInputElem(input, {
      ...params,
      parent: params.parent,
      value: params.text,
      type: "reset",
    })
  );
}
function createButtonInput(params) {
  createDOMElem(
    createInputElem(input, {
      ...params,
      parent: params.parent,
      value: params.text,
      type: "button",
    })
  );
}
function createSubmitInput(params) {
  createDOMElem(
    createInputElem(input, {
      ...params,
      parent: params.parent,
      value: params.text,
      type: "submit",
    })
  );
}
function createHiddenInput(params) {
  createDOMElem(
    createInputElem(input, {
      ...params,
      parent: params.parent,
      type: "hidden",
    })
  );
}
function createColorInput(params) {
  createInput({ ...params, type: "color" });
}
