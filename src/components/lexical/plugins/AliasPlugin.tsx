// 多音字标注插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  SELECTION_CHANGE_COMMAND,
} from "lexical";

import { mergeRegister } from "@lexical/utils";

import { useEffect, useState } from "react";
import { $createPinyinNode, PinyinNode } from "../nodes/PinyinNode";
import { TOGGER_ALIAS_COMMAND } from "../nodes/AliasNode";


export default function AliasPlugin(props: any) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PinyinNode])) {
      throw new Error("AliasPlugin: AliasNode not registered on editor (initialConfig.nodes)");
    }

    const unregister = mergeRegister(
      editor.registerCommand(
        TOGGER_ALIAS_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }
          const nodes = selection.extract();
          nodes.forEach((node) => {
            if ($isTextNode(node)) {
              const pinyin = $createPinyinNode(node.__text, payload);
              node.insertBefore(pinyin);
              node.remove();
            }
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );

    return () => {
      unregister();
    };
  }, [editor]);

  return null;
}
