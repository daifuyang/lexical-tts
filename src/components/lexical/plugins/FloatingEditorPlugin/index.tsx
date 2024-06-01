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
import { Button, Input, Menu, Radio, Slider } from "antd";

import { pinyin } from "pinyin-pro";

import { getNumberOptions } from "../../utils/number";
import { ADD_PINYIN_COMMAND } from "../PinyinPlugin";
import { ADD_NUMBER_COMMAND } from "../NumberPlugin";
import { $isNumberNode, NumberNode } from "../../nodes/NumberNode";
import { TOGGER_SPEED_COMMAND } from "../../nodes/SpeedNode";
import { TOGGER_ALIAS_COMMAND } from "../../nodes/AliasNode";

function FloatingPinyinEditor({
  editor,
  anchorElem
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const initialState = useSelector((state: RootState) => state.initialState);

  const { floatEditType, floatEditValue, nodeKey, selectionText, floatDomRect } = initialState;

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
      let domRect: DOMRect | undefined = undefined;

      if (selectionText && floatDomRect) {
        const _floatDomRect = { ...floatDomRect };
        _floatDomRect.y += 40;
        _floatDomRect.top += 40;
        domRect = _floatDomRect as DOMRect;
      } else if (selection !== null && nativeSelection && nativeSelection?.rangeCount > 0) {
        domRect = nativeSelection?.getRangeAt?.(0).getBoundingClientRect();
        domRect.y += 40;
      }

      if (domRect) {
        setFloatingElemPositionForPinyinEditor(domRect, editorElem, anchorElem);
      }
    } else {
      if (rootElement !== null) {
        setFloatingElemPositionForPinyinEditor(null, editorElem, anchorElem);
      }
    }

    return true;
  }, [anchorElem, editor, initialState]);

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
          editor.dispatchCommand(ADD_PINYIN_COMMAND, value);
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
                editor.dispatchCommand(ADD_NUMBER_COMMAND, {
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

  // 变速
  const RenderSpeedSlider = () => {
    const [sliderValue, setSliderValue] = useState<number>(0);

    return (
      <div style={{ width: 300, display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <span style={{ margin: "0 4px" }}>慢</span>
          <div style={{ flex: 1 }}>
            <Slider
              onChange={(value) => {
                setSliderValue(value);
              }}
              defaultValue={0}
              min={-10}
              max={10}
              step={1}
              tooltip={{ open: true }}
            />
          </div>
          <span style={{ margin: "0 4px" }}>快</span>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setFloatEditValue(`${sliderValue}`));
            editor.dispatchCommand(TOGGER_SPEED_COMMAND, {
              data: sliderValue
            });
          }}
          style={{ marginLeft: 4 }}
          type="primary"
        >
          确定
        </Button>
      </div>
    );
  };

  // alias
  const RenderAliasInput = () => {
    const [alias, setAlias] = useState("");
    return (
      <div style={{ width: 300, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", flex: 1, marginRight: 16 }}>
          <span>别名：</span>
          <Input
            onChange={(e) => {
              const { value = "" } = e.target;
              setAlias(value);
            }}
            style={{ flex: 1 }}
          />
        </div>
        <div>
          <Button onClick={ () => {
            if (alias) {
              dispatch(setFloatEditValue(alias));
            }
            editor.dispatchCommand(TOGGER_ALIAS_COMMAND, alias);
          } }>确定</Button>
        </div>
      </div>
    );
  };

  function getContent() {
    if (floatEditType === "pinyin") {
      return <RenderPinyinRadio />;
    } else if (floatEditType === "symbol") {
      return <RenderSymbolRadio />;
    } else if (floatEditType === "speed") {
      return <RenderSpeedSlider />;
    } else if (floatEditType === "alias") {
      return <RenderAliasInput />;
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
