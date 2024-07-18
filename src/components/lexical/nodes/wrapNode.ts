import {
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  ElementNode,
  LexicalNode,
  ParagraphNode,
  SerializedElementNode,
  Spread
} from "lexical";
import { $wrapNodes } from "@lexical/selection";
import { $createSpeedNode, $getSpeedAncestor, $isSpeedNode, SpeedNode } from "./speedNode";
import { getNodes } from "../utils/node";
import { $createVoiceNode, VoiceNode } from "./voiceNode";

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

function arrayToTree(array: any, hasChildren = false) {
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
    } else if (hasChildren) {
      parent.children.push(map[item.__key]);
    }
  });

  return tree;
}

function getTopNode(node) {
  let target = node;
  while (!(target.getParent() instanceof ParagraphNode)) {
    target = target.getParent();
  }
  return target;
}
export function $insertWrapNode(parentNode: ElementNode) {
  if (!parentNode) {
    return;
  }
  const nodeType = parentNode.getType();
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }

  if (!selection) {
    return;
  }

  const nodes = selection.extract();
  // 插入主播
  if (nodeType === "voice") {
    let wrapType = "normal";

    let parent: any;
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      parent = node.getParent();
      if ($isSpeedNode(parent)) {
        wrapType = "wrap";
        break;
      } else if ($isSpeedNode(node)) {
        wrapType = "mix";
        break;
      }
    }
    const selectionNodes = arrayToTree(nodes, true);
    if (wrapType === "mix") {
      const wrapNode = $createWrapNode();
      parentNode.append(wrapNode);
      const firstNode = nodes[0];
      firstNode.insertBefore(parentNode);
      selectionNodes.map((node: any) => {
        const nodeClone = $getNodeByKey(node.__key);
        // 如果是文本，则直接添加到主播节点下
        if ($isTextNode(nodeClone)) {
          wrapNode.append(nodeClone);
        } else if ($isSpeedNode(nodeClone)) {
          // 如果是变速组件
          const allSpeedChildren = node.children[0].children;
          const speedNode = $createSpeedNode(Number(nodeClone.getSpeed()));
          const speedWrapNode = $createWrapNode();
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
          speedNode.append(speedWrapNode);
          const voiceWrapNode = $createWrapNode();
          voiceWrapNode.append(speedNode);
          voiceNode.append(voiceWrapNode);
          allSpeedChildren.forEach((child: any) => {
            const childNode = $getNodeByKey(child.__key);
            if (childNode) {
              speedWrapNode.append(childNode);
            }
          });
          nodeClone.insertBefore(voiceNode);
        }
      });
    } else if (wrapType === "wrap") {
      let parent: any = null;
      for (let index = 0; index < selectionNodes.length; index++) {
        const node = selectionNodes[index];
        const nodeClone = $getNodeByKey(node.__key);
        if (nodeClone && !parent) {
          parent = nodeClone.getParent();
          if ($isWrapNode(parent)) {
            parent = parent.getParent();
          }
        }
      }
      if ($isSpeedNode(parent)) {
        // 如果父亲是变速

        const speedNode = $getNodeByKey(parent.__key);

        const firstNode = selectionNodes[0];
        const lastNode = selectionNodes[selectionNodes.length - 1];

        const children = parent.getChildren()[0].getChildren();
        const trees = arrayToTree(children, false);

        const startKey = trees[0].__key;

        let cursor = "first";
        let splitNodes = [[], [], []];

        const firstKey = firstNode.__key;
        const lastKey = lastNode.__key;

        trees.forEach((item: any, i) => {
          const node = $getNodeByKey(item.__key);

          if (startKey !== firstKey && node) {
            if (cursor === "first") {
              splitNodes[0].push(node);
            } else if (cursor === "middle") {
              splitNodes[1].push(node);
            } else if (cursor === "end") {
              splitNodes[2].push(node);
            }
          }

          if (firstKey === item.__key) {
            cursor = "middle";
          } else if (lastKey === item.__key) {
            cursor = "end";
          }
        });
        const parentVoiceNode = parentNode as VoiceNode;
        if (splitNodes[0].length > 0) {
          const newSpeedNode = $createSpeedNode(Number(speedNode?.getSpeed()));
          const speedWrapNode = $createWrapNode();
          newSpeedNode.append(speedWrapNode);
          splitNodes[0].forEach((item: any) => {
            speedWrapNode.append(item);
          });
          speedNode?.insertBefore(newSpeedNode);
        }

        if (splitNodes[1].length > 0) {
          const newSpeedNode = $createSpeedNode(Number(speedNode?.getSpeed()));
          const speedWrapNode = $createWrapNode();
          newSpeedNode.append(speedWrapNode);
          const voiceNode = $createVoiceNode(
            parentVoiceNode.getName(),
            parentVoiceNode.getVoice(),
            parentVoiceNode.getStyle(),
            parentVoiceNode.getStyleName(),
            parentVoiceNode.getRate(),
            parentVoiceNode.getVolume(),
            parentVoiceNode.getPitch()
          );
          const voiceWrapNode = $createWrapNode();
          voiceWrapNode.append(newSpeedNode);
          voiceNode.append(voiceWrapNode);
          splitNodes[1].forEach((item: any) => {
            speedWrapNode.append(item);
          });
          speedNode?.insertBefore(voiceNode);
        }

        if (splitNodes[2].length > 0) {
          const newSpeedNode = $createSpeedNode(Number(speedNode?.getSpeed()));
          const speedWrapNode = $createWrapNode();
          newSpeedNode.append(speedWrapNode);
          splitNodes[2].forEach((item: any) => {
            speedWrapNode.append(item);
          });
          speedNode?.insertBefore(newSpeedNode);
        }
        speedNode.remove();
      }
    } else {
      const wrapNode = $createWrapNode();
      parentNode.append(wrapNode);
      const firstNode = getTopNode(nodes[0]);
      firstNode.insertBefore(parentNode);
      selectionNodes.map((node: any) => {
        const nodeClone = $getNodeByKey(node.__key);
        console.log("nodeClone", nodeClone);
        // 如果是文本，则直接添加到主播节点下
        if (nodeClone != null) {
          wrapNode.append(nodeClone);
        }
      });
    }

    return;

    // // 判断第一个选中的节点是什么类型
    if ($getSpeedAncestor(firstNode as SpeedNode)) {
      console.log("需要拆分，重新组装节点");
    } else {
      // 直接包裹
      console.log("直接包裹");
      const wrapNode = $createWrapNode();
      parentNode.append(wrapNode);
      firstNode.insertBefore(parentNode);
      const parents = arrayToTree(nodes);
      parents.forEach((node: any) => {
        if (wrapNode != null) {
          const nodeClone = $getNodeByKey(node.__key);
          if (nodeClone != null) {
            wrapNode.append(nodeClone);
          }
        }
      });
    }

    return;

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
}

export function $isWrapNode(node: LexicalNode | null): node is WrapNode {
  return node instanceof WrapNode;
}
