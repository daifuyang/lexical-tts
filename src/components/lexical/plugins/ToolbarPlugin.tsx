import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { closeFloat, setFloatType, setInitialState } from "@/redux/slice/initialState";
import { message } from "antd";

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const dispatch = useDispatch();

  return (
    <div className="toolbar" ref={toolbarRef}>
      <div className="container">
        <button
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          className="toolbar-item spaced"
          aria-label="Undo"
        >
          撤回
        </button>
        <button
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          className="toolbar-item"
          aria-label="Redo"
        >
          前进
        </button>
        <Divider />
        <button
          onClick={(e) => {
            e.stopPropagation();
            editor.update(() => {
              const selection = $getSelection();
              if (selection) {
                const text = selection?.getTextContent();
                if (!text) {
                  message.error("请先选中文字!");
                  dispatch(closeFloat());
                  return;
                } else if (text.length > 1) {
                  message.error("请选择单个汉字!");
                  dispatch(closeFloat());
                  return;
                } else if (!/^[\u4E00-\u9FFF]+$/.test(text)) {
                  message.error("请选择单个汉字!");
                  dispatch(closeFloat());
                  return;
                }

                dispatch(setInitialState({ type: "pinyin",selectionText: text, value: undefined }));

              }
            });
          }}
          className="toolbar-item"
        >
          多音字
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            editor.update(() => {
              const selection = $getSelection();
              if (selection) {
                const text = selection?.getTextContent();
                if (!/^\d+(\.\d+)?$/.test(text)) {
                  message.error("请选择连贯数字！");
                  return;
                }
                dispatch(setFloatType("symbol"));
              }
            });
          }}
        >
          数字
        </button>
      </div>
    </div>
  );
}
