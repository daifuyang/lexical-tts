import { $isPinyinNode } from "@/components/lexical/nodes/pinyinNode";
import { $isSymbolNode } from "@/components/lexical/nodes/symbolNode";
import { $isWrapNode } from "@/components/lexical/nodes/wrapNode";
import { $getFirstText } from "@/components/lexical/utils/node";
import { calculateTextLength } from "@/components/lexical/utils/util";
import { createWork, updateWork } from "@/services/work";
import { message } from "antd";
import { LexicalEditor, LexicalNode } from "lexical";

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

// 保存项目
export async function saveWork(contents: [], id: string | null = "", data: any = {}) {
  const text = "测试"
  // 新增
  let res: any = null;
  if (id) {
    res = await updateWork(id, { ...data, title: text, contents });
  } else {
    res = await createWork({ ...data, title: text, contents });
  }
  return res;
}
