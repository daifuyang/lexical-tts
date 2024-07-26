import { $isPinyinNode } from "@/components/lexical/nodes/pinyinNode";
import { $isSymbolNode } from "@/components/lexical/nodes/symbolNode";
import { $isWrapNode } from "@/components/lexical/nodes/wrapNode";
import { LexicalNode } from "lexical";


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

// 获取拼音，数字包裹节点
export function $getTextWrap(node: LexicalNode) {
  let parent = node.getParent();
  if ($isPinyinNode(parent) || $isSymbolNode(parent)) {
    return parent;
  }

  return node;
}

// 获取父亲节点
export function $getElementWrap(node: LexicalNode) {
  let parent: any = node.getParent();
  if ($isWrapNode(parent)) {
    return parent.getParent();
  } else {
    return null;
  }
}