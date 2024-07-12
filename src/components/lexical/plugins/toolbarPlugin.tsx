/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { CAN_REDO_COMMAND, CAN_UNDO_COMMAND, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { useEffect, useRef, useState } from "react";
import { Avatar, Spin } from "antd";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { OPEN_PINYIN_POPUP_COMMAND } from "./pinyinPlugin";
import { OPEN_SYMBOL_POPUP_COMMAND } from "./symbolPlugin";
import { OPEN_SPEED_POPUP_COMMAND } from "./speedPlugin";
import { INSERT_PAUSE_COMMAND } from "./pausePlugin";
import { OPEN_VOICE_MODAL_COMMAND } from "./voicePlugin";

import { convert, pinyin } from "pinyin-pro";
import classNames from "classnames";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const voiceState = useAppSelector((state) => state.voiceState);

  const { globalVoice, loading } = voiceState;

  const defaultVoiceLoading = loading.defaultVoice;

  const dispatch = useAppDispatch();

  const toolbarRef = useRef(null);

  const parseSSMLNode = (nodes: any = []) => {
    let ssml = "";
    nodes.forEach((node: any) => {
      switch (node.type) {
        case "paragraph":
          ssml += `<voice name="zh-CN-XiaoxiaoNeural">`;
          ssml += `<p><s>`;
          const nodes = node.children;
          const content = parseSSMLNode(nodes);
          if (content) {
            ssml += content;
          }
          ssml += `</s></p>`;
          ssml += `</voice>`;
          break;
        case "voice":
          let voiceChildrenSsml = parseSSMLNode(node.children);
          let voice = `<voice name="zh-CN-YunxiNeural">
          ${voiceChildrenSsml}
      </voice>`;
          if (voiceChildrenSsml) {
            ssml += voice;
          }
          break;
        case "pinyinNode":
          let pinyinNodeText = "";
          if (node?.children?.length > 0) {
            pinyinNodeText = node.children.map((item: any) => item.text)?.join("");
          }
          let ph = convert(node.pinyin, { format: "symbolToNum" });
          if (ph) {
            ph = ph.slice(0, -1) + " " + ph.slice(-1);
            ssml += `<phoneme alphabet="sapi" ph="${ph}">${pinyinNodeText}</phoneme>`;
          } else {
            ssml += `${pinyinNodeText}`;
          }
          break;

        case "symbolNode":
          let symbolNodeText = "";
          if (node?.children?.length > 0) {
            symbolNodeText = node.children.map((item: any) => item.text)?.join("");
          }
          // 数字，符号的逻辑不同
          switch (node.readType) {
            case "序列":
            case "数值":
              const reads = pinyin(node.value, { toneType: "num", type: "array" });
              const ph = reads.map((read) => read.slice(0, -1) + " " + read.slice(-1)).join(" ");
              ssml += `<phoneme alphabet="sapi" ph="${ph}">${symbolNodeText}</phoneme>`;
              return;
            default:
              ssml += `${symbolNodeText}`;
          }
          break;

        case "speedNode":
          let speedChildrenSsml = parseSSMLNode(node.children);
          // const speedNodetext = speedNodes?.map((item: any) => item.text)?.join("");
          ssml += `<prosody rate="${node.speed}0%">${speedChildrenSsml}</prosody>`;
          break;

        case "wrapNode":
          let wrapChildrenSsml = parseSSMLNode(node.children);
          ssml += wrapChildrenSsml;
          break;
        default:
          ssml += `${node.text}`;
          break;
      }
    });
    return ssml;
  };

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
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <div
        onClick={() => {
          const state = editor.getEditorState();
          const json = state.toJSON();
          let ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-cn">`;
          ssml += parseSSMLNode(json.root.children);
          ssml += `</speak>`;

          console.log("ssml", ssml);
        }}
        className="toolbar-item toolbar-play"
      >
        <img src="/assets/toolbar/play.svg" />
        <span>试听</span>
      </div>

      <div
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(OPEN_VOICE_MODAL_COMMAND, "global");
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
          'toolbar-item': true,
          ['disabled']: !canUndo
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
          'toolbar-item': true,
          ['disabled']: !canRedo
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
  );
}
