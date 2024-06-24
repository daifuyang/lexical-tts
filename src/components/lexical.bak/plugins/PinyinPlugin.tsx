// 多音字标注插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CLICK_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  LexicalCommand,
  SELECTION_CHANGE_COMMAND,
  createCommand
} from "lexical";

import { mergeRegister } from "@lexical/utils";

import { useEffect, useState } from "react";
import { $createPinyinNode, PinyinNode } from "../nodes/PinyinNode";

export const ADD_PINYIN_COMMAND: LexicalCommand<string> = createCommand("ADD_PINYIN_COMMAND");

export default function PinyinPlugin(props: any) {
  const [editor] = useLexicalComposerContext();

  const [prevKey, setPrevKey] = useState();

  useEffect(() => {
    if (!editor.hasNodes([PinyinNode])) {
      throw new Error("PinyinPlugin: PinyinNode not registered on editor (initialConfig.nodes)");
    }

    const unregister = mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payload) => {
          const selection = $getSelection();

          if (selection) {
            const points = selection.getStartEndPoints();
            // console.log('points',points[0],points[1])
            if (points) {
              /* const { key, offset } = points[1];
              const nodes = selection?.extract();
              if (nodes?.length === 1) {
                const node = nodes[0];
                const nodeKey = node.getKey();
                const parent = node.getParent();
                if ($isPinyinNode(parent)) {
                  if (nodeKey === key && offset === 0) {
                    if (parent?.__prev) {
                      const prev = $getNodeByKey(parent?.__prev);
                      prev?.selectEnd();
                    }
                  }
                }
              } */
            }
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      // editor.registerCommand(
      //   KEY_ARROW_RIGHT_COMMAND,
      //   (payload) => {
      //     const selection = $getSelection();
      //     if (selection) {
      //       const points = selection.getStartEndPoints();
      //       if (points) {
      //         const { key, offset } = points[1];
      //         const nodes = selection?.extract();
      //         if (nodes?.length === 1) {
      //           const node = nodes[0];

      //           const size = node.getTextContentSize();
      //           const nodeKey = node.getKey();
      //           if (nodeKey === key && size === offset) {
      //             const parent = node.getParent();
      //             if ($isPinyinNode(parent)) {
      //               parent.selectNext();
      //               return;
      //             }
      //             if (node.__next) {
      //               const next = $getNodeByKey(node.__next);
      //               if ($isPinyinNode(next)) {
      //                 console.log("nide", next, node, size, offset);
      //                 next.selectStart();
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }
      //     return true;
      //   },
      //   COMMAND_PRIORITY_EDITOR
      // ),
      editor.registerCommand(
        ADD_PINYIN_COMMAND,
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
