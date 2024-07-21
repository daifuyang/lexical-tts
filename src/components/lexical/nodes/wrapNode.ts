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

  if( speedWrapNpde === null ) {
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

  const textNodes: any = [];
  const textMap: any = {};

  let ancestorWrap: any = null // 根节点包裹类型

  nodes.forEach((node) => {
    if ($isTextNode(node)) {
      const parent = node.getParent();
      const isRoot = $isParagraphNode(parent) ? true : false;
      const ancestor = $getTopNode(node, $isParagraphNode);

      if(ancestorWrap === null) {
        ancestorWrap = ancestor
      }

      if(ancestorWrap !== ancestor) {
        ancestorWrap = "mixed"
      }
      
      let ancestorType = null;
      if (!$isVoiceNode(ancestor) && !$isSpeedNode(ancestor)) {
        ancestorType = parentType;
      } else {
        ancestorType = ancestor.getType();
      }

      const obj = {
        node,
        parent,
        ancestor,
        isRoot,
        ancestorType,
      };

      const key = node.getKey();
      textMap[key] = obj;
      textNodes.push(obj);
    }
  });

  // 如果是变速内部创建
  let ancestorChildren = [] 
  if($isSpeedNode(ancestorWrap)) {
    
    let wrapNodes = [[],[],[]];
    let cursorKey = null;

    // todo 完成同级别插入

    ancestorChildren = ancestorWrap.getChildren()[0].getChildren();
    console.log('ancestorChildren', ancestorChildren , nodes);
    return
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

        console.log('node', node)

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
        createVoiceSpeedNode(wrapNode, childItem, item);
        if(isEnd && ancestor.getAllTextNodes().length === 0) {
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
  });
}

export function $isWrapNode(node: LexicalNode | null): node is WrapNode {
  return node instanceof WrapNode;
}
