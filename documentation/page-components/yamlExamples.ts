/**
 * Komponensenkénti YAML minták a dokumentáció komponens-oldalaihoz.
 *
 * Kulcs: a komponens neve a `create` nélkül (pl. `Card`). Az érték a YAML leírás: ugyanaz a szöveg jelenik meg
 * a kódblokkban és épül fel élőben az eredmény-területen (`buildUI`). Tiszta adat: a teszt (test/spec-docs-examples.test.ts)
 * minden mintát felépít, és ellenőrzi, hogy minden komponensnek van mintája.
 * A mintákban a `§{` jelentése `${` (nem kell a sablonszövegben escape-elni).
 */

export const YAML_EXAMPLES: Record<string, string> = {
  Accordion: `
ui:
  - Accordion:
      - id: first
        title: Első szakasz
        open: true
        content:
          - Paragraph: Az első szakasz tartalma.
      - id: second
        title: Második szakasz
        content:
          - Paragraph: A második szakasz tartalma.
`,

  Alert: `
ui:
  - Alert:
      type: success
      title: Siker!
      message: Mentés sikeres.
`,

  Avatar: `
ui:
  - Avatar: { name: Viktor Bozzay, size: lg }
`,

  Badge: `
ui:
  - Badge: { text: Új, type: info }
  - Badge: { text: Kész, type: success }
`,

  Blockquote: `
ui:
  - Blockquote:
      text: A kódolás a jövő nyelve.
      author: Bozzay Viktor
`,

  Breadcrumb: `
ui:
  - Breadcrumb:
      items:
        - { text: Főoldal, href: "#" }
        - { text: Termék, href: "#" }
        - { text: Laptop }
`,

  Button: `
state: { clicks: 0 }
ui:
  - Button:
      text: Kattints
      click:
        inc: clicks
  - Paragraph: "Kattintások: §{clicks}"
`,

  ButtonInput: `
ui:
  - ButtonInput: { text: Button input }
`,

  Card: `
ui:
  - Card:
      title: Kártya cím
      body:
        - Paragraph: Tartalom
      footer:
        - Button: Mentés
`,

  Carousel: `
ui:
  - Carousel:
      showDots: true
      slides:
        - { icon: "🚀", title: Első slide, description: Gyors indulás }
        - { icon: "🛡️", title: Második slide, description: Biztonság }
        - { icon: "📊", title: Harmadik slide, description: Monitoring }
`,

  Checkbox: `
state: { accepted: true }
ui:
  - Checkbox: { labelText: Elfogadom, bind: accepted }
  - Paragraph: "Elfogadva: §{accepted ? 'igen' : 'nem'}"
`,

  CodeBlock: `
ui:
  - CodeBlock:
      language: typescript
      code: |
        const x: number = 42;
        console.log(x);
`,

  ColorInput: `
ui:
  - ColorInput: { labelText: "Szín:", value: "#3b82f6" }
`,

  Container: `
ui:
  - Container:
      - Paragraph: Egy
      - Paragraph: Kettő
`,

  CustomDatePicker: `
ui:
  - CustomDatePicker: { labelText: "Dátum:", placeholder: Válassz dátumot... }
`,

  CustomDateRangePicker: `
ui:
  - CustomDateRangePicker: { labelText: "Tartomány:" }
`,

  CustomDateTimePicker: `
ui:
  - CustomDateTimePicker: { labelText: "Dátum-Idő:", placeholder: Válassz dátumot és időt... }
`,

  CustomMonthPicker: `
ui:
  - CustomMonthPicker: { labelText: "Hónap:", placeholder: Válassz hónapot... }
`,

  CustomSelect: `
ui:
  - CustomSelect:
      placeholder: Válassz...
      options:
        - { text: Budapest, value: bp }
        - { text: Debrecen, value: dc }
`,

  CustomWeekPicker: `
ui:
  - CustomWeekPicker: { labelText: "Hét:", placeholder: Válassz hetet... }
`,

  DateInput: `
ui:
  - DateInput: { labelText: "Dátum:", value: "2024-01-15" }
`,

  DatetimeInput: `
ui:
  - DatetimeInput: { labelText: "Dátum-Idő:", value: "2024-01-15T14:30" }
`,

  Divider: `
ui:
  - Paragraph: Fölötte
  - Divider: null
  - Paragraph: Alatta
`,

  DragAndDropFileInput: `
ui:
  - DragAndDropFileInput:
      labelText: "Fájl feltöltése:"
      dropText: Húzd ide a fájlokat
      accept: [".jpg", ".png", ".pdf"]
      multiple: true
`,

  Drawer: `
ui:
  - Button:
      text: Drawer megnyitása
      click:
        open: yaml-demo-drawer
  - Drawer#yaml-demo-drawer:
      title: Overlay Drawer
      hasOverlay: true
      mode: overlay
      children:
        - p: Ez egy overlay módú drawer.
        - p: Kattints a × gombra vagy a sötét háttérre a bezáráshoz.
`,

  EmailInput: `
ui:
  - EmailInput: { labelText: "Email:", value: test@example.com }
`,

  FileInput: `
ui:
  - FileInput: { labelText: "Fájl:" }
`,

  Form: `
ui:
  - Form:
      action: /api/submit
      method: POST
      inputs:
        - { type: text, id: yaml-form-name, labelText: "Név:" }
        - { type: email, id: yaml-form-email, labelText: "Email:" }
        - { type: submit, id: yaml-form-submit, value: Küldés }
`,

  Gantt: `
ui:
  - Gantt:
      today: "2026-02-10"
      monthWidth: 0
      axis: months
      barStyle: thin
      rows:
        - id: planning
          label: Tervezés
          start: "2026-01"
          end: "2026-02"
          color: "#6366f1"
          milestones:
            - { date: "2026-01-20", label: Specifikáció, caption: jan. 20., placement: above }
        - id: building
          label: Megvalósítás
          start: "2026-02"
          end: "2026-04"
          color: "#22c55e"
          milestones:
            - { date: "2026-04-15", label: Kiadás, caption: ápr. 15., placement: below, shape: diamond }
`,

  Grid: `
ui:
  - Grid:
      columns: 3
      gap: 1rem
      children:
        - Card: { title: Egy, body: [ { Paragraph: bal } ] }
        - Card: { title: Kettő, body: [ { Paragraph: közép } ] }
        - Card: { title: Három, body: [ { Paragraph: jobb } ] }
`,

  HiddenInput: `
ui:
  - HiddenInput: { name: token, value: abc123 }
  - Paragraph: A rejtett mező nem látszik, de az űrlappal együtt elküldődik.
`,

  Image: `
ui:
  - Image:
      src: https://picsum.photos/400/200
      alt: Példa kép
      caption: Példa caption
`,

  Link: `
ui:
  - Link:
      text: Példa link
      href: https://example.com
      target: _blank
`,

  Menu: `
ui:
  - Menu:
      items:
        - { label: Kezdőlap, href: "#" }
        - { label: Profil, href: "#" }
        - { label: Beállítások, href: "#" }
`,

  Modal: `
ui:
  - Button:
      text: Ablak megnyitása
      click:
        open: yaml-demo-modal
  - Modal#yaml-demo-modal:
      title: Üdvözlet
      footer: false
      closeOnBackdrop: true
      closeOnEscape: true
      body:
        - Paragraph: Ez a Modal törzse, bármilyen csomópontot tartalmazhat.
        - Button:
            text: Bezárás
            click:
              close: yaml-demo-modal
`,

  MonthInput: `
ui:
  - MonthInput: { labelText: "Hónap:", value: "2024-01" }
`,

  MusicPlayer: `
ui:
  - MusicPlayer:
      loop: all
      tracks:
        - src: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
          title: SoundHelix Song 1
          artist: T. Schürger
        - src: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3
          title: SoundHelix Song 2
          artist: T. Schürger
`,

  Nav: `
ui:
  - Nav:
      items:
        - { text: Főoldal, href: "#", active: true }
        - { text: Rólunk, href: "#" }
        - text: Szolgáltatások
          href: "#"
          children:
            - { text: Webfejlesztés, href: "#" }
`,

  NumberInput: `
ui:
  - NumberInput: { labelText: "Szám:", value: 42, min: 0, max: 100, step: 5 }
`,

  OrderedList: `
ui:
  - OrderedList: [Tervezés, Megvalósítás, Tesztelés]
`,

  Paragraph: `
ui:
  - Paragraph: Ez egy bekezdés szöveg.
`,

  PasswordInput: `
ui:
  - PasswordInput: { labelText: "Jelszó:", placeholder: "****" }
`,

  ProgressBar: `
ui:
  - ProgressBar: { value: 75, label: "Letöltés:", showPercentage: true }
`,

  Radio: `
state: { choice: "2" }
ui:
  - Radio:
      bind: choice
      options:
        - { text: Első, value: 1 }
        - { text: Második, value: 2 }
        - { text: Harmadik, value: 3 }
  - Paragraph: "Választott: §{choice}"
`,

  RangeInput: `
state: { volume: 50 }
ui:
  - RangeInput: { labelText: "Hangerő:", min: 0, max: 100, bind: volume }
  - Paragraph: "Hangerő: §{volume}"
`,

  ResetInput: `
ui:
  - ResetInput: { text: Visszaállítás }
`,

  SearchInput: `
ui:
  - SearchInput: { labelText: "Keresés:", placeholder: Keress... }
`,

  Select: `
state: { city: "2" }
ui:
  - Select:
      bind: city
      options:
        - { text: Első, value: 1 }
        - { text: Második, value: 2 }
        - { text: Harmadik, value: 3 }
  - Paragraph: "Választott: §{city}"
`,

  Spinner: `
ui:
  - Spinner: { size: sm }
  - Spinner: { size: lg }
`,

  SubmitInput: `
ui:
  - SubmitInput: { text: Küldés }
`,

  Table: `
ui:
  - Table:
      - { Név: Alma, Ár: 120 }
      - { Név: Körte, Ár: 180 }
      - { Név: Szilva, Ár: 90 }
`,

  Tabs: `
ui:
  - Tabs:
      - { id: settings, label: Beállítások, content: [ { Paragraph: Beállítások tartalma } ] }
      - { id: profile, label: Profil, content: [ { Paragraph: Profil tartalma } ] }
      - { id: notifications, label: Értesítések, content: [ { Paragraph: Értesítések tartalma } ] }
`,

  TelInput: `
ui:
  - TelInput: { labelText: "Telefon:", value: "+36301234567" }
`,

  Textarea: `
ui:
  - Textarea: { labelText: "Szöveg:", value: Szöveg..., rows: 5 }
`,

  TextInput: `
state: { name: valami }
ui:
  - TextInput: { labelText: "Név:", placeholder: Ide írj..., bind: name }
  - Paragraph: "A beírt érték: §{name}"
`,

  TimeInput: `
ui:
  - TimeInput: { labelText: "Idő:", value: "14:30" }
`,

  Timeline: `
ui:
  - Timeline:
      ariaLabel: Munkatapasztalat
      items:
        - { period: 2022 – jelenleg, title: Senior fejlesztő, subtitle: Példa Kft., description: Komponenskönyvtár fejlesztése., badge: jelenlegi }
        - { period: 2019 – 2022, title: Fejlesztő, subtitle: Minta Zrt., description: Webalkalmazások fejlesztése. }
`,

  Title: `
ui:
  - Title(1): Címsor 1
  - Title(2): Címsor 2
  - Title(3): Címsor 3
`,

  Toast: `
state: { messages: [] }
ui:
  - Button:
      text: Toast megjelenítése
      click:
        push:
          messages: Értesítés!
  - each: { in: "§{messages}", as: message }
    do:
      - Toast: { message: "§{message}", type: success, duration: 3000 }
`,

  Tooltip: `
ui:
  - Tooltip: { text: Ez egy tooltip!, position: top }
  - Tooltip: { text: Alsó tooltip, position: bottom }
`,

  UnorderedList: `
ui:
  - UnorderedList: [Első, Második, Harmadik]
`,

  UrlInput: `
ui:
  - UrlInput: { labelText: "URL:", value: "https://example.com" }
`,

  Video: `
ui:
  - Video:
      src: https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4
      width: 480
      height: 270
      caption: Példa videó (mp4)
`,

  WeekInput: `
ui:
  - WeekInput: { labelText: "Hét:", value: "2024-W03" }
`,
};

/** A minta megjelenítésre és felépítésre kész szövege. */
export function yamlExample(component: string): string | undefined {
  const src = YAML_EXAMPLES[component];
  return src ? src.replace(/§\{/g, "${").replace(/^\n/, "") : undefined;
}
