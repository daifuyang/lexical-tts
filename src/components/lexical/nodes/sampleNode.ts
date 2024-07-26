import {
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  ElementNode,
  LexicalNode,
  ParagraphNode,
  SerializedElementNode,
  Spread
} from "lexical";

export type SerializedSampleNode = Spread<{}, SerializedElementNode>;

export class SampleNode extends ElementNode {
  static getType(): string {
    return "sampleNode";
  }

  static clone(node: SampleNode): SampleNode {
    return new SampleNode(node.__key);
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const dom = document.createElement("span");
    dom.className = "sample-node";
    return dom;
  }

  updateDOM(prevNode: SampleNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }

  static importJSON(serializedNode: SerializedSampleNode): SampleNode {
    const node = $createSampleNode();
    return node;
  }

  exportJSON(): SerializedSampleNode {
    return {
      ...super.exportJSON(),
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
}

export function $createSampleNode(): SampleNode {
  return $applyNodeReplacement(new SampleNode());
}

export function $isSampleNode(node: LexicalNode | null): node is SampleNode {
  return node instanceof SampleNode;
}
