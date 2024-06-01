// 主播插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  ElementNode,
  LexicalCommand,
  createCommand
} from "lexical";

import { useEffect } from "react";
import { $createVoiceNode, $isVoiceNode, VoiceNode, $getAncestor } from "../nodes/VoiceNode";

interface Payload {
  data: {
    value: string;
    type: string;
  };
}

export const ADD_VOICE_COMMAND: LexicalCommand<Payload> = createCommand("ADD_VOICE_COMMAND");

export default function VoicePlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([VoiceNode])) {
      throw new Error("VoicePlugin: VoiceNode not registered on editor (initialConfig.nodes)");
    }
    return editor.registerCommand(
      ADD_VOICE_COMMAND,
      (payload: Payload) => {
        
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }

        const nodes = selection.extract();

        // 先删除旧的
        nodes.forEach((node) => {
          const parent = node.getParent();
          if ($isVoiceNode(parent)) {
            const children = parent.getChildren();
            for (let i = 0; i < children.length; i++) {
              parent.insertBefore(children[i]);
            }
            parent.remove();
          }
        });

        if (nodes.length === 1) {
          const firstNode = nodes[0];
          // 如果第一个节点是voice或者父节点是voice,那我们就更新他
          const voiceNode = $getAncestor(firstNode, $isVoiceNode);
          if (voiceNode) {
            console.log("存在voiceNode", voiceNode);
            return;
          }
        }

        let prevParent: ElementNode | VoiceNode | null = null;
        let voiceNode: VoiceNode | null = null;

        nodes.forEach((node) => {
          const parent = node.getParent();
          if (
            parent === VoiceNode ||
            parent === null ||
            ($isElementNode(node) && !node.isInline())
          ) {
            return;
          }

          if ($isVoiceNode(parent)) {
            // 修改父元素
            voiceNode = parent;
            return;
          }

          if (!parent.is(prevParent)) {
            prevParent = parent;
            voiceNode = $createVoiceNode();

            if ($isVoiceNode(parent)) {
              if (node.getPreviousSibling() === null) {
                parent.insertBefore(voiceNode);
              } else {
                parent.insertAfter(voiceNode);
              }
            } else {
              node.insertBefore(voiceNode);
            }
          }

          if ($isVoiceNode(node)) {
            if (node.is(voiceNode)) {
              return;
            }
            if (voiceNode !== null) {
              const children = node.getChildren();
              for (let i = 0; i < children.length; i++) {
                voiceNode.append(children[i]);
              }
            }
            node.remove();
            return;
          }

          if (voiceNode !== null) {
            voiceNode.append(node);
          }
        });
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
