import { addClassNamesToElement } from "@lexical/utils";
export function addTagToElement(element: HTMLElement, text: string) {
  const tag = document.createElement("span");
  addClassNamesToElement(tag, "editor-tag", "pinyin-tag");
  tag.contentEditable = "false";
  tag.textContent = text;
  element.appendChild(tag);
}
