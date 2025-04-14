import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import { useCallback, useEffect, type JSX } from "react";
import { mergeRegister } from "@lexical/utils";
import { useAppDispatch } from "@/redux/hook";
import { closeFloat } from "@/redux/slice/initialState";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getWorkDetail } from "@/services/work";

export default function InitPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadWork = async () => {
      const id = searchParams.get("id");
      if (!id) {
        router.replace("/editor");
        return;
      }
      try {
        const res = await getWorkDetail(id);
        if (res.code === 1 && res.data?.editorState) {
          const editorState = editor.parseEditorState(res.data.editorState);
          editor.setEditorState(editorState);
        } else {
          router.replace("/editor");
        }
      } catch (error) {
        console.error("Failed to load work:", error);
        router.replace("/editor");
      }
    };

    loadWork();
  }, [editor, router]);

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

  return null;
}
