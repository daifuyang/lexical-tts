import { $isParagraphNode, $isRootNode, BaseSelection, LexicalNode } from "lexical";

export function selectNode(element: Element) {
  // 创建一个新的 Range 对象
  const range = document.createRange();
  range.selectNodeContents(element); // 设置 Range 为包含被点击的 span 的内容

  // 获取当前的 Selection 对象
  const selection = window.getSelection();
  selection?.removeAllRanges(); // 清除任何已有的选区
  selection?.addRange(range); // 添加新的选区
}

export function $getTopNodes(selection: BaseSelection) {
    const anchor = selection?.anchor;
    const focus = selection?.focus;
    const isBefore = anchor.isBefore(focus);
    const firstPoint = isBefore ? anchor : focus;
    const lastPoint = isBefore ? focus : anchor;
    let firstNode = firstPoint.getNode();
    let lastNode = lastPoint.getNode();
    const nodes = $getTopNodesBetween(firstNode,lastNode);
    return nodes
}

export function $getTopNodesBetween(currentNode: LexicalNode, targetNode: LexicalNode) {
  const isBefore = currentNode.isBefore(targetNode);
  const nodes = [];
  const visited = new Set();
  let node: LexicalNode | null = currentNode;
  while (true) {
    if (node === null) {
      break;
    }
    const key = node.__key;
    if (!visited.has(key)) {
      visited.add(key);
      nodes.push(node);
    }
    if (node === targetNode) {
      break;
    }

    const nextSibling: LexicalNode | null = isBefore
      ? node.getNextSibling()
      : node.getPreviousSibling();
    if (nextSibling !== null) {
      node = nextSibling;
      continue;
    }
    const parent: LexicalNode | null = node.getParentOrThrow();

    if (!visited.has(parent.__key)) {
      nodes.push(parent);
    }
    if (parent === targetNode) {
      break;
    }
    let parentSibling = null;
    let ancestor: LexicalNode | null = parent;
    do {
      if (ancestor === null) {
        return
      }
      parentSibling = isBefore ? ancestor.getNextSibling() : ancestor.getPreviousSibling();
      ancestor = ancestor.getParent();
      if (ancestor !== null) {
        if (parentSibling === null && !visited.has(ancestor.__key)) {
          nodes.push(ancestor);
        }
      } else {
        break;
      }
    } while (parentSibling === null);
    node = parentSibling;
  }
  if (!isBefore) {
    nodes.reverse();
  }
  return nodes;
}
