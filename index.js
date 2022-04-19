/* Helper methods */
function createLabelElem(elemType, params) {
  return {
    tag: label,
    text: params.labelText,
    attrs: {
      for: params.id,
      class: `${elemType}-label${
        params.class ? ` ${makeThatArray(params.class)}` : ""
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
      start: params.start,
      rows: params.rows,
      cols: params.cols,
      min: params.min,
      max: params.max,
      step: params.step,
      placeholder: params.placeholder,
      name: params.name || params.id,
      class: `${params.type || elemType}-input${
        params.class ? ` ${makeThatArray(params.class)}` : ""
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
function createInputChildren(elemType, params) {
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
      class: `${params.type}-input${params.class ? ` ${params.class}` : ""}`,
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
  createDOMElem(createInputContainer(conf, createInputChildren(input, conf)));
}
function createTextInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "text",
  };
  createDOMElem(createInputContainer(conf, createInputChildren(input, conf)));
}
function createTelInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "tel",
  };
  createDOMElem(createInputContainer(conf, createInputChildren(input, conf)));
}
function createUrlInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "url",
  };
  createDOMElem(createInputContainer(conf, createInputChildren(input, conf)));
}
function createSearchInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "search",
  };
  createDOMElem(createInputContainer(conf, createInputChildren(input, conf)));
}
function createEmailInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "email",
  };
  createDOMElem(createInputContainer(conf, createInputChildren(input, conf)));
}
function createPasswordInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "password",
  };
  createDOMElem(createInputContainer(conf, createInputChildren(input, conf)));
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
  createDOMElem(createInputContainer(conf, createInputChildren(select, conf)));
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
            attrs: { classes: "radio-option" },
            children: createInputChildren(input, {
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
  createDOMElem(
    createInputContainer(conf, createInputChildren(textarea, conf))
  );
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
function createFileInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: params.type ?? "file",
  };
  createDOMElem(createInputContainer(conf, createInputChildren(input, conf)));
}
function createRangeInput(params) {
  const conf = {
    ...params,
    labelfirst: params.labelfirst ?? true,
    type: "range",
  };
  createDOMElem(createInputContainer(conf, createInputChildren(input, conf)));
}
function createUnorderedList(data, params) {
  createDOMElem({
    parent: params.parent,
    tag: ul,
    attrs: {
      class: `unsorted-list${params.class && ` ${params.class}`}`,
      id: params.id,
    },
    children: data.map((item, index) => {
      return {
        tag: li,
        text: item,
        attrs: { id: `${params.id}-${index}`, class: "list-elem" },
      };
    }),
  });
}
function createOrderedList(data, params) {
  createDOMElem({
    parent: params.parent,
    tag: ol,
    attrs: {
      start: params.start,
      class: `unsorted-list${params.class && ` ${params.class}`}`,
      id: params.id,
    },
    children: data.map((item, index) => {
      return {
        tag: li,
        text: item,
        attrs: { id: `${params.id}-${index}`, class: "list-elem" },
      };
    }),
  });
}
function newLine(parent) {
  createDOMElem({
    parent,
    tag: br,
  });
}
function createParagraph(params) {
  createDOMElem({
    tag: p,
    text: params.text,
    parent: params.parent,
    attrs: {
      id: params.id,
      class: params.class && params.class,
    },
  });
}
function createTitle(params, level = 1) {
  createDOMElem({
    tag: [h1, h2, h3, h4, h5, h6][
      Math.max(1, Math.min(6, Math.abs(level))) - 1
    ],
    text: params.text,
    parent: params.parent,
    attrs: {
      id: params.id,
      class: params.class && params.class,
    },
  });
}
function createTable(data, params) {
  params = {
    ...params,
    showHeader: params.showHeader ?? true,
    showFooter: params.showFooter ?? true,
    dataIsArray: Array.isArray(data[0]),
  };
  const cellNames = params.cellNames ?? {
    sum: "Sum",
    total: "Total",
    rowNr: "Row #",
  };

  let headers, rows;

  if (params.dataIsArray) {
    params.hasHeader = true;
    headers = params.hasHeader
      ? data.shift()
      : data[0].map((cell, index) => `Column #${index}`);
    rows = data;
  } else {
    headers = Object.keys(data[0]);
    rows = data.map((row) => Object.values(row));
  }
  let footers = Array(headers.length).fill(0);

  if (params.hasFooter && params.showFooter) {
    rows.forEach((row) =>
      row.forEach((cell, cellIdx) => (footers[cellIdx] += parseFloat(cell)))
    );
    footers.forEach((footer, footeIdx) => {
      footers[footeIdx] = Number.isNaN(footer) ? headers[footeIdx] : footer;
    });
  }

  if (params.sumRowValues) {
    (params.hasHeader || !params.dataIsArray) && headers.push(cellNames.sum);
    const total = footers.reduce(
      (acc, cell) => acc + (Number.isNaN(+cell) ? 0 : +cell),
      0
    );
    footers.push(total.toString());
    rows.forEach((row) => row.push(row.reduce((acc, cell) => acc + +cell, 0)));
  }

  if (params.addRowNumbers) {
    params.hasHeader && headers.unshift(cellNames.rowNr);
    footers.unshift(cellNames.total);
    rows.forEach((row, rowIdx) => {
      row.unshift(rowIdx + 1);
    });
  }

  const tableHead = {
    tag: thead,
    children: {
      tag: tr,
      attrs: {
        class: `header-row`,
      },
      children: headers.map((col, index) => {
        return {
          tag: th,
          text: col,
          attrs: { class: `table-col-${index}` },
        };
      }),
    },
  };

  const tableBody = {
    tag: tbody,
    children: rows.map((row, rowInd) => {
      return {
        tag: tr,
        attrs: { class: `table-row-${rowInd}` },
        children: row.map((col, colIdx) => {
          return {
            tag: params.addRowNumbers && colIdx === 0 ? th : td,
            text: col,
            attrs: { class: `table-col-${colIdx}` },
          };
        }),
      };
    }),
  };

  const tableFoot = {
    tag: tfoot,
    children: {
      tag: tr,
      attrs: {
        class: `footer-row`,
      },
      children: footers.map((col, index) => {
        return {
          tag: th,
          text: col,
          attrs: { class: `table-col-${index}` },
        };
      }),
    },
  };

  const tableElem = [];
  if (params.showHeader) tableElem.push(tableHead);
  tableElem.push(tableBody);
  if (params.showFooter) tableElem.push(tableFoot);

  createDOMElem({
    parent: params.parent,
    tag: table,
    attrs: {
      class: `table${params.class && ` ${params.class}`}`,
      id: params.id,
    },
    children: tableElem,
  });
}
function createModal(content, params) {
  console.log(params.class ?? "modal");
  const modal = createDOMElem({
    tag: div,
    parent: params.parent,
    style: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    },
    attrs: {
      class: `modal${params.class ? ` ${params.class}` : ""}`,
      id: params.id,
    },
    children: {
      tag: div,
      attrs: {
        class: `modal-content`,
      },
      children: content,
    },
  });
  const modalBtn = createDOMElem({
    tag: button,
    style: { position: "absolute", top: "5px", right: "5px" },
    attrs: {
      class: `modal-btn`,
    },
    text: "X",
  });
  modal.appendChild(modalBtn);
  return modal;
}
