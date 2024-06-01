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
  element.appendChild(tag);
}
