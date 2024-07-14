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

function hasSampleNode(nodes: any): boolean {
  for (const node in nodes) {
    if ($isSampleNode(node)) {
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
export function $insertSampleNode() {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.extract();
  const wrap = hasSampleNode(nodes);
  if (!wrap) {
    const sampleNode = $createSampleNode();
    const firstNode = getTopNode(nodes[0]);
    firstNode.insertBefore(sampleNode);

    if (nodes.length > 0) {
      const state = arrayToTree(nodes);
      state.forEach((node: any) => {
        if (sampleNode != null) {
          const nodeClone = $getNodeByKey(node.__key);
          if (nodeClone != null) {
            sampleNode.append(nodeClone);
          }
        }
      });
    }
  }
}


// 删除局部变速
export function $removeSample(key: string) {
  const sampleNode = $getNodeByKey(key);
  if ($isSampleNode(sampleNode)) {
    const nodes = (sampleNode as SampleNode).getChildren();
    if(nodes.length > 0) {
      for (let i = 0; i < nodes.length; i++) {
        sampleNode.insertBefore(nodes[i]);
      }
      sampleNode.remove();
    }
  }
}

export function $isSampleNode(node: LexicalNode | null): node is SampleNode {
  return node instanceof SampleNode;
}
