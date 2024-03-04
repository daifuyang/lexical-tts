import {
  DecoratorNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
  Spread,
  $applyNodeReplacement,
  $getSelection,
  $isRangeSelection,
  SerializedLexicalNode,
  TextNode
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import * as React from "react";

import { Tag } from "antd";
import clsx from "clsx";

export type SerializedPinyinNode = Spread<
  {
    value: string;
    type: string;
    text: string;
  },
  SerializedLexicalNode
>;

export class NumberNode extends DecoratorNode<JSX.Element> {
  __value: string;
  __vtype: string;
  __text: string;

  constructor(value: string, type: string, text: string, key?: NodeKey) {
    super(key);
    this.__value = value;
    this.__vtype = type;
    this.__text = text;
  }

  static getType(): string {
    return "number";
  }

  static clone(node: NumberNode): NumberNode {
    return new NumberNode(node.__value, node.__vtype, node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedPinyinNode): NumberNode {
    const node = $createNumberNode(serializedNode.value, serializedNode.type, serializedNode.text);
    return node;
  }

  exportJSON(): SerializedPinyinNode {
    return {
      ...super.exportJSON(),
      value: this.__value,
      text: this.__text,
      type: this.getType(),
      version: 1
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement("span");
    addClassNamesToElement(element, config.theme.number);
    return element;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <>
        <Tag
          className={clsx({
            "editor-tag": true,
            "editor-number-tag": true,
            "editor-green-tag": true
          })}
          color="green"
        >
          {this.__vtype}
        </Tag>
        <span>{this.__text}</span>
      </>
    );
  }
}

export function $createNumberNode(value: string, type: string, text: string): NumberNode {
  return $applyNodeReplacement(new NumberNode(value, type, text));
}

export function $isNumberNode(
  node: NumberNode | LexicalNode | null | undefined
): node is NumberNode {
  return node instanceof NumberNode;
}

export function toggleNumber(value: string, type: string): void {

  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }

  const nodes = selection.extract();
  if (nodes.length > 0) {
    const node = nodes[0];
    const numberNode = $createNumberNode(value, type, (node as TextNode).__text);
    node.insertBefore(numberNode);
    node.remove();
    numberNode.selectEnd();
  }
}
