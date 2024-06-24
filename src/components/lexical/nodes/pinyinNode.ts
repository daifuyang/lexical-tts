import { addClassNamesToElement } from "@lexical/utils";
import {
  ElementNode,
  $applyNodeReplacement,
  LexicalNode,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  EditorConfig
} from "lexical";

export class PinyinNode extends ElementNode {
  static getType(): string {
    return "pinyinNode";
  }

  static clone(node: PinyinNode): PinyinNode {
    return new PinyinNode(node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    // Define the DOM element here
    const element = document.createElement("span");
    element.contentEditable = "false";
    element.dataset.pinyin = `[xing]`;
    addClassNamesToElement(element, config.theme.pinyin);
    return element;
  }

  updateDOM(prevNode: PinyinNode, dom: HTMLElement): boolean {
    console.log("prevNode", prevNode, dom);
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
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

export function $createPinyinNode(): PinyinNode {
  return $applyNodeReplacement(new PinyinNode());
}

export function $insertPinyin() {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.extract();
  // Remove PinyinNodes
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
      pinyinNode = $createPinyinNode();

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

export function $isPinyinNode(node: LexicalNode | null | undefined): node is PinyinNode {
  return node instanceof PinyinNode;
}
