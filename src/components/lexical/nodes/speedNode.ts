import {
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  BaseSelection,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import { Dispatch } from "react";
import { setInitialState } from "@/redux/slice/initialState";
import { SpeedPopupPayload } from "../typings/speed";
import { $insertWrapNode, WrapNode } from "./wrapNode";
import { useTagDom } from "../ui/tag";
import { selectNode } from "../utils/selection";
import { OPEN_SPEED_POPUP_COMMAND, REMOVE_SPEED_COMMAND } from "../plugins/speedPlugin";

export type SerializedSpeedNode = Spread<
  {
    speed: number;
  },
  SerializedElementNode
>;

export class SpeedNode extends ElementNode {
  __speed: number;

  static getType(): string {
    return "speedNode";
  }

  static clone(node: SpeedNode): SpeedNode {
    return new SpeedNode(node.__speed, node.__key);
  }

  constructor(speed: number, key?: NodeKey) {
    super(key);
    this.__speed = speed;
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    // Define the DOM element here
    const key = this.getKey();
    const speed = this.getSpeed();
    const element = document.createElement("span");

    const tag = useTagDom({
      tagClassName: "speed-tag",
      textClassName: "speed-tag-text",
      tagText: `语速${speed}`,
      onTagClick: () => {
        selectNode(element);
        editor.dispatchCommand(OPEN_SPEED_POPUP_COMMAND, {
          key,
          speed: speed.toString()
        });
      },
      onClose: () => {
        editor.dispatchCommand(REMOVE_SPEED_COMMAND, key)
      }
    });
    element.appendChild(tag);
    addClassNamesToElement(element, config.theme.speed);
    return element;
  }

  updateDOM(prevNode: SpeedNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return true;
  }

  static importJSON(serializedNode: SerializedSpeedNode): SpeedNode {
    const node = $createSpeedNode(serializedNode.speed);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedSpeedNode {
    return {
      ...super.exportJSON(),
      type: this.getType(),
      speed: this.__speed,
      version: 1
    };
  }

  setSpeed(speed: number): void {
    const self = this.getWritable();
    self.__speed = speed;
  }

  getSpeed(): number {
    const self = this.getLatest();
    return self.__speed;
  }

  insertNewAfter(_: RangeSelection, restoreSelection = true): null | ElementNode {
    const speedNode = $createSpeedNode(this.__speed);
    this.insertAfter(speedNode, restoreSelection);
    return speedNode;
  }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): false {
    return false;
  }

  canBeEmpty(): false {
    return false;
  }

  isInline(): true {
    return true;
  }

  // extractWithChild(
  //   child: LexicalNode,
  //   selection: BaseSelection,
  //   destination: "clone" | "html"
  // ): boolean {
  //   if (!$isRangeSelection(selection)) {
  //     return false;
  //   }

  //   const anchorNode = selection.anchor.getNode();
  //   const focusNode = selection.focus.getNode();

  //   return (
  //     this.isParentOf(anchorNode) &&
  //     this.isParentOf(focusNode) &&
  //     selection.getTextContent().length > 0
  //   );
  // }
}

export function $createSpeedNode(speed: number): SpeedNode {
  return $applyNodeReplacement(new SpeedNode(speed));
}

export function $insertSpeed(speed: string) {
  const speedNode = $createSpeedNode(Number(speed));
  $insertWrapNode(speedNode);
}

// 删除局部变速
export function $removeSpeed(key: string) {
  const speedNode = $getNodeByKey(key);
  if ($isSpeedNode(speedNode)) {
    const nodes = (speedNode as SpeedNode).getChildren();
    if(nodes.length > 0) {
      const parent = nodes[0];
      const wrapNodes = (parent as WrapNode)?.getChildren();
      for (let i = 0; i < wrapNodes.length; i++) {
        speedNode.insertBefore(wrapNodes[i]);
      }
      speedNode.remove();
    }
  }
}

export function $openSpeedPopup(dispatch: Dispatch<any>, payload: SpeedPopupPayload = { speed: '0', key: ""}): void {
  // 新增编辑逻辑合并，打开拼音选择弹窗
  const { speed, key } = payload;
  dispatch(setInitialState({ type: "speed", selectionText: "", nodeKey: key, value: speed }));
}

/**
 * Determines if node is a LinkNode.
 * @param node - The node to be checked.
 * @returns true if node is a LinkNode, false otherwise.
 */
export function $isSpeedNode(node: LexicalNode | null | undefined): node is SpeedNode {
  return node instanceof SpeedNode;
}

export function $getSpeedAncestor(
  node: LexicalNode,
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !$isSpeedNode(parent)) {
    parent = parent.getParentOrThrow();
  }
  return $isSpeedNode(parent) ? parent : null;
}