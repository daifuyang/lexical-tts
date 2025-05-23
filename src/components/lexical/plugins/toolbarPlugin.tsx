/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { createWork } from "@/redux/slice/workState";
import {
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  EditorState,
  REDO_COMMAND,
  UNDO_COMMAND
} from "lexical";
import { useEffect, useState, useRef } from "react";
import { Avatar, Spin } from "antd";
import { PreviewDialog } from "@/components/PreviewDialog";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { OPEN_PINYIN_POPUP_COMMAND } from "./pinyinPlugin";
import { OPEN_SYMBOL_POPUP_COMMAND } from "./symbolPlugin";
import { OPEN_SPEED_POPUP_COMMAND } from "./speedPlugin";
import { INSERT_PAUSE_COMMAND } from "./pausePlugin";
import { OPEN_VOICE_MODAL_COMMAND } from "./voicePlugin";

import classNames from "classnames";
import { getSample } from "@/services/sample";
import { mergeSentenceNodes, recursionNodes } from "@/lib/sample";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin(props: any) {
  const { total } = props;

  const dispatch = useAppDispatch();
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [open, setOpen] = useState(false);

  const voiceState = useAppSelector((state) => state.voiceState);
  const { globalVoice, loading } = voiceState;
  const defaultVoiceLoading = loading.defaultVoice;
  const toolbarRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname(); // 获取当前路径
  const searchParams = useSearchParams(); // 获取当前查询参数

  const [previewState, setPreviewState] = useState<EditorState | null>(null);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerUpdateListener(({ editorState }) => {
        setPreviewState(editorState);
      })
    );
  }, [editor]);

  return (
    <>
      {open && previewState && (
        <PreviewDialog open={open} onOpenChange={setOpen} editorState={previewState.clone()} />
      )}

      <div className="toolbar" ref={toolbarRef}>
        <div
          onClick={async () => {

            // 已经包含id的则无需创建
            if (searchParams.get("id")) {
              setOpen(true);
              return;
            }

            const work = await dispatch(createWork({
              editor,
              voiceName: globalVoice?.shortName,
              defaultTitle: "试听作品"
            })).unwrap();

            if (work) {
              const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
              params.set("id", work.id); // 设置或更新 id 参数
              // 使用 replace 方法更新URL而不刷新页面
              router.replace(`${pathname}?${params.toString()}`);
              setOpen(true);
            }
          }}
          className="toolbar-item toolbar-play"
        >
          <img src="/assets/toolbar/play.svg" />
          <span>试听</span>
        </div>

        <div
          onMouseDown={(e) => {
            e.preventDefault();
            editor.dispatchCommand(OPEN_VOICE_MODAL_COMMAND, { type: "global" });
          }}
          className="toolbar-item toolbar-voice"
        >
          <Spin spinning={defaultVoiceLoading === "loading"}>
            <div className="toolbar-voice-container">
              <div className="toolbar-voice-avatar">
                <Avatar
                  style={{ backgroundColor: "#7265e6", verticalAlign: "middle" }}
                  size="large"
                  gap={4}
                >
                  {globalVoice?.name}
                </Avatar>
              </div>
              <div className="toolbar-voice-content">
                <div className="toolbar-voice-name">{globalVoice?.name}</div>
                <div className="toolbar-voice-desc">亲和温柔</div>
              </div>
            </div>
          </Spin>
        </div>

        <div
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          className={classNames({
            "toolbar-item": true,
            ["disabled"]: !canUndo
          })}
        >
          <img src="/assets/toolbar/undo.svg" />
          <span>撤销</span>
        </div>
        <div
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          className={classNames({
            "toolbar-item": true,
            ["disabled"]: !canRedo
          })}
        >
          <img src="/assets/toolbar/redo.svg" />
          <span>重做</span>
        </div>
        <Divider />
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            editor.dispatchCommand(OPEN_PINYIN_POPUP_COMMAND, undefined);
          }}
          className="toolbar-item"
        >
          <img src="/assets/toolbar/pinyin.svg" />
          <span>多音字</span>
        </div>
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            editor.dispatchCommand(OPEN_SYMBOL_POPUP_COMMAND, undefined);
          }}
          className="toolbar-item"
        >
          <img src="/assets/toolbar/number.svg" />
          <span>数字/符号</span>
        </div>
        <Divider />
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            editor.dispatchCommand(INSERT_PAUSE_COMMAND, 200);
          }}
          className="toolbar-item"
        >
          <img src="/assets/toolbar/pause.svg" />
          <span>停顿</span>
        </div>
        <Divider />
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            editor.dispatchCommand(OPEN_SPEED_POPUP_COMMAND, undefined);
          }}
          className="toolbar-item"
        >
          <img src="/assets/toolbar/speed.svg" />
          <span>局部变速</span>
        </div>
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            editor.dispatchCommand(OPEN_VOICE_MODAL_COMMAND, undefined);
          }}
          className="toolbar-item"
        >
          <img src="/assets/toolbar/voice.svg" />
          <span>多人配音</span>
        </div>
      </div>
    </>
  );
}
