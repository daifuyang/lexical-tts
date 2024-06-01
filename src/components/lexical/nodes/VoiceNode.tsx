import { ElementNode, LexicalNode, RangeSelection, SerializedElementNode, Spread } from "lexical";
import { addClassNamesToElement } from "@lexical/utils";
import { addTagToElement } from "./util";

export type SerializedVoiceNode = Spread<{}, SerializedElementNode>;

export class VoiceNode extends ElementNode {
  static getType(): string {
    return "voice";
  }

  static clone(node: VoiceNode): VoiceNode {
    return new VoiceNode(node.__key);
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const element = document.createElement("span");
    addClassNamesToElement(element, "editor-tag-node", "voice-node");
    addTagToElement(element, "晓晓", "voice-tag");
    return element;
  }

  updateDOM(prevNode: VoiceNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }

  static importJSON(serializedNode: SerializedVoiceNode): VoiceNode {
    const node = $createVoiceNode();
    return node;
  }

  exportJSON(): SerializedVoiceNode {
    return {
      ...super.exportJSON(),
      type: this.getType(),
      version: 1
    };
  }

  insertNewAfter(_: RangeSelection, restoreSelection = true): null | ElementNode {
    const voiceNode = $createVoiceNode();
    this.insertAfter(voiceNode, restoreSelection);
    return voiceNode;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  canBeEmpty(): false {
    return false;
  }

  isInline(): true {
    return true;
  }

}

export function $createVoiceNode(): VoiceNode {
  console.log("voiceNode");
  return new VoiceNode();
}

export function $isVoiceNode(node: LexicalNode | null | undefined): node is VoiceNode {
  return node instanceof VoiceNode;
}

export function $getAncestor<NodeType extends LexicalNode = LexicalNode>(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => ancestor is NodeType
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
    parent = parent.getParentOrThrow();
  }
  return predicate(parent) ? parent : null;
}
