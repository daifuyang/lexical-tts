import { useEffect } from "react";
import {
  createCommand,
  LexicalCommand,
  COMMAND_PRIORITY_EDITOR
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertPinyin, $openPinYinPopup, PinyinNode } from "../nodes/pinyinNode";
import { mergeRegister } from "@lexical/utils";
import { useAppDispatch } from "@/redux/hook";

export const INSERT_PINYIN_COMMAND: LexicalCommand<string> = createCommand("INSERT_PINYIN_COMMAND");
export const OPEN_PINYIN_POPUP_COMMAND: LexicalCommand<string> = createCommand("OPEN_PINYIN_POPUP_COMMAND");

export default function PinyinPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!editor.hasNodes([PinyinNode])) {
      throw new Error(
        "PinyinPlugin: PinyinNode not registered on editor (initialConfig.nodes)",
      );
    }

    const unregister = mergeRegister(
      editor.registerCommand<string>(
        OPEN_PINYIN_POPUP_COMMAND,
        (payload) => {
          $openPinYinPopup(dispatch, payload)
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<string>(
        INSERT_PINYIN_COMMAND,
        (payload) => {
          $insertPinyin(payload);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      )
    )

    return () => {
      unregister();
    };

  }, [editor]);

  return null;
}
