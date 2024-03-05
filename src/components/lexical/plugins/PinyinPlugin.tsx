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
import {  PinyinNode, addPinYin } from "../nodes/PinyinNode";

export const TOGGER_PINYIN_COMMAND: LexicalCommand<void> = createCommand('TOGGER_PINYIN_COMMAND');

export default function PinyinPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([PinyinNode])) {
      throw new Error("PinyinPlugin: PinyinNode not registered on editor (initialConfig.nodes)");
    }
    return editor.registerCommand(
      TOGGER_PINYIN_COMMAND,
      (payload: string) => {
        addPinYin(payload)
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
