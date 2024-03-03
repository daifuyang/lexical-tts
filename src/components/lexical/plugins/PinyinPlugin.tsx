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
import { $createPinyinNode, PinyinNode, togglePinYin } from "../nodes/PinyinNode";
import { message } from "antd";

import { pinyin } from "pinyin-pro";

export const TOGGER_PINYIN_COMMAND: LexicalCommand<void> = createCommand('TOGGER_PINYIN_COMMAND');

export default function PinyinPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([PinyinNode])) {
      throw new Error("PinyinPlugin: PinyinNode not registered on editor (initialConfig.nodes)");
    }
    return editor.registerCommand(
      TOGGER_PINYIN_COMMAND,
      () => {

        togglePinYin('test')
        
        // editor.update(() => {

        //     toggleLink()

        //   let selection = $getSelection();
          
        //   if (selection !== null) {
        //     const text = selection.getTextContent();
        //     if (text.length > 1) {
        //       message.error("请划选单个汉字");
        //       return;
        //     }

        //     const res = pinyin(text, {
        //       toneType: "num", // 设置拼音风格为无声调
        //       multiple: true // 启用多音字模式
        //     });

        //     const toneNone = pinyin(text, { toneType: "none" });

        //     $createPinyinNode("test");
        //   }
        // });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
