import {
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
  DOMExportOutput,
  $applyNodeReplacement,
  ElementNode,
  SerializedElementNode,
  $getSelection,
  $isRangeSelection,
  $isElementNode
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";

import * as React from "react";

export type SerializedPinyinNode = Spread<
  {
    pinyin: string;
  },
  SerializedElementNode
>;

export class PinyinNode extends ElementNode {
  __pinyin: string;

  constructor(pinyin: string, key?: NodeKey) {
    super(key);
    this.__pinyin = pinyin;
  }

  static getType(): string {
    return "pinyin";
  }

  static clone(node: PinyinNode): PinyinNode {
    return new PinyinNode(node.__pinyin, node.__key);
  }

  static importJSON(serializedNode: SerializedPinyinNode): PinyinNode {
    const node = $createPinyinNode(serializedNode.pinyin);
    return node;
  }

  exportJSON(): SerializedPinyinNode {
    return {
      ...super.exportJSON(),
      pinyin: this.__pinyin,
      type: this.getType(),
      version: 1
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement("span");
    addClassNamesToElement(element, config.theme.pinyin);
    const pinSpan = document.createElement("span");
    pinSpan.classList.add("editor-pinyin-tag");
    pinSpan.contentEditable = "false";
    pinSpan.textContent = this.__pinyin;
    element.appendChild(pinSpan);
    console.log("createDOM",element);
    return element;
  }

  updateDOM(): false {
    console.log("updateDOM");
    return false;
  }

  // decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
  //   return (
  //     <>
  //       <span>xing</span>
  //       <span>{this.__pinyin}</span>
  //     </>
  //   );
  // }
}

export function $createPinyinNode(pinyin: string): PinyinNode {
  console.log("pinyin", pinyin);
  return $applyNodeReplacement(new PinyinNode(pinyin));
}

export function $isPinyinNode(
  node: PinyinNode | LexicalNode | null | undefined
): node is PinyinNode {
  return node instanceof PinyinNode;
}

export function togglePinYin(pinyin: string): void {
  console.log("togglePinYin", pinyin);
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }

  const nodes = selection.extract();

  if (pinyin === null) {
    // 删除
    nodes.forEach((node) => {
      const parent = node.getParent();

      if ($isPinyinNode(parent)) {
        const children = parent.getChildren();

        for (let i = 0; i < children.length; i++) {
          parent.insertBefore(children[i]);
        }

        parent.remove();
      }
    });
  } else {
    // 添加

    if (nodes.length === 1) {
      const firstNode = nodes[0];
      const pinyinNode = $getAncestor(firstNode, $isPinyinNode);
      if (pinyinNode !== null) {
        console.log("pinyinNode", pinyinNode);
        return;
      }
    }

    let prevParent: ElementNode | PinyinNode | null = null;
    let pinyinNode: PinyinNode | null = null;

    nodes.forEach((node) => {
      const parent = node.getParent();

      if (parent === pinyinNode || parent === null || ($isElementNode(node) && !node.isInline())) {
        return;
      }

      if ($isPinyinNode(parent)) {
        pinyinNode = parent;
        return;
      }

      if (!parent.is(prevParent)) {
        prevParent = parent;
        pinyinNode = $createPinyinNode(pinyin);

        if ($isPinyinNode(parent)) {
          if (node.getPreviousSibling() === null) {
            parent.insertBefore(pinyinNode);
          } else {
            parent.insertAfter(pinyinNode);
          }
        } else {
          node.insertBefore(pinyinNode);
        }
      }

      if ($isPinyinNode(node)) {
        if (node.is(pinyinNode)) {
          return;
        }
        if (pinyinNode !== null) {
          const children = node.getChildren();

          for (let i = 0; i < children.length; i++) {
            pinyinNode.append(children[i]);
          }
        }

        node.remove();
        return;
      }

      if (pinyinNode !== null) {
        pinyinNode.append(node);
      }
    });
  }
}

function $getAncestor<NodeType extends LexicalNode = LexicalNode>(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => ancestor is NodeType
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
    parent = parent.getParentOrThrow();
  }
  return predicate(parent) ? parent : null;
}
