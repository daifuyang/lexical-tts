import {
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  ElementNode,
  LexicalNode,
  ParagraphNode,
  SerializedElementNode,
  Spread
} from "lexical";

export type SerializedWrapNode = Spread<{}, SerializedElementNode>;

export class WrapNode extends ElementNode {
  static getType(): string {
    return "wrapNode";
  }

  static clone(node: WrapNode): WrapNode {
    return new WrapNode(node.__key);
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const dom = document.createElement("span");
    dom.className = "wrap-node";
    return dom;
  }

  updateDOM(prevNode: WrapNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }

  static importJSON(serializedNode: SerializedWrapNode): WrapNode {
    const node = $createWrapNode();
    return node;
  }

  exportJSON(): SerializedWrapNode {
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

export function $createWrapNode(): WrapNode {
  return $applyNodeReplacement(new WrapNode());
}

function hasWrapNode(nodes: any): boolean {
  for (const node in nodes) {
    if ($isWrapNode(node)) {
      return true;
    }
  }
  return false;
}

function arrayToTree(array: any) {
  // 创建一个字典以便快速查找
  const map: any = {};
  array.forEach((item: any) => {
    map[item.__key] = { ...item, children: [] };
  });

  // 创建树状结构
  const tree: any = [];
  array.forEach((item: any) => {
    const parent = map[item.__parent];
    if (!parent) {
      tree.push(map[item.__key]);
    }
  });

  return tree;
}

function getTopNode(node) {
  let target = node;
  while (!(target.getParent() instanceof ParagraphNode)) {
    target = target.getParent();
  }
  return target
}
export function $insertWrapNode(parentNode: ElementNode) {
  if (!parentNode) {
    return;
  }

  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.extract();
  const wrap = hasWrapNode(nodes);
  if (!wrap) {
    const wrapNode = $createWrapNode();
    parentNode.append(wrapNode);

    const firstNode = getTopNode(nodes[0]);
    firstNode.insertBefore(parentNode);

    if (nodes.length > 0) {
      const state = arrayToTree(nodes);
      state.forEach((node: any) => {
        if (wrapNode != null) {
          const nodeClone = $getNodeByKey(node.__key);
          if (nodeClone != null) {
            wrapNode.append(nodeClone);
          }
        }
      });
    }
  }
}

export function $isWrapNode(node: LexicalNode | null): node is WrapNode {
  return node instanceof WrapNode;
}
