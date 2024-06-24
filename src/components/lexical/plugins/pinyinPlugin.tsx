import { useEffect } from "react";
import {
  createCommand,
  LexicalCommand,
  COMMAND_PRIORITY_EDITOR,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PinyinNode, $insertPinyin } from "../nodes/pinyinNode";

export const INSERT_PINYIN_COMMAND: LexicalCommand<string> = createCommand();

export default function PinyinPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PinyinNode])) {
      throw new Error(
        "PinyinPlugin: PinyinNode not registered on editor (initialConfig.nodes)",
      );
    }

    return editor.registerCommand<string>(
      INSERT_PINYIN_COMMAND,
      (payload) => {
        $insertPinyin();
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
