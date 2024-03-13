import {
  $getSelection,
  $isNodeSelection,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
  TextNode
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import { message } from "antd";
import { Dispatch } from "react";
import { closeFloat, setInitialState } from "@/redux/slice/initialState";
import { addTagToElement } from "./util";

export type SerializedPinyinNode = Spread<
  {
    pinyin: string;
  },
  SerializedTextNode
>;

export class PinyinNode extends TextNode {
  __pinyin: string;

  constructor(text: string, pinyin: string, key?: NodeKey) {
    super(text, key);
    this.__pinyin = pinyin;
  }

  static getType(): string {
    return "pinyin";
  }

  static clone(node: PinyinNode): PinyinNode {
    return new PinyinNode(node.__text, node.__pinyin, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, "pinyin-node");
    addTagToElement(element,this.__pinyin)
    return element;
  }

  updateDOM(prevNode: PinyinNode, dom: HTMLElement, config: EditorConfig): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    return isUpdated;
  }

  exportJSON(): SerializedPinyinNode {
    return {
      ...super.exportJSON(),
      pinyin: this.__pinyin,
      type: this.getType(),
      version: 1
    };
  }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): false {
    return false;
  }

  canBeEmpty(): false {
    return false;
  }

  isTextEntity(): true {
    return true;
  }

  isInline(): true {
    return true;
  }
}

export function $createPinyinNode(text = "", pinyin: string): PinyinNode {
  return new PinyinNode(text, pinyin);
}

export function $pinYinFloat(editor: LexicalEditor, dispatch: Dispatch<any>): void {
  // 新增编辑逻辑合并，打开拼音选择弹窗

  editor.update(() => {
    const selection = $getSelection();
    if (selection) {
      if ($isNodeSelection(selection)) {
        // 修改更新
        const nodes = selection.extract();
        if (nodes.length > 0) {
        }

        return;
      }

      const text = selection?.getTextContent();
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
      dispatch(setInitialState({ type: "pinyin", selectionText: text, value: undefined }));
    }
  });
}

export function $isColoredNode(node: LexicalNode | null | undefined): node is PinyinNode {
  return node instanceof PinyinNode;
}
