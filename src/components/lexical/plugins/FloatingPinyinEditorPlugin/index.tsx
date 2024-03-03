import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { useCallback, useRef, useState, Dispatch } from "react";
import { createPortal } from "react-dom";

import "./index.css";
import { setFloatingElemPositionForPinyinEditor } from "../../utils/setFloatingElemPositionForPinyinEditor";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setIsPinyinEdit } from "@/redux/slice/initialState";
import { Radio, message } from "antd";

import { pinyin,convert } from "pinyin-pro";

function FloatingPinyinEditor({
  editor,
  anchorElem
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const isPinyinEdit = useSelector((state: RootState) => state.initialState.isPinyinEdit);
  const dispatch = useDispatch();

  const updatePinyinEditor = useCallback(() => {
    const selection = $getSelection();
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      isPinyinEdit === true &&
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      editor.isEditable()
    ) {
      //   const domRect: DOMRect | undefined =
      //     nativeSelection.focusNode?.parentElement?.getBoundingClientRect();

      const domRect: DOMRect | undefined = nativeSelection.getRangeAt(0).getBoundingClientRect();

      if (domRect) {
        domRect.y += 40;
        setFloatingElemPositionForPinyinEditor(domRect, editorElem, anchorElem);
      }
    } else if (!activeElement || activeElement.className !== "pinyin-editor") {
      if (rootElement !== null) {
        setFloatingElemPositionForPinyinEditor(null, editorElem, anchorElem);
      }
      dispatch(setIsPinyinEdit(false));
    }

    return true;
  }, [anchorElem, editor, isPinyinEdit]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updatePinyinEditor();
      });
    };

    window.addEventListener("resize", update);

    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);

      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [anchorElem.parentElement, editor, updatePinyinEditor]);

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updatePinyinEditor();
      });
    });
  }, [editor, updatePinyinEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updatePinyinEditor();
    });
  }, [editor, updatePinyinEditor]);

  const RenderRadio = () => {
    const [text, setText] = useState("");
    const [option, setOption] = useState<string[]>([]);

    useEffect(() => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection) {
          const _text = selection?.getTextContent();
          if (text != _text) {
            const tone = pinyin(_text, {
              multiple: true // 启用多音字模式
            });
            const _option = tone?.split(" ");
            setOption(_option);
            setText(_text);
          }
        }
      });
    }, [editor]);

    return (
      <div>
        <Radio.Group buttonStyle="solid">
          {option?.map((item) => {
            return (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      </div>
    );
  };

  return (
    <div ref={editorRef} className="pinyin-editor">
      {isPinyinEdit ? <RenderRadio /> : null}
    </div>
  );
}

function useFloatingPinyinEditorToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement
): JSX.Element | null {
  const [activeEditor, setActiveEditor] = useState(editor);

  return createPortal(
    <FloatingPinyinEditor editor={activeEditor} anchorElem={anchorElem} />,
    anchorElem
  );
}

export default function FloatingPinyinEditorPlugin({
  anchorElem = document.body
}: {
  anchorElem?: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingPinyinEditorToolbar(editor, anchorElem);
}
