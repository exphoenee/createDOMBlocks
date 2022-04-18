const rewire = require("rewire");

const index = rewire("../index");

const createInput = index.__get__("createInput");

// @ponicode
describe("createInput", () => {
  test("0", () => {
    let result = createInput({
      parent: "Ronald Keeling",
      classes: 1,
      id: "a85a8e6b-348b-4011-a1ec-1e78e9620782",
      name: "George",
      labelText: "AOP",
      value: "elio@example.com",
      placeholder: false,
      onChange: false,
      click: false,
      handleEvent:
        "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E",
    });
    expect(result).toMatchSnapshot();
  });

  test("1", () => {
    let result = createInput({
      parent: "Maurice Purdy",
      classes: 10,
      id: "03ea49f8-1d96-4cd0-b279-0684e3eec3a9",
      name: "Jean-Philippe",
      labelText: "ISO 22000",
      value: "elio@example.com",
      placeholder: true,
      onChange: false,
      click: false,
      handleEvent:
        "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E",
    });
    expect(result).toMatchSnapshot();
  });

  test("2", () => {
    let result = createInput({
      parent: "Maurice Purdy",
      classes: 10,
      id: "7289708e-b17a-477c-8a77-9ab575c4b4d8",
      name: "Anas",
      labelText: "label_2",
      value: "Elio",
      placeholder: true,
      onChange: false,
      click: false,
      handleEvent:
        "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E",
    });
    expect(result).toMatchSnapshot();
  });

  test("3", () => {
    let result = createInput({
      parent: "Ronald Keeling",
      classes: 10,
      id: "03ea49f8-1d96-4cd0-b279-0684e3eec3a9",
      name: "Michael",
      labelText: "label_2",
      value: "Elio",
      placeholder: true,
      onChange: true,
      click: true,
      handleEvent:
        "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E",
    });
    expect(result).toMatchSnapshot();
  });

  test("4", () => {
    let result = createInput({
      parent: "Janet Homenick",
      classes: 10,
      id: "7289708e-b17a-477c-8a77-9ab575c4b4d8",
      name: "George",
      labelText: "ISO 22000",
      value: "elio@example.com",
      placeholder: true,
      onChange: true,
      click: false,
      handleEvent:
        "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E",
    });
    expect(result).toMatchSnapshot();
  });

  test("5", () => {
    let result = createInput({
      parent: "",
      classes: NaN,
      id: "",
      name: "",
      labelText: "",
      value: "",
      placeholder: true,
      onChange: true,
      click: true,
      handleEvent: "",
    });
    expect(result).toMatchSnapshot();
  });

  test("6", () => {
    let result = createInput({
      parent: "Becky Bednar",
      classes: 1000,
      id: "a85a8e6b-348b-4011-a1ec-1e78e9620782",
      name: "George",
      labelText: "AOP",
      value: "elio@example.com",
      placeholder: false,
      onChange: false,
      click: false,
      handleEvent:
        "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E",
    });
    expect(result).toMatchSnapshot();
  });

  test("7", () => {
    let result = createInput({
      parent: "",
      classes: Infinity,
      id: "",
      name: "",
      labelText: "",
      value: "",
      placeholder: true,
      onChange: false,
      click: true,
      handleEvent: "",
    });
    expect(result).toMatchSnapshot();
  });
});
