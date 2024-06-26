import { addClassNamesToElement } from "@lexical/utils";
import {
  $applyNodeReplacement,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode
} from "lexical";
import { Dispatch } from "react";

export class SymbolNode extends ElementNode {
  __value: string; //读法

  static getType(): string {
    return "symbol-node";
  }

  static clone(node: SymbolNode): SymbolNode {
    return new SymbolNode(node.__value, node.__key);
  }

  constructor(value: string, key?: string) {
    super(key);
    this.__value = value;
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    // Define the DOM element here
    const element = document.createElement("span");
    const text = this.getTextContent();
    element.addEventListener("click", () => {
      // 创建一个新的 Range 对象
      const range = document.createRange();
      range.selectNodeContents(element); // 设置 Range 为包含被点击的 span 的内容

      // 获取当前的 Selection 对象
      const selection = window.getSelection();
      selection?.removeAllRanges(); // 清除任何已有的选区
      selection?.addRange(range); // 添加新的选区
    });
    element.contentEditable = "false";
    addClassNamesToElement(element, config.theme.symbol);
    return element;
  }

  updateDOM(prevNode: SymbolNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }
}

export function $createSymbolNode(value: string): SymbolNode {
  return $applyNodeReplacement(new SymbolNode(value));
}

export function $insertSymbol(value: string) {}

export function $openSymbolPopup(dispatch: Dispatch<any>) {

}

export function $isSymbolNode(node: LexicalNode | null): node is SymbolNode {
  return node instanceof SymbolNode;
}