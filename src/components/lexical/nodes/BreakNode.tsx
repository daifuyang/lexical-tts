import {
  $applyNodeReplacement,
  DOMConversionMap,
  EditorConfig,
  LexicalNode,
  NodeKey,
  Spread,
  TextModeType,
  TextNode
} from "lexical";
import { SerializedTextNode, TextDetailType } from "lexical/nodes/LexicalTextNode";

export type SerializedBreakNode = Spread<{}, SerializedTextNode>;

export class BreakNode extends TextNode {
  static getType(): string {
    return "break";
  }

  static clone(node: BreakNode): BreakNode {
    const breakNode = new BreakNode(node.__key);
    // TabNode __text can be either '\t' or ''. insertText will remove the empty Node
    breakNode.__text = node.__text;
    breakNode.__format = node.__format;
    breakNode.__style = node.__style;
    return breakNode;
  }

  constructor(key?: NodeKey) {
    super("", key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.className = "editor-break";

    const breakElem = document.createElement("span");
    breakElem.textContent = "‖";
    element.appendChild(breakElem);

    return element;
  }

  static importDOM(): DOMConversionMap | null {
    return null;
  }

  static importJSON(serializedTabNode: SerializedBreakNode): BreakNode {
    const node = $createBreakNode();
    node.setFormat(serializedTabNode.format);
    node.setStyle(serializedTabNode.style);
    return node;
  }

  exportJSON(): SerializedBreakNode {
    return {
      ...super.exportJSON(),
      type: "tab",
      version: 1
    };
  }

  getTextContent(): string {
      return ' '
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createBreakNode(): BreakNode {
  const breakNode = new BreakNode();
  breakNode.setMode("segmented").toggleUnmergeable();
  return $applyNodeReplacement(breakNode);
}

export function $isBreakNode(node: LexicalNode | null | undefined): node is BreakNode {
  return node instanceof BreakNode;
}
