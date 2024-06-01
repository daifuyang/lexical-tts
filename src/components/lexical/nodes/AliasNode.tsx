import { setInitialState } from "@/redux/slice/initialState";
import {
  $applyNodeReplacement,
  $isRangeSelection,
  BaseSelection,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
  TextNode,
  createCommand
} from "lexical";
import { Dispatch } from "react";

import { addClassNamesToElement } from "@lexical/utils";
import { addTagToElement } from "./util";

export type SerializedAliasNode = Spread<
  {
    alias: string;
  },
  SerializedTextNode
>;

export class AliasNode extends TextNode {
  __alias: string;

  static getType(): string {
    return "alias";
  }

  static clone(node: AliasNode): AliasNode {
    return new AliasNode(node.__alias, node.__key);
  }

  constructor(alias: string, key?: NodeKey) {
    super(key);
    this.__alias = alias;
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const dom = document.createElement("span");
    addClassNamesToElement(dom, "editor-tag-node", "alias-node");
    addTagToElement(dom, this.__alias);
    return dom;
  }

  updateDOM(prevNode: AliasNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }

  exportJSON(): SerializedAliasNode {
    return {
      ...super.exportJSON(),
      type: "alias",
      alias: this.__alias,
      version: 1
    };
  }

  getAlias(): string {
    return this.__alias;
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

export function $createAliasNode(speed: string): AliasNode {
  return $applyNodeReplacement(new AliasNode(speed));
}

export const TOGGER_ALIAS_COMMAND: LexicalCommand<any> = createCommand("TOGGER_ALIAS_COMMAND");

export function $aliasFloat(editor: LexicalEditor, dispatch: Dispatch<any>): void {
  editor.update(() => {
    dispatch(setInitialState({ type: "alias", selectionText: undefined, value: undefined }));
  });
}

export function toggleAlias() {}

/**
 * Determines if node is a LinkNode.
 * @param node - The node to be checked.
 * @returns true if node is a LinkNode, false otherwise.
 */

export function $isAliasNode(node: LexicalNode | null | undefined): node is AliasNode {
  return node instanceof AliasNode;
}
