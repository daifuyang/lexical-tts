import { ElementNode, LexicalNode, NodeKey, RangeSelection, SerializedElementNode, Spread } from "lexical";
import { addClassNamesToElement } from "@lexical/utils";
import { addTagToElement } from "./util";

export type SerializedVoiceNode = Spread<{
  voice: string
}, SerializedElementNode>;

export class VoiceNode extends ElementNode {

  __voice: string

  constructor(voice: string, key?: NodeKey) {
    super(key);
    this.__voice = voice;
  }

  static getType(): string {
    return "voice";
  }

  static clone(node: VoiceNode): VoiceNode {
    return new VoiceNode(node.__voice,node.__key);
  }

  setVoice(voice: string) {
    const self = this.getWritable();
    self.__voice = voice;
  }

  getVoice(): string {
    const self = this.getLatest();
    return self.__voice;
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const element = document.createElement("span");
    addClassNamesToElement(element, "editor-tag-node", "voice-node");
    addTagToElement(element, this.getVoice(), "voice-tag");
    return element;
  }

  updateDOM(prevNode: VoiceNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }

  static importJSON(serializedNode: SerializedVoiceNode): VoiceNode {
    const node = $createVoiceNode(serializedNode.voice);
    return node;
  }

  exportJSON(): SerializedVoiceNode {
    return {
      ...super.exportJSON(),
      type: this.getType(),
      voice: this.getVoice(),
      version: 1
    };
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

export function $createVoiceNode(voice: string): VoiceNode {
  console.log('voice',voice)
  return new VoiceNode(voice);
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
