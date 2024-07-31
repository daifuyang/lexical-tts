import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import { useCallback, useEffect } from "react";
import { mergeRegister } from "@lexical/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { closeFloat } from "@/redux/slice/initialState";

export default function InitPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const work: any = useAppSelector((state) => state.lexicalState.work);

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
      })
    );
  }, [editor, updateInit]);

  const updateEditorState = useCallback(() => {
    try {
      if (work?.editorState) {
        const editorState = editor.parseEditorState(work?.editorState);
        editor.setEditorState(editorState);
      }
    } catch (error) {}
  }, [work]);

  useEffect(() => {
    updateEditorState();
  }, [updateEditorState]);

  return null;
}
