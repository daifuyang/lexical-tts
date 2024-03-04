import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, LexicalEditor } from "lexical";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import "./index.css";
import { setFloatingElemPositionForPinyinEditor } from "../../utils/setFloatingElemPositionForPinyinEditor";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setFloatEditValue, setFloatType } from "@/redux/slice/initialState";
import { Menu, Radio } from "antd";

import { pinyin, convert } from "pinyin-pro";
import { TOGGER_NUMBER_COMMAND } from "../NumberPlugin";
import { $isPinyinNode } from "../../nodes/PinyinNode";
import { getNumberOptions } from "../../utils/number";
import { TOGGER_PINYIN_COMMAND } from "../PinyinPlugin";

function FloatingPinyinEditor({
  editor,
  anchorElem
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const { floatEditType, floatEditValue, selectionText, floatDomRect } = useSelector(
    (state: RootState) => state.initialState
  );
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

    if (floatEditType && rootElement !== null && editor.isEditable()) {
      //   const domRect: DOMRect | undefined =
      //     nativeSelection.focusNode?.parentElement?.getBoundingClientRect();

      let domRect: DOMRect | undefined = undefined;

      if (selectionText && floatDomRect) {

        const _floatDomRect = {...floatDomRect}
        _floatDomRect.y += 40;
        _floatDomRect.top += 40;
        domRect = _floatDomRect as DOMRect;

      } else if ( selection !== null && nativeSelection !== null) {
        domRect = nativeSelection?.getRangeAt(0).getBoundingClientRect();
        domRect.y += 40;
      }

      if (domRect) {
        setFloatingElemPositionForPinyinEditor(domRect, editorElem, anchorElem);
      }
    } else if (!activeElement || activeElement.className !== "pinyin-editor") {
      if (rootElement !== null) {
        setFloatingElemPositionForPinyinEditor(null, editorElem, anchorElem);
      }
      dispatch(setFloatType(undefined));
    }

    return true;
  }, [anchorElem, editor, floatEditType]);

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

  // 拼音
  const RenderPinyinRadio = () => {
    const [options, setOptions] = useState<string[]>([]);
    const [value, setValue] = useState<string>("");
    useEffect(() => {
      const _text = selectionText;
      if (_text) {
        const tone = pinyin(_text, {
          multiple: true // 启用多音字模式
        });
        const _options = tone?.split(" ");
        const toneNone = pinyin(_text, { toneType: "none" });
        if (!_options.includes(toneNone)) {
          _options.push(toneNone);
        }

        setOptions(_options);
      }
    }, [selectionText]);

    // 读取历史选择的拼音
    useEffect(() => {
      if (floatEditValue) {
        setValue(floatEditValue);
      }
    }, [floatEditValue]);

    return (
      <div>
        <Radio.Group
          onChange={(e) => {
            const { value } = e.target;
            editor.dispatchCommand(TOGGER_PINYIN_COMMAND, value);
          }}
          buttonStyle="solid"
          value={value}
        >
          {options?.map((item) => {
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

  // 数字
  const RenderSymbolRadio = () => {
    const [options, setOptions] = useState<string[]>([]);
    useEffect(() => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection) {
          const _text: string = selection?.getTextContent();
          if (_text) {
            const _options = getNumberOptions(Number(_text));
            setOptions(_options);
          }
        }
      });
    }, [editor]);

    return (
      <Menu style={{ border: "none" }}>
        {options?.map((item: any) => {
          return (
            <Menu.Item
              onClick={(e) => {
                editor.dispatchCommand(TOGGER_NUMBER_COMMAND, {
                  data: item
                });
              }}
              key={item.value}
            >
              {item.label}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  function getContent() {
    if (floatEditType === "pinyin") {
      return <RenderPinyinRadio />;
    } else if (floatEditType === "symbol") {
      return <RenderSymbolRadio />;
    }
    return null;
  }

  return (
    <div ref={editorRef} className="float-editor">
      {getContent()}
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
