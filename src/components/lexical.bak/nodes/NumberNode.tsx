import {
  $applyNodeReplacement,
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
import { setInitialState } from "@/redux/slice/initialState";
import { addTagToElement } from "./util";

export type SerializedNumberNode = Spread<
  {
    value: string;
    vtype: string;
  },
  SerializedTextNode
>;

export class NumberNode extends TextNode {
  __value: string;
  __vtype: string;

  constructor(value: string, vtype: string, text: string, key?: NodeKey) {
    super(text, key);
    this.__value = value;
    this.__vtype = vtype;
  }

  static getType(): string {
    return "number";
  }

  static clone(node: NumberNode): NumberNode {
    return new NumberNode(node.__value, node.__type, node.__text, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, "editor-tag-node", "number-node");
    addTagToElement(element, this.__vtype, "pinyin-tag");
    return element;
  }

  updateDOM(prevNode: NumberNode, dom: HTMLElement, config: EditorConfig): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    return isUpdated;
  }

  static importJSON(serializedNode: SerializedNumberNode): NumberNode {
    const node = $createNumberNode(serializedNode.value, serializedNode.vtype, serializedNode.text);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedNumberNode {
    return {
      ...super.exportJSON(),
      value: this.__value,
      vtype: this.__vtype,
      type: this.getType(),
      version: 1
    };
  }

  getTextContent(): string {
    return this.__text;
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
}

export function $createNumberNode(value: string, vtype: string, text: string): NumberNode {
  const numberNode = new NumberNode(value, vtype, text);
  numberNode.setMode("segmented")
  return $applyNodeReplacement(numberNode)
}

export function $isNumberNode(
  node: NumberNode | LexicalNode | null | undefined
): node is NumberNode {
  return node instanceof NumberNode;
}

export function $numberFloat(editor: LexicalEditor, dispatch: Dispatch<any>): void {
  // 新增编辑逻辑合并，打开拼音选择弹窗

  editor.update(() => {
    const selection = $getSelection();
    if (selection) {
      if ($isNodeSelection(selection)) {
        // 修改更新
        const nodes = selection.extract();
        if (nodes.length > 0) {
          const numberNode = nodes[0];

          const text = selection?.getTextContent();
          if (!/^\d+(\.\d+)?$/.test(text)) {
            message.error("请选择连贯数字！");
            return;
          }
          dispatch(setInitialState({ type: "symbol", selectionText: text, value: undefined }));
        }

        return;
      }

      const text = selection?.getTextContent();
      if (!/^\d+(\.\d+)?$/.test(text)) {
        message.error("请选择连贯数字！");
        return;
      }
      dispatch(setInitialState({ type: "symbol", selectionText: text, value: undefined }));
    }
  });
}
