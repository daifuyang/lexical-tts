// 多音字标注插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  createCommand
} from "lexical";

import { useEffect } from "react";
import { NumberNode, toggleNumber } from "../nodes/NumberNode";

interface Payload {
  data: {
    value: string;
    type: string;
  };
}

export const TOGGER_NUMBER_COMMAND: LexicalCommand<Payload> =
  createCommand("TOGGER_NUMBER_COMMAND");

export default function NumberPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([NumberNode])) {
      throw new Error("NumberPlugin: NumberNode not registered on editor (initialConfig.nodes)");
    }
    return editor.registerCommand(
      TOGGER_NUMBER_COMMAND,
      (payload: Payload) => {
        console.log('payload',payload)
        const { data } = payload;
        toggleNumber(data.value, data.type);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
