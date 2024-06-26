import { closeFloat, setInitialState } from "@/redux/slice/initialState";
import { addClassNamesToElement } from "@lexical/utils";
import { message } from "antd";
import {
  ElementNode,
  $applyNodeReplacement,
  LexicalNode,
  $getSelection,
  $isRangeSelection,
  EditorConfig,
  LexicalEditor,
  Spread,
  SerializedElementNode,
  $isTextNode
} from "lexical";
import { Dispatch } from "react";
import { OPEN_PINYIN_POPUP_COMMAND } from "../plugins/pinyinPlugin";

export type SerializedPinyinNode = Spread<
  {
    pinyin: string;
  },
  SerializedElementNode
>;

export class PinyinNode extends ElementNode {
  __pinyin: string;
  static getType(): string {
    return "pinyinNode";
  }

  static clone(node: PinyinNode): PinyinNode {
    return new PinyinNode(node.__pinyin, node.__key);
  }

  constructor(pinyin: string, key?: string) {
    super(key);
    this.__pinyin = pinyin;
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

      editor.dispatchCommand(OPEN_PINYIN_POPUP_COMMAND, text);
    });
    element.contentEditable = "false";
    element.dataset.pinyin = `[${this.getPinyin()}]`;
    addClassNamesToElement(element, config.theme.pinyin);
    return element;
  }

  updateDOM(prevNode: PinyinNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    dom.dataset.pinyin = `[${this.getPinyin()}]`;
    return true;
  }

  static importJSON(serializedNode: SerializedPinyinNode): PinyinNode {
    const node = $createPinyinNode(serializedNode.pinyin);
    return node;
  }

  exportJSON(): SerializedPinyinNode {
    return {
      ...super.exportJSON(),
      pinyin: this.__pinyin,
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

  setPinyin(pinyin: string): void {
    const self = this.getWritable();
    self.__pinyin = pinyin;
  }

  getPinyin(): string {
    const self = this.getLatest();
    return self.__pinyin;
  }
}

export function $createPinyinNode(pinyin: string): PinyinNode {
  return $applyNodeReplacement(new PinyinNode(pinyin));
}

export function $insertPinyin(pinyin: string) {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }

  const selText = selection.getTextContent();
  const nodes = selection.extract();

  if (!pinyin) {
    // Remove PinyinNodes
    nodes.forEach((node) => {
      const parent = node.getParent();
      if ($isPinyinNode(parent)) {
        const children = parent.getChildren();
        for (let i = 0; i < children.length; i++) {
          parent.insertBefore(children[i]);
        }
        parent.remove();
      }
    });
  } else {
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const parent = node.getParent();
      if ($isTextNode(node) && node.getTextContent() == selText) {
        if ($isPinyinNode(parent)) {
          parent.setPinyin(pinyin);
          return;
        } else {
          const pinyinNode = $createPinyinNode(pinyin);
          node.insertBefore(pinyinNode);
          pinyinNode.append(node);
          return;
        }
      }
    }
  }
}

export function $openPinYinPopup(dispatch: Dispatch<any>, edit: string): void {
  // 新增编辑逻辑合并，打开拼音选择弹窗
  let text = edit;
  if (!text) {
    const selection = $getSelection();
    if (selection) {
      text = selection?.getTextContent();
      if (!text) {
        message.error("请先选中文字!");
        dispatch(closeFloat());
        return;
      } else if (text.length > 1) {
        message.error("请选择单个汉字!");
        dispatch(closeFloat());
        return;
      } else if (!/^[\u4E00-\u9FFF]+$/.test(text)) {
        message.error("请选择单个汉字!");
        dispatch(closeFloat());
        return;
      }
    }
  }
  dispatch(setInitialState({ type: "pinyin", selectionText: text, value: undefined }));
}

export function $isPinyinNode(node: LexicalNode | null | undefined): node is PinyinNode {
  return node instanceof PinyinNode;
}
