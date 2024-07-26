import {
  $applyNodeReplacement,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  ElementNode,
  LexicalNode,
  SerializedElementNode,
  Spread,
} from "lexical";
import { $createSpeedNode, $isSpeedNode, SpeedNode } from "./speedNode";
import { $createVoiceNode, $isVoiceNode, VoiceNode } from "./voiceNode";
import { $isPinyinNode } from "./pinyinNode";
import { $isSymbolNode } from "./symbolNode";
import { $getElementWrap, $getTextWrap } from "@/lib/lexical";

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



// 获取包裹节点的所有子节点
export function $getWrapChildren(node: SpeedNode | VoiceNode) {
  const wrap = node.getChildren();
  const nodes = wrap[0].getChildren();
  return nodes;
}

// 创建变速包裹组件
function $createSpeedWrapNode(speed: number) {
  const speedNode = $createSpeedNode(speed);
  const wrapNode = $createWrapNode();
  speedNode.append(wrapNode);
  return { speedNode, wrapNode };
}

// 创建配音包裹组件
function $createVoiceWrapNode(parentVoiceNode: VoiceNode) {
  const voiceNode = $createVoiceNode(
    parentVoiceNode.getName(),
    parentVoiceNode.getVoice(),
    parentVoiceNode.getStyle(),
    parentVoiceNode.getStyleName(),
    parentVoiceNode.getRate(),
    parentVoiceNode.getVolume(),
    parentVoiceNode.getPitch()
  );
  const wrapNode = $createWrapNode();
  voiceNode.append(wrapNode);
  return { voiceNode, wrapNode };
}

function $insertSpeedNode(nodes: any[]) {
  let wrapNode: any = null;
  let prevParent: any = null; // 上一次的element节点

  nodes.forEach((node) => {
    const element = $getTextWrap(node);
    const parent = $getElementWrap(element);

    if (!parent) {
      return;
    }

    // 开始创建包裹节点
    if (wrapNode == null) {
      const { speedNode, wrapNode: speedWrapNode } = $createSpeedWrapNode(
        (parent as SpeedNode).getSpeed()
      );
      prevParent = parent;
      wrapNode = speedWrapNode;
      parent.insertBefore(speedNode);
    }

    if (!$isSpeedNode(node)) {
      if (prevParent.is(parent)) {
        wrapNode.append(node);
      }
    } else {
      parent.insertBefore(node);
      wrapNode = null;
    }
  });

  if (prevParent) {
    prevParent.remove();
  }
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

  let insertType = ""; // 选择的是混合类型还是纯文本类型
  let ancestorWrapNode: any = null;
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (insertType === "" && ($isSpeedNode(node) || $isVoiceNode(node))) {
      insertType = "mixed";
    }

    const element = $getTextWrap(node);
    const parent = $getElementWrap(element);

    if (ancestorWrapNode === null || $isSpeedNode(element)) {
      ancestorWrapNode = parent;
    }
  }

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

  if (parentType === "speedNode") {
    // for (let index = 0; index < nodes.length; index++) {
    //   const node = nodes[index];
    //   if (node.getType() === "voiceNode") {
    //     message.error("变速不能和主播重叠！");
    //     return;
    //   }
    // }
    const parentSpeed = (parentNode as SpeedNode).getSpeed();
    const { speedNode, wrapNode } = $createSpeedWrapNode(parentSpeed);
    let prevParent: any = null;
    nodes.forEach((node, i) => {
      const element = $getTextWrap(node);
      const parent = element;
      if (i === 0) {
        parent.insertBefore(speedNode);
      }
      if ($isTextNode(node)) {
        wrapNode.append(parent);
      } else if ($isSpeedNode(node)) {
        prevParent = node;
      } else {
        wrapNode.append(node);
      }

      if (prevParent) {
        const parentNode = $getWrapChildren(prevParent);
        if (parentNode.length === 0) {
          prevParent.remove();
        }
      }
    });
    const ancestor = $getElementWrap(speedNode);
    if (ancestor) {
      const childrenNodes = $getWrapChildren(ancestor);
      $insertSpeedNode(childrenNodes);
    }
  } else if (parentType === "voiceNode") {
    const { voiceNode, wrapNode } = $createVoiceWrapNode(parentNode as VoiceNode);

    if (insertType === "" && $isSpeedNode(ancestorWrapNode)) {
      // 插入主播
      const parentSpeed = ancestorWrapNode.getSpeed();
      const { speedNode, wrapNode: speedWrapNode } = $createSpeedWrapNode(parentSpeed);
      if (speedNode) {
        wrapNode.append(speedNode);
      }

      nodes.forEach((node, i) => {
        const element = $getTextWrap(node);
        const wrap = $getElementWrap(element);
        const parent = element;
        if (i === 0) {
          parent.insertBefore(voiceNode);
        }

        if ($isTextNode(node)) {
          speedWrapNode.append(element);
        }
      });

      const childrenNodes = $getWrapChildren(ancestorWrapNode);

      // 重新包裹计算
      let prevSpeedWrap: any = null;
      childrenNodes.forEach((node) => {
        const element = $getTextWrap(node);
        const wrap = $getElementWrap(element);
        const parent = element;

        if($isVoiceNode(node)) {
          ancestorWrapNode.insertBefore(node);
          prevSpeedWrap = null;
        }else {
          if(prevSpeedWrap == null) {
            const {speedNode, wrapNode} = $createSpeedWrapNode(parentSpeed);
            ancestorWrapNode.insertBefore(speedNode);
            prevSpeedWrap = wrapNode
          }
          prevSpeedWrap.append(node);
        }
       
      });

      ancestorWrapNode.remove();

      return;
    }

    let prevSpeedNode: SpeedNode | null = null;
    let prevSpeedWrap: any = null;
    nodes.forEach((node, i) => {
      const element = $getTextWrap(node);
      const wrap = $getElementWrap(element);

      const parent = element;
      if (i === 0) {
        parent.insertBefore(voiceNode);
      }

      if (prevSpeedNode && prevSpeedWrap === null) {
        const parentSpeed = prevSpeedNode.getSpeed();
        const { speedNode, wrapNode: speedWrapNode } = $createSpeedWrapNode(parentSpeed);
        prevSpeedNode.insertBefore(speedNode);
        prevSpeedWrap = speedWrapNode;
      }

      if ($isTextNode(node)) {
        if ($isSpeedNode(wrap)) {
          const wrap = $getElementWrap(element);
          prevSpeedWrap.append(parent);

          const newWrap = $getElementWrap(node);
          wrapNode.append(newWrap);
        } else {
          wrapNode.append(parent);
        }
      } else if ($isSpeedNode(node)) {
        prevSpeedWrap = null;
        prevSpeedNode = node;
      }

      if (prevSpeedNode) {
        const parentNode = $getWrapChildren(prevSpeedNode);
        if (parentNode.length === 0) {
          prevSpeedNode.remove();
        }
      }
    });
  }
}

export function $isWrapNode(node: LexicalNode | null): node is WrapNode {
  return node instanceof WrapNode;
}
