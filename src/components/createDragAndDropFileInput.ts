import { createDOMElem } from "domelemjs";
import type { DragAndDropFileInputParams } from "../types";

export function createDragAndDropFileInput(config: DragAndDropFileInputParams): HTMLElement {
  let files: File[] = [];

  const rootAttrs: Record<string, string> = {
    class: `drag-and-drop${config.class ? ` ${config.class}` : ""}`,
  };
  if (config.id) rootAttrs.id = config.id;

  const fileListAttrs: Record<string, string> = { class: "drag-and-drop-files" };

  function renderFileList(): ReturnType<typeof createDOMElem>[] {
    if (files.length === 0) return [];
    return files.map((file, i) => createDOMElem({
      tag: "div",
      attrs: { class: "drag-and-drop-file" },
      children: [
        createDOMElem({ tag: "span", text: file.name, attrs: { class: "file-name" } }),
        createDOMElem({
          tag: "button",
          text: "\u00D7",
          attrs: { class: "file-remove" },
          handleEvent: {
            event: "click",
            cb: (e: Event) => {
              e.stopPropagation();
              files.splice(i, 1);
              fileListEl.replaceChildren(...renderFileList());
              config.onFiles?.(files);
            },
          },
        }),
      ],
    }));
  }

  const fileListEl = createDOMElem({ tag: "div", attrs: fileListAttrs });
  fileListEl.append(...renderFileList());

  const hiddenInput = createDOMElem({
    tag: "input",
    attrs: {
      type: "file",
      class: "drag-and-drop-hidden",
      ...(config.multiple ? { multiple: "true" } : {}),
      ...(config.accept ? { accept: config.accept.join(",") } : {}),
    },
    handleEvent: {
      event: "change",
      cb: (e: Event) => {
        const inputEl = e.target as HTMLInputElement;
        if (inputEl.files) {
          const newFiles = Array.from(inputEl.files);
          if (config.maxFiles) {
            const allowed = config.maxFiles - files.length;
            files.push(...newFiles.slice(0, allowed));
          } else {
            files.push(...newFiles);
          }
          fileListEl.replaceChildren(...renderFileList());
          config.onFiles?.(files);
        }
      },
    },
  });

  const dropzone = createDOMElem({
    tag: "div",
    attrs: { class: "drag-and-drop-zone" },
    children: [
      createDOMElem({ tag: "div", text: config.dropText || "Húzd ide a fájlokat, vagy kattints a tallózáshoz", attrs: { class: "drag-and-drop-text" } }),
      fileListEl,
    ],
    handleEvent: {
      event: "click",
      cb: () => { (hiddenInput as HTMLInputElement).click?.(); },
    },
  });

  dropzone.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("drag-over");
  });

  dropzone.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
    if (e.dataTransfer?.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      if (config.maxFiles) {
        const allowed = config.maxFiles - files.length;
        files.push(...newFiles.slice(0, allowed));
      } else {
        files.push(...newFiles);
      }
      fileListEl.replaceChildren(...renderFileList());
      config.onFiles?.(files);
    }
  });

  return createDOMElem({
    tag: "div", parent: config.parent, attrs: rootAttrs,
    children: [
      ...(config.labelText ? [createDOMElem({ tag: "label", text: config.labelText, attrs: { class: "drag-and-drop-label" } })] : []),
      dropzone,
      hiddenInput,
    ],
  });
}
