import { setInitialState } from "@/redux/slice/initialState";
import { addClassNamesToElement } from "@lexical/utils";
import { message } from "antd";
import {
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  SerializedElementNode,
  Spread
} from "lexical";
import { Dispatch } from "react";
import {
  INSERT_SYMBOL_COMMAND,
  OPEN_SYMBOL_POPUP_COMMAND,
  REMOVE_SYMBOL_COMMAND
} from "../plugins/symbolPlugin";
import { InsertSymbolPayload, RemoveSymbolPayload, SymbolPopupPayload } from "../typings/symbol";

export type SerializedSymbolNode = Spread<
  {
    value: string;
    readType: string;
  },
  SerializedElementNode
>;

export class SymbolNode extends ElementNode {
  __readType: string; //读法类型
  __value: string; //读法

  static getType(): string {
    return "symbolNode";
  }

  static clone(node: SymbolNode): SymbolNode {
    return new SymbolNode(node.__value, node.__readType, node.__key);
  }

  constructor(value: string, readType: string, key?: string) {
    super(key);
    this.__value = value;
    this.__readType = readType;
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    // Define the DOM element here
    const element = document.createElement("span");
    const text = this.getTextContent();
    const value = this.getValue();
    const key = this.getKey();
    element.addEventListener("click", () => {
      // 创建一个新的 Range 对象
      const range = document.createRange();
      range.selectNodeContents(element); // 设置 Range 为包含被点击的 span 的内容

      // 获取当前的 Selection 对象
      const selection = window.getSelection();
      selection?.removeAllRanges(); // 清除任何已有的选区
      selection?.addRange(range); // 添加新的选区

      editor.dispatchCommand(OPEN_SYMBOL_POPUP_COMMAND, {
        text,
        value
      });
    });
    element.contentEditable = "false";
    element.dataset.symbol = `[${this.getReadType()}]`;
    addClassNamesToElement(element, config.theme.symbol);

    const tag = document.createElement("span");
    tag.className = "symbol-tag";

    const tagText = document.createElement("span");
    tagText.className = "text-sm";
    tagText.innerText = this.getReadType();

    const closeSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="#000" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 inline-block">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
`;
    const close = new DOMParser().parseFromString(closeSvg, "image/svg+xml").documentElement;
    close.addEventListener("click", (e) => {
      e.stopPropagation();
      editor.dispatchCommand(REMOVE_SYMBOL_COMMAND, { key });
    });

    tag.appendChild(tagText);
    tag.appendChild(close);

    element.appendChild(tag);
    return element;
  }

  updateDOM(prevNode: SymbolNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    dom.dataset.symbol = `[${this.getReadType()}]`;
    return true;
  }

  static importJSON(serializedNode: SerializedSymbolNode): SymbolNode {
    const node = $createSymbolNode({
      value: serializedNode.value,
      type: serializedNode.readType
    });
    return node;
  }

  exportJSON(): SerializedSymbolNode {
    return {
      ...super.exportJSON(),
      value: this.getValue(),
      readType: this.getReadType(),
      type: this.getType(),
      version: 1
    };
  }

  isInline(): true {
    return true;
  }

  canBeEmpty(): false {
    return false;
  }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): false {
    return false;
  }

  setValue(value: string): void {
    const self = this.getWritable();
    self.__value = value;
  }

  getValue(): string {
    const self = this.getLatest();
    return self.__value;
  }

  setReadType(readType: string): void {
    const self = this.getWritable();
    self.__readType = readType;
  }

  getReadType(): string {
    const self = this.getLatest();
    return self.__readType;
  }
}

export function $createSymbolNode(item: InsertSymbolPayload): SymbolNode {
  return $applyNodeReplacement(new SymbolNode(item?.value || "", item?.type || ""));
}

export function $insertSymbol(item: InsertSymbolPayload) {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.extract();
  const selText = selection.getTextContent();
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    const parent = node.getParent();
    if ($isTextNode(node) && node.getTextContent() == selText) {
      if ($isSymbolNode(parent)) {
        parent.setValue(item?.value || "");
        parent.setReadType(item?.type || "");
        return;
      } else {
        const symbolNode = $createSymbolNode(item);
        node.insertBefore(symbolNode);
        symbolNode.append(node);
        return;
      }
    }
  }
}

export function $removeSymbol(payload: RemoveSymbolPayload) {
  const { key } = payload;
  const symbolNode = $getNodeByKey(key);
  if ($isSymbolNode(symbolNode)) {
    const nodes = (symbolNode as SymbolNode).getChildren();
    // Remove symbolNodes
    nodes.forEach((node) => {
      const parent = node.getParent();
      if ($isSymbolNode(parent)) {
        const children = parent.getChildren();
        for (let i = 0; i < children.length; i++) {
          parent.insertBefore(children[i]);
        }
        parent.remove();
      }
    });
  }
}

function checkStringType(str: string) {
  const digitRegex = /^[0-9]+$/; // 检查是否为阿拉伯数字
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // 检查是否包含特殊符号

  if (digitRegex.test(str)) {
    return "number";
  } else if (specialCharRegex.test(str)) {
    return "symbol";
  } else {
    return null;
  }
}

export function $openSymbolPopup(dispatch: Dispatch<any>, payload: SymbolPopupPayload) {
  let { text, value } = payload;
  if (!text) {
    const selection = $getSelection();
    if (selection) {
      text = selection?.getTextContent();
      const check = checkStringType(text);
      if (!check) {
        message.error("请选择数字或符号！");
        return;
      }
    }
  }
  dispatch(setInitialState({ type: "symbol", selectionText: text, value }));
}

export function $isSymbolNode(node: LexicalNode | null): node is SymbolNode {
  return node instanceof SymbolNode;
}
