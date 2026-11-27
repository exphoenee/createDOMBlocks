import { describe, it, expect } from "vitest";
import { parseYaml, YamlError } from "../src/spec/parseYaml";

const y = (s: string) => parseYaml(s.replace(/^\n/, ""));

describe("parseYaml – skalárok", () => {
  it("típusokat old fel", () => {
    expect(y(`
a: 1
b: -2.5
c: true
d: false
e: null
f: ~
g:
h: szöveg
i: 007
j: 1.0.0
`)).toEqual({ a: 1, b: -2.5, c: true, d: false, e: null, f: null, g: null, h: "szöveg", i: "007", j: "1.0.0" });
  });

  it("idézőjeles szövegek és escape-ek", () => {
    expect(y(`
a: "tab\\tújsor\\n \\"idézet\\" \\u0041"
b: 'it''s: fine # nem megjegyzés'
c: "1"
`)).toEqual({ a: 'tab\tújsor\n "idézet" A', b: "it's: fine # nem megjegyzés", c: "1" });
  });

  it("megjegyzés csak szóköz után / sor elején számít", () => {
    expect(y(`
# teljes soros
a: b # ez megjegyzés
c: x#y
d: "a # b"
`)).toEqual({ a: "b", c: "x#y", d: "a # b" });
  });

  it("a ${...} kifejezésben a : , # és idézőjel nem tördel", () => {
    expect(y(`
a: \${x ? 'igen' : 'nem'}
b: "\${n > 1 ? 'x' : 'y'}"
c: [\${a ? b : c}, \${d}]
`)).toEqual({ a: "${x ? 'igen' : 'nem'}", b: "${n > 1 ? 'x' : 'y'}", c: ["${a ? b : c}", "${d}"] });
  });

  it("az aposztróf a szó közepén nem nyit idézőjelet", () => {
    expect(y(`a: don't stop # megjegyzés`)).toEqual({ a: "don't stop" });
  });
});

describe("parseYaml – szerkezetek", () => {
  it("beágyazott térkép és lista", () => {
    expect(y(`
ui:
  - Card:
      title: Cím
      body:
        - Paragraph: Szöveg
        - Button: Mentés
  - Divider: null
`)).toEqual({ ui: [{ Card: { title: "Cím", body: [{ Paragraph: "Szöveg" }, { Button: "Mentés" }] } }, { Divider: null }] });
  });

  it("a lista a kulccsal azonos behúzású is lehet", () => {
    expect(y(`
a:
- 1
- 2
b: x
`)).toEqual({ a: [1, 2], b: "x" });
  });

  it("lista elem több kulccsal és beágyazott lista", () => {
    expect(y(`
- id: a
  name: Alfa
  tags:
    - x
    - y
- - 1
  - 2
`)).toEqual([{ id: "a", name: "Alfa", tags: ["x", "y"] }, [1, 2]]);
  });

  it("a komponens-kulcsok speciális karakterekkel", () => {
    expect(y(`
- Card#filter-\${c.id}.wide.dark:
    title: x
- Title(2)#t: Cím
- div.row: [a, b]
`)).toEqual([{ "Card#filter-${c.id}.wide.dark": { title: "x" } }, { "Title(2)#t": "Cím" }, { "div.row": ["a", "b"] }]);
  });

  it("idézett kulcs", () => {
    expect(y(`
"a: b": 1
'c d': 2
`)).toEqual({ "a: b": 1, "c d": 2 });
  });

  it("dokumentum-kezdő --- megengedett", () => {
    expect(y(`
---
a: 1
`)).toEqual({ a: 1 });
  });

  it("üres bemenet és csak megjegyzés", () => {
    expect(y("")).toBeNull();
    expect(y("# semmi\n\n")).toBeNull();
  });

  it("CRLF sorvég", () => {
    expect(parseYaml("a: 1\r\nb:\r\n  - x\r\n")).toEqual({ a: 1, b: ["x"] });
  });
});

describe("parseYaml – flow forma", () => {
  it("lista és térkép, beágyazva", () => {
    expect(y(`a: { x: 1, y: [1, 2, {z: true}], s: "a, b", t: sima szöveg }`)).toEqual({
      a: { x: 1, y: [1, 2, { z: true }], s: "a, b", t: "sima szöveg" },
    });
  });

  it("üres kollekciók", () => {
    expect(y(`a: []\nb: {}`)).toEqual({ a: [], b: {} });
  });

  it("több sorra tördelt flow", () => {
    expect(y(`
a: [
  1,
  2
]
b: x
`)).toEqual({ a: [1, 2], b: "x" });
  });

  it("${} kulcs-érték a flow-ban", () => {
    expect(y(`{ title: \${c.name}, n: 2 }`)).toEqual({ title: "${c.name}", n: 2 });
  });
});

describe("parseYaml – blokk-skalár", () => {
  it("| megtartja a sorokat", () => {
    expect(y(`
a: |
  első
    második

  harmadik
b: x
`)).toEqual({ a: "első\n  második\n\nharmadik\n", b: "x" });
  });

  it("> összefűzi a sorokat, a - levágja a záró sortörést", () => {
    expect(y(`
a: >
  egy
  két
b: >-
  végén
  nincs
`)).toEqual({ a: "egy két\n", b: "végén nincs" });
  });

  it("lista elemeként is", () => {
    expect(y(`
- |
  sor1
  sor2
- x
`)).toEqual(["sor1\nsor2\n", "x"]);
  });
});

describe("parseYaml – hibák", () => {
  const fail = (src: string, re: RegExp, line?: number) => {
    try {
      parseYaml(src);
    } catch (e) {
      expect(e).toBeInstanceOf(YamlError);
      expect((e as Error).message).toMatch(re);
      if (line) expect((e as YamlError).line).toBe(line);
      return;
    }
    throw new Error("nem dobott hibát: " + src);
  };

  it("tabulátor behúzás", () => fail("a:\n\tb: 1", /tabulátor/, 2));
  it("ismétlődő kulcs", () => fail("a: 1\nb: 2\na: 3", /ismétlődő kulcs: a/, 3));
  it("nincs lezárt idézőjel", () => fail('a: "nyitva', /idézőjel/, 1));
  it("nincs lezárt flow", () => fail("a: [1, 2", /nincs lezárva/, 1));
  it("horgony és alias", () => {
    fail("a: &x 1", /horgony/, 1);
    fail("a: *x", /horgony/, 1);
  });
  it("címke", () => fail("a: !tag x", /címke/, 1));
  it("több dokumentum", () => fail("a: 1\n---\nb: 2", /több dokumentum/));
  it("hibás behúzás", () => fail("a: 1\n  b: 2", /behúzás|váratlan/));
  it("kulcs nélküli sor a térképben", () => fail("a: 1\nszöveg", /kulcs: érték/, 2));
  it("a hibaüzenet tartalmazza a sorszámot", () => {
    try {
      parseYaml("a: 1\nb: [1,\nc: 2");
    } catch (e) {
      expect((e as Error).message).toMatch(/\(\d+\. sor\)/);
    }
  });
});
