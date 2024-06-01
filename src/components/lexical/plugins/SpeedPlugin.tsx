// 多音字标注插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  ElementNode
} from "lexical";

import { useEffect } from "react";
import {
  $createSpeedNode,
  $isSpeedNode,
  SpeedNode,
  TOGGER_SPEED_COMMAND
} from "../nodes/SpeedNode";
import { message } from "antd";

interface Payload {
  data: string | number;
}

export default function SpeedPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([SpeedNode])) {
      throw new Error("SpeedPlugin: SpeedNode not registered on editor (initialConfig.nodes)");
    }
    return editor.registerCommand(
      TOGGER_SPEED_COMMAND,
      (payload: Payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        const nodes = selection.extract();

        const exist = nodes.find( (node) => node.getType() === "voice" )
        if(exist) {
          message.error("变速不能和主播重叠！");
          return false;
        }
        console.log('exist',exist)

        // 先删除旧的
        nodes.forEach((node) => {
          const parent = node.getParent();
          if ($isSpeedNode(parent)) {
            const children = parent.getChildren();
            for (let i = 0; i < children.length; i++) {
              parent.insertBefore(children[i]);
            }
            parent.remove();
          }
        });

        // 在追加当前组件
        let prevParent: ElementNode | SpeedNode | null = null;

        const speedNumber = payload?.data || 0;

        const speedNode = $createSpeedNode(Number(speedNumber));
        nodes.forEach((node) => {
          const parent = node.getParent();
          // 如果父元素都是voiceNode,则将节点安全的插入到speedNode下
          if (
            parent === speedNode ||
            parent === null ||
            ($isElementNode(node) && !node.isInline())
          ) {
            return false;
          }

          if (!parent.is(prevParent)) {
            prevParent = parent;
            node.insertBefore(speedNode);
          }

          if (speedNode !== null) {
            console.log('append node',node)
            speedNode.append(node);
          }
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
