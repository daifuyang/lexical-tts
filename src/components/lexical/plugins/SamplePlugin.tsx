// 多音字标注插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalNode,
  ParagraphNode,
  TextNode
} from "lexical";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";
import { useAppDispatch } from "@/redux/hook";
import { SpeedPopupPayload } from "../typings/speed";
import { $getNodeByKey } from "lexical";
import { SampleNode, $isSampleNode } from "../nodes/sampleNode";
import { setPlayingNodeKey } from "@/redux/slice/lexicalState";
import { $isSpeedNode } from "../nodes/speedNode";
import { $isPinyinNode } from "../nodes/pinyinNode";

export const PLAY_SAMPLE_COMMAND: LexicalCommand<undefined> = createCommand("PLAY_SAMPLE_COMMAND");
export const INSERT_SAMPLE_COMMAND: LexicalCommand<string> = createCommand("INSERT_SAMPLE_COMMAND");
export const UPDATE_SAMPLE_COMMAND: LexicalCommand<SpeedPopupPayload | undefined> =
  createCommand("UPDATE_SAMPLE_COMMAND");
export const REMOVE_SAMPLE_COMMAND: LexicalCommand<string | undefined> =
  createCommand("REMOVE_SAMPLE_COMMAND");

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

export function $setStyle(node: any, style = '') {
    // 如果node是文本
    if($isTextNode(node)) {
      node.setStyle(style);
    }else {
      const textNodes = node.getAllTextNodes()
      textNodes.forEach( (textNode: TextNode) => {
        textNode.setStyle(style);
      } )
    }
}

function $next(node: LexicalNode) {
  // 判断当前node的类型
  let parent = null;
  if ((parent = $getAncestor(node as LexicalNode, $isSpeedNode))) {
    console.log("speedNode", parent);
    node = parent;
  } else if ((parent = $getAncestor(node as LexicalNode, $isPinyinNode))) {
    console.log("parentNode", parent);
    node = parent;
  }

  let prev = node

  $setStyle(node,"color:green")
}

export default function SamplePlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!editor.hasNodes([SampleNode])) {
      throw new Error("samplePlugin: sampleNode not registered on editor (initialConfig.nodes)");
    }
  }, [editor]);

  return null;
}
