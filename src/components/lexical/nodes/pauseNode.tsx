import { PauseOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import {
  COMMAND_PRIORITY_HIGH,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  LexicalNode,
  SerializedLexicalNode,
  Spread
} from "lexical";
import { useState } from "react";
import Pause from "./pauseComponent";

export type SerializedPauseNode = Spread<
  {
    time: number;
  },
  SerializedLexicalNode
>;

export class PauseNode extends DecoratorNode<JSX.Element> {
  __time: number;

  static getType(): string {
    return "PauseNode";
  }

  static clone(node: PauseNode): PauseNode {
    return new PauseNode(node.__time, node.__key);
  }

  constructor(time: number, key?: string) {
    super(key);
    this.__time = time;
  }

  static importJSON(serializedNode: SerializedPauseNode): PauseNode {
    return $createPauseNode(serializedNode.time);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-pause')) {
          return null;
        }
        return {
          conversion: $convertPauseElement,
          priority: COMMAND_PRIORITY_HIGH
        }
      }
    };
  }

  exportJSON(): SerializedPauseNode {
    return {
      type: this.getType(),
      time: this.getTime(),
      version: 1
    };
  }

  createDOM(): HTMLElement {
    const el = document.createElement("span");
    el.setAttribute("type", this.getType());
    const time = this.getTime();
    el.setAttribute("data-lexical-pause", time.toString())
    return el;
  }

  getTextContent(): string {
    return "pause";
  }

  isInline(): true {
    return true;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <Pause />
  }

  setTime(time: number) {
    const self = this.getWritable();
    self.__time = time;
  }

  getTime() {
    const self = this.getLatest();
    return self.__time;
  }
}

function $convertPauseElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    if (!domNode.hasAttribute('data-lexical-pause')) {
      return null;
    }
    const time = domNode.getAttribute('data-lexical-pause');
    const node = $createPauseNode(Number(time));
    return { node };
  }
  return null;
}

export function $createPauseNode(time: number): PauseNode {
  return new PauseNode(time);
}

export function $isPauseNode(node: LexicalNode | null | undefined): node is PauseNode {
  return node instanceof PauseNode;
}
