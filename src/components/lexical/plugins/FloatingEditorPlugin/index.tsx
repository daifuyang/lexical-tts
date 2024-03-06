import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, $getSelection, LexicalEditor } from "lexical";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import "./index.css";
import { setFloatingElemPositionForPinyinEditor } from "../../utils/setFloatingElemPositionForPinyinEditor";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeFloat, setFloatEditValue, setFloatType } from "@/redux/slice/initialState";
import { Menu, Radio } from "antd";

import { pinyin } from "pinyin-pro";

import { $isPinyinNode, PinyinNode } from "../../nodes/PinyinNode";
import { getNumberOptions } from "../../utils/number";
import { ADD_PINYIN_COMMAND } from "../PinyinPlugin";
import { ADD_NUMBER_COMMAND } from "../NumberPlugin";
import { $isNumberNode, NumberNode } from "../../nodes/NumberNode";

function FloatingPinyinEditor({
  editor,
  anchorElem
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const { floatEditType, floatEditValue, nodeKey, selectionText, floatDomRect } =
    useSelector((state: RootState) => state.initialState);

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
        const _floatDomRect = { ...floatDomRect };
        _floatDomRect.y += 40;
        _floatDomRect.top += 40;
        domRect = _floatDomRect as DOMRect;
      } else if (selection !== null && nativeSelection?.rangeCount > 0) {
        domRect = nativeSelection?.getRangeAt?.(0).getBoundingClientRect();
        domRect.y += 40;
      }

      if (domRect) {
        setFloatingElemPositionForPinyinEditor(domRect, editorElem, anchorElem);
      }
    } else if (!activeElement || activeElement.className !== "float-editor") {
      if (rootElement !== null) {
        setFloatingElemPositionForPinyinEditor(null, editorElem, anchorElem);
      }
      dispatch(closeFloat());
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

    return (
      <Radio.Group
        onChange={(e) => {
          const { value } = e.target;

          if (value) {
            dispatch(setFloatEditValue(value));
          }

          if (nodeKey) {
            editor.update(() => {
              const editNode = $getNodeByKey(nodeKey);
              if ($isPinyinNode(editNode)) {
                (editNode as PinyinNode).setPinyin(value);
              }
            });
          } else {
            editor.dispatchCommand(ADD_PINYIN_COMMAND, value);
          }
        }}
        buttonStyle="solid"
        value={floatEditValue}
      >
        {options?.map((item) => {
          return (
            <Radio.Button key={item} value={item}>
              {item}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    );
  };

  // 数字
  const RenderSymbolRadio = () => {
    const [options, setOptions] = useState<string[]>([]);
    useEffect(() => {
      const _text = selectionText;
      if (_text) {
        const _options = getNumberOptions(Number(_text));
        setOptions(_options);
      }
    }, [selectionText]);

    return (
      <Menu selectedKeys={[floatEditValue || ""]} style={{ border: "none" }}>
        {options?.map((item: any) => {
          return (
            <Menu.Item
              onClick={(e) => {
                const { value, type } = item;
                if (value) {
                  dispatch(setFloatEditValue(value));
                }
                if (nodeKey) {
                  editor.update(() => {
                    const editNode = $getNodeByKey(nodeKey);
                    if ($isNumberNode(editNode)) {
                      (editNode as NumberNode).setValue(value);
                      (editNode as NumberNode).setVType(type);
                    }
                  });
                } else {
                  editor.dispatchCommand(ADD_NUMBER_COMMAND, {
                    data: item
                  });
                }
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
    <div
      ref={editorRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="float-editor"
    >
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
