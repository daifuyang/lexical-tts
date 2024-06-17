import { addClassNamesToElement } from "@lexical/utils";
export function addTagToElement(
  element: HTMLElement,
  text: string,
  ...classNames: Array<typeof undefined | boolean | null | string>
) {
  const tag = document.createElement("span");
  addClassNamesToElement(tag, "editor-tag", ...classNames);
  tag.contentEditable = "false";
  tag.textContent = text;

  // Add the close to the tag
  const close = document.createElement("span");
  addClassNamesToElement(close, "editor-tag-close");
  tag.appendChild(close);

  element.appendChild(tag);
}
