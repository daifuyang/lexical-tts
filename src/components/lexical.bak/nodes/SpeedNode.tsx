import { setInitialState } from "@/redux/slice/initialState";
import {
  $applyNodeReplacement,
  $getSelection,
  $isRangeSelection,
  BaseSelection,
  ElementNode,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread,
  createCommand
} from "lexical";
import { Dispatch } from "react";

import { addClassNamesToElement } from "@lexical/utils";
import { addTagToElement } from "./util";

export type SerializedSpeedNode = Spread<
  {
    speed: number;
  },
  SerializedElementNode
>;

export class SpeedNode extends ElementNode {
  __speed: number;

  static getType(): string {
    return "speed";
  }

  static clone(node: SpeedNode): SpeedNode {
    return new SpeedNode(node.__speed, node.__key);
  }

  constructor(speed: number, key?: NodeKey) {
    super(key);
    this.__speed = speed;
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const dom = document.createElement("span");
    addClassNamesToElement(dom, "editor-tag-node", "speed-node");
    addTagToElement(dom, `变速：${this.__speed}`, 'speed-tag');
    return dom;
  }

  updateDOM(prevNode: SpeedNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }

  static importJSON(serializedNode: SerializedSpeedNode): SpeedNode {
    const node = $createSpeedNode(serializedNode.speed);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedSpeedNode {
    return {
      ...super.exportJSON(),
      type: "speed",
      speed: this.__speed,
      version: 1
    };
  }

  getSpeed(): number {
    return this.__speed;
  }

  insertNewAfter(_: RangeSelection, restoreSelection = true): null | ElementNode {
    const speedNode = $createSpeedNode(this.__speed);
    this.insertAfter(speedNode, restoreSelection);
    return speedNode;
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

  isInline(): true {
    return true;
  }

  extractWithChild(
    child: LexicalNode,
    selection: BaseSelection,
    destination: "clone" | "html"
  ): boolean {
    if (!$isRangeSelection(selection)) {
      return false;
    }

    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();

    return (
      this.isParentOf(anchorNode) &&
      this.isParentOf(focusNode) &&
      selection.getTextContent().length > 0
    );
  }
}

export function $createSpeedNode(speed: number): SpeedNode {
  return $applyNodeReplacement(new SpeedNode(speed));
}

export const TOGGER_SPEED_COMMAND: LexicalCommand<any> = createCommand("TOGGER_SPEED_COMMAND");

export function $speedFloat(editor: LexicalEditor, dispatch: Dispatch<any>): void {
  editor.update(() => {
    dispatch(setInitialState({ type: "speed", selectionText: undefined, value: undefined }));
  });
}

export function toggleSpeed() {}

/**
 * Determines if node is a LinkNode.
 * @param node - The node to be checked.
 * @returns true if node is a LinkNode, false otherwise.
 */
export function $isSpeedNode(node: LexicalNode | null | undefined): node is SpeedNode {
  return node instanceof SpeedNode;
}
