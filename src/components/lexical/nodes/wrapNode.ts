import {
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  ElementNode,
  LexicalNode,
  ParagraphNode,
  SerializedElementNode,
  Spread,
  TextNode
} from "lexical";
import { $createSpeedNode, $isSpeedNode, SpeedNode } from "./speedNode";
import { $createVoiceNode, $isVoiceNode, VoiceNode } from "./voiceNode";
import { $isPinyinNode } from "./pinyinNode";
import { $isSymbolNode } from "./symbolNode";
import { message } from "antd";

export type SerializedWrapNode = Spread<{}, SerializedElementNode>;

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

function $getTopNode<NodeType extends LexicalNode = LexicalNode>(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => ancestor is NodeType
) {
  let parent: any = node;
  while (parent !== null && parent.getParent() !== null && !predicate(parent.getParent())) {
    parent = parent.getParentOrThrow();
  }

  return parent;
}

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

// childItem.ancestor.getSpeed()
let speedWrapNpde: WrapNode | null = null;
function createVoiceSpeedNode(wrapNode: WrapNode, childItem: any, item: any) {
  const { ancestor } = childItem;
  const { node, parent } = item;

  if (speedWrapNpde === null) {
    const speedNode = $createSpeedNode(ancestor.getSpeed());
    wrapNode.append(speedNode);
    speedWrapNpde = $createWrapNode();
    speedNode.append(speedWrapNpde);
  }

  if ($isSpeedNode(ancestor)) {
    if ($isWrapNode(parent)) {
      speedWrapNpde.append(node);
    } else {
      speedWrapNpde.append(parent);
      // wrapNode.append(parent);
    }
  }

  return speedWrapNpde;
}

// 获取node的包裹节点
function getNodeWrap(node: LexicalNode) {
  let parent = node.getParent();
  if ($isWrapNode(parent)) {
    parent = parent.getParent();
  }

  if ($isSpeedNode(parent) || $isVoiceNode(parent)) {
    return parent;
  }

  return node;
}

// 获取拼音，数字包裹节点
function getTextWrap(node: LexicalNode) {
  let parent = node.getParent();
  if ($isPinyinNode(parent) || $isSymbolNode(parent)) {
    return parent;
  }

  return node;
}

export function $insertWrapNode(parentNode: ElementNode) {
  const parentType = parentNode.getType();
  if (!parentNode) {
    return;
  }

  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }

  if (!selection) {
    return;
  }

  const nodes = selection.extract();

// 如果插入多人配音
/* 
1. 插入的内容包含纯文本或者多音字，数字，则直接插入到配音节点
2. 插入的内容包含变速的，如果文本不属于变速子节点则直接插入，否则需要拆分变速节点为多节点
3. 插入的内容包含其他配音的，则需要拆分配音，配音包含变速的，则需要拆除变速（逻辑复杂）
*/

// 如果插入局部变速
/* 
1、插入的内容包含纯文本或者多音字，数字，则直接插入到变速节点
2.插入的内容包含变速的， 如果文本不属于变速子节点，则直接插入，否则需要拆分合并变速节点
3.插入的内容包含纯文本或者主播，文本插入变速，主播节点插入变速容器，（逻辑复杂）
*/
  

/*   const textNodes: any = [];
  const textMap: any = {};

  let ancestorWrap: any = null; // 根节点包裹类型
  let ancestorWrapType: any = null; // 根节点包裹类型

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (node.getType() === "voiceNode") {
      message.error("主播不能包裹使用，请手动调整位置！");
      return;
    }
  }
 */

/*   if(parentType === "voiceNode") {
      // 获得所有的选取节点
  let wrapNode: any = null;
  nodes.forEach((node: any, i) => {
    if ($isTextNode(node)) {
      const parent = getTextWrap(node);
      if (i === 0) {
        wrapNode1 = $createWrapNode();
        parentNode.append(wrapNode);
        parent.insertBefore(parentNode);
      }
      wrapNode.append(parent);
    }
  });

  }

  return; */

  /* nodes.forEach((node) => {
    if ($isTextNode(node)) {
      const parent = node.getParent();
      const isRoot = $isParagraphNode(parent) ? true : false;
      const ancestor = $getTopNode(node, $isParagraphNode);

      if (ancestorWrapType === null) {
        ancestorWrap = parentNode;
        ancestorWrapType = parentType;
      }

      if (ancestor === ancestorWrapType) {
        ancestorWrap = parentNode;
        ancestorWrapType = "mixed";
      }

      let ancestorType = null;
      if (!$isVoiceNode(ancestor) && !$isSpeedNode(ancestor)) {
        ancestorWrap = parentNode;
        ancestorWrapType = parentType;
      } else {
        ancestorWrap = ancestor;
        ancestorWrapType = ancestor.getType();
      }

      const obj = {
        node,
        parent,
        ancestor,
        isRoot,
        ancestorType
      };

      const key = node.getKey();
      textMap[key] = obj;
      textNodes.push(obj);
    }
  });

  // 如果是变速内部创建

  console.log("ancestorWrapType", ancestorWrapType, ancestorWrap);

  if (ancestorWrapType === "speedNode") {
    const speedNode = $createSpeedNode((parentNode as SpeedNode).getSpeed());
    const speedWrapNode: any = $createWrapNode();
    speedNode.append(speedWrapNode);

    // 如果下面没有变速组件
    if (ancestorWrap === parentNode) {
      nodes.forEach((node, i) => {
        if (i === 0) {
          const target = getTextWrap(node);
          target.insertBefore(speedNode);
        }

        if ($isTextNode(node)) {
          const parent = node.getParent();
          if ($isPinyinNode(parent)) {
            speedWrapNode.append(parent);
          } else {
            speedWrapNode.append(node);
          }
        }
      });
      return;
    }

    let first = false;
    nodes.forEach((node) => {
      const parent = node.getParent();
      if ($isTextNode(node) && $isWrapNode(parent)) {
        if (!first) {
          first = true;
          node.insertBefore(speedNode);
        }
        speedWrapNode.append(node);
      } else if ($isPinyinNode(node) || $isSymbolNode(node)) {
        if (!first) {
          first = true;
          node.insertBefore(speedNode);
        }
        speedWrapNode.append(node);
      }
    });

    const ancestorNodes = ancestorWrap.getChildren()[0].getChildren();
    let ancestorWrapNode: any = null;

    let speedNodes: any = [];
    ancestorNodes.forEach((item) => {
      if ($isSpeedNode(item)) {
        speedNodes.push(item);
        ancestorWrapNode = null;
      } else if (ancestorWrapNode == null) {
        const speedNode = $createSpeedNode((ancestorWrap as SpeedNode).getSpeed());
        speedNodes.push(speedNode);
        ancestorWrapNode = $createWrapNode();
        speedNode.append(ancestorWrapNode);
        item.insertBefore(speedNode);
        ancestorWrapNode.append(item);
      } else {
        ancestorWrapNode.append(item);
      }
    });

    speedNodes.forEach((item) => {
      ancestorWrap.insertBefore(item);
    });
    ancestorWrap.remove();
    return;
  } else if (ancestorWrap === "voiceNode") {
    const parentVoiceNode = parentNode as VoiceNode;
    const voiceNode = $createVoiceNode(
      parentVoiceNode.getName(),
      parentVoiceNode.getVoice(),
      parentVoiceNode.getStyle(),
      parentVoiceNode.getStyleName(),
      parentVoiceNode.getRate(),
      parentVoiceNode.getVolume(),
      parentVoiceNode.getPitch()
    );

    const voiceWrapNode: any = $createWrapNode();
    voiceNode.append(voiceWrapNode);

    let speedParent = null;
    nodes.forEach((node, i) => {
      const parent = node.getParent();
      if ($isSpeedNode(parent)) {
        speedParent;
      }

      if (i === 0) {
        node.insertBefore(voiceNode);
      }

      if (!$isSpeedNode(node) && !$isWrapNode(node)) {
        const wrap = getNodeWrap(node);
        if ($isSpeedNode(wrap)) {
          const speedNode = $createSpeedNode(wrap.getSpeed());
          const speedWrapNode = $createWrapNode();
          speedNode.append(speedWrapNode);
          speedWrapNode.append(node);
          voiceWrapNode.append(speedNode);
        } else {
          voiceWrapNode.append(node);
        }
      }
    });

    return;
  }

  let wrapNode: WrapNode | null = null; // 包裹的节点
  textNodes.forEach((item: any, i: number) => {
    const isEnd = i === textNodes.length - 1;

    const { ancestor, parent, node, ancestorType } = item;

    // console.log("item", item);

    // 获取当前节点是否需要闭合

    if (parentType !== ancestorType) {
      wrapNode = null;
    }

    if (wrapNode == null) {
      // 插入到变速
      if ($isSpeedNode(parentNode)) {
        const speedNode = $createSpeedNode((parentNode as SpeedNode).getSpeed());
        wrapNode = $createWrapNode();
        speedNode.append(wrapNode);
        ancestor.insertBefore(speedNode);
        node.insertBefore(speedNode);
      } else if ($isVoiceNode(parentNode)) {
        const parentVoiceNode = parentNode as VoiceNode;
        const voiceNode = $createVoiceNode(
          parentVoiceNode.getName(),
          parentVoiceNode.getVoice(),
          parentVoiceNode.getStyle(),
          parentVoiceNode.getStyleName(),
          parentVoiceNode.getRate(),
          parentVoiceNode.getVolume(),
          parentVoiceNode.getPitch()
        );
        wrapNode = $createWrapNode();
        voiceNode.append(wrapNode);
        ancestor.insertBefore(voiceNode);
      } else {
        return;
      }
    }

    if (!$isSpeedNode(ancestor) && !$isVoiceNode(ancestor)) {
      wrapNode.append(ancestor);
    } else {
      // 如果和上一节点是同一个父亲
      const key = node.getKey();
      const childItem = textMap[key];
      if (parentType === "voiceNode") {
        console.log("插入主播", wrapNode, childItem, item);
        createVoiceSpeedNode(wrapNode, childItem, item);
        if (isEnd && ancestor.getAllTextNodes().length === 0) {
          ancestor.remove();
        }
      } else {
        if ($isSpeedNode(childItem.ancestor)) {
          if ($isWrapNode(childItem.parent)) {
            wrapNode.append(node);
          } else {
            wrapNode.append(childItem.parent);
          }
        }
      }
    }
  }); */
}

export function $isWrapNode(node: LexicalNode | null): node is WrapNode {
  return node instanceof WrapNode;
}
