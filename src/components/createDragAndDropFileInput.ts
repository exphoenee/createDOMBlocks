import { createDOMElem } from "domelemjs";
import type { DragAndDropFileInputParams } from "../types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const iconMap: Record<string, string> = {
    pdf: "\uD83D\uDCC4", jpg: "\uD83D\uDDBC", jpeg: "\uD83D\uDDBC",
    png: "\uD83D\uDDBC", gif: "\uD83C\uDFAC", svg: "\uD83D\uDD8C",
    doc: "\uD83D\uDCDD", docx: "\uD83D\uDCDD", xls: "\uD83D\uDCCA", xlsx: "\uD83D\uDCCA",
    zip: "\uD83D\uDCE6", rar: "\uD83D\uDCE6", "7z": "\uD83D\uDCE6",
    mp4: "\uD83C\uDFA5", mov: "\uD83C\uDFA5", mp3: "\uD83C\uDFB5",
    json: "{ }", ts: "TS", js: "JS", css: "CSS", html: "HTML",
  };
  return iconMap[ext] || "\uD83D\uDCC1";
}

export function createDragAndDropFileInput(params: DragAndDropFileInputParams): HTMLElement {
  let files: File[] = [];

  const rootAttrs: Record<string, string> = {
    class: `drag-and-drop${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  const fileListAttrs: Record<string, string> = { class: "dd-file-list" };

  function renderFileList(): ReturnType<typeof createDOMElem>[] {
    if (files.length === 0) return [];
    return files.map((file, i) => createDOMElem({
      tag: "div",
      attrs: { class: "dd-file-item" },
      children: [
        createDOMElem({ tag: "span", text: getFileIcon(file.name), attrs: { class: "dd-file-icon" } }),
        createDOMElem({
          tag: "div",
          attrs: { class: "dd-file-info" },
          children: [
            createDOMElem({ tag: "span", text: file.name, attrs: { class: "dd-file-name" } }),
            createDOMElem({ tag: "span", text: formatSize(file.size), attrs: { class: "dd-file-size" } }),
          ],
        }),
        createDOMElem({
          tag: "button",
          text: "\u00D7",
          attrs: { class: "dd-file-remove" },
          handleEvent: {
            event: "click",
            cb: (e: Event) => {
              e.stopPropagation();
              files.splice(i, 1);
              fileListEl.replaceChildren(...renderFileList());
              params.onFiles?.(files);
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
      class: "dd-hidden-input",
      ...(params.multiple ? { multiple: "true" } : {}),
      ...(params.accept ? { accept: params.accept.join(",") } : {}),
    },
    handleEvent: {
      event: "change",
      cb: (e: Event) => {
        const inputEl = e.target as HTMLInputElement;
        if (inputEl.files) {
          const newFiles = Array.from(inputEl.files);
          if (params.maxFiles) {
            const allowed = params.maxFiles - files.length;
            files.push(...newFiles.slice(0, allowed));
          } else {
            files.push(...newFiles);
          }
          fileListEl.replaceChildren(...renderFileList());
          params.onFiles?.(files);
          inputEl.value = "";
        }
      },
    },
  });

  const dropIcon = createDOMElem({ tag: "div", text: "\u2B06", attrs: { class: "dd-drop-icon" } });
  const dropText = createDOMElem({
    tag: "div",
    attrs: { class: "dd-drop-text" },
    children: [
      createDOMElem({ tag: "span", text: params.dropText || "Húzd ide a fájlokat", attrs: { class: "dd-drop-title" } }),
      createDOMElem({ tag: "span", text: "vagy kattints a tallózáshoz", attrs: { class: "dd-drop-sub" } }),
    ],
  });
  const dropHint = createDOMElem({
    tag: "div",
    attrs: { class: "dd-drop-hint" },
    text: params.accept ? `.${params.accept.join(", .")} f\u00E1jlok` : "B\u00E1rmilyen f\u00E1jl t\u00E1mogatott",
  });

  const dropzone = createDOMElem({
    tag: "div",
    attrs: { class: "dd-dropzone" },
    children: [dropIcon, dropText, dropHint, fileListEl],
  });

  dropzone.addEventListener("click", () => {
    (hiddenInput as HTMLInputElement).click();
  });

  dropzone.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.add("dd-drag-over");
  });

  dropzone.addEventListener("dragenter", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.add("dd-drag-over");
  });

  dropzone.addEventListener("dragleave", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropzone.contains(e.relatedTarget as Node)) {
      dropzone.classList.remove("dd-drag-over");
    }
  });

  dropzone.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove("dd-drag-over");
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      if (params.maxFiles) {
        const allowed = params.maxFiles - files.length;
        files.push(...newFiles.slice(0, allowed));
      } else {
        files.push(...newFiles);
      }
      fileListEl.replaceChildren(...renderFileList());
      params.onFiles?.(files);
    }
  });

  return createDOMElem({
    tag: "div", parent: params.parent, attrs: rootAttrs,
    children: [
      ...(params.labelText
        ? [createDOMElem({ tag: "label", text: params.labelText, attrs: { class: "dd-label" } })]
        : []),
      dropzone,
      hiddenInput,
    ],
  });
}
