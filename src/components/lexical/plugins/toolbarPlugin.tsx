/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { TOGGER_SPEED_COMMAND } from "../nodes/speedNode";
import { useAppDispatch } from "@/redux/hook";
import { OPEN_PINYIN_POPUP_COMMAND } from "./pinyinPlugin";
import { OPEN_SYMBOL_POPUP_COMMAND } from "./symbolPlugin";
const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const dispatch = useAppDispatch();

  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <div
        onClick={() => {
          const state = editor.getEditorState();
          console.log('state', JSON.stringify(state))
        }}
        className="toolbar-item toolbar-play"
      >
        <img src="/assets/toolbar/play.svg" />
        <span>试听</span>
      </div>

      <div className="toolbar-item">
        <img src="/assets/toolbar/undo.svg" />
        <span>撤销</span>
      </div>
      <div className="toolbar-item">
        <img src="/assets/toolbar/redo.svg" />
        <span>重做</span>
      </div>
      <Divider />
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(OPEN_PINYIN_POPUP_COMMAND, '');
        }}
        className="toolbar-item"
      >
        <img src="/assets/toolbar/pinyin.svg" />
        <span>多音字</span>
      </div>
      <div onMouseDown={(e) => {
         e.preventDefault();
          editor.dispatchCommand(OPEN_SYMBOL_POPUP_COMMAND, '');
      }} className="toolbar-item">
        <img src="/assets/toolbar/number.svg" />
        <span>数字/符号</span>
      </div>
      <Divider />
      <div className="toolbar-item">
        <img src="/assets/toolbar/speed.svg" />
        <span>局部变速</span>
      </div>
      <div className="toolbar-item">
        <img src="/assets/toolbar/voice.svg" />
        <span>多语音</span>
      </div>
    </div>
  );
}
