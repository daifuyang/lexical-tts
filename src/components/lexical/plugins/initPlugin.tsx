import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, ParagraphNode } from "lexical";
import { useCallback, useEffect, type JSX } from "react";
import { mergeRegister } from "@lexical/utils";
import { useAppDispatch } from "@/redux/hook";
import { closeFloat } from "@/redux/slice/initialState";

export default function InitPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const dispatch = useAppDispatch();

  const updateInit = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      if (nativeSelection == null || selection == null) {
        dispatch(closeFloat());
        return;
      }

      const rawTextContent = selection?.getTextContent().replace(/\n/g, "");
      if (!rawTextContent) {
        dispatch(closeFloat());
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updateInit);
    return () => {
      document.removeEventListener("selectionchange", updateInit);
    };
  }, [updateInit]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        updateInit();
      }),
      /* editor.registerNodeTransform(ParagraphNode, (paragraph) => {
        const nodes = paragraph.getAllTextNodes();
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const text = node.getTextContent();
          if (text.indexOf("科技趣闻") > 0) {
            console.log("text", text);
            break;
          }
        }
      }) */
    );
  }, [editor, updateInit]);

  return null;
}
