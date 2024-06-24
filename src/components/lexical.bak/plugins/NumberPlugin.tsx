// 多音字标注插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  createCommand
} from "lexical";

import { useEffect } from "react";
import { $createNumberNode, NumberNode } from "../nodes/NumberNode";

interface Payload {
  data: {
    value: string;
    type: string;
  };
}

export const ADD_NUMBER_COMMAND: LexicalCommand<Payload> = createCommand("ADD_NUMBER_COMMAND");

export default function NumberPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([NumberNode])) {
      throw new Error("NumberPlugin: NumberNode not registered on editor (initialConfig.nodes)");
    }
    return editor.registerCommand(
      ADD_NUMBER_COMMAND,
      (payload: Payload) => {
        const { data } = payload;
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const nodes = selection.extract();
        nodes.forEach((node) => {
          if ($isTextNode(node)) {
            const number = $createNumberNode(data.value, data.type, node.__text);
            node.insertBefore(number);
            node.remove();
          }
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
