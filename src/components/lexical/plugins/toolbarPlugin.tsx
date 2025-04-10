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
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  $getRoot,
  ParagraphNode
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { Avatar, Spin, message } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { OPEN_PINYIN_POPUP_COMMAND } from "./pinyinPlugin";
import { OPEN_SYMBOL_POPUP_COMMAND } from "./symbolPlugin";
import { OPEN_SPEED_POPUP_COMMAND } from "./speedPlugin";
import { INSERT_PAUSE_COMMAND } from "./pausePlugin";
import { OPEN_VOICE_MODAL_COMMAND } from "./voicePlugin";

import classNames from "classnames";
import { $isParagraphNode } from "lexical";
import { getSample } from "@/services/sample";
import { $isPinyinNode } from "@/components/lexical/nodes/pinyinNode";
import { $isSymbolNode } from "../nodes/symbolNode";
import { splitTextByPunctuation } from "../utils/text";
import { $createAudioNode, $isAudioNode } from "../nodes/audioNode";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin(props: any) {
  const { total } = props;

  const dispatch = useAppDispatch();
  const [editor] = useLexicalComposerContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [sampleLoading, setSampleLoading] = useState(false);

  // 播放状态
  const [playing, setPlaying] = useState(false);

  // 播放索引
  const [playIndex, setPlayIndex] = useState(0);

  // 定义试听格式化状态
  const [playEditorState, setPlayEditorState] = useState<any>(null);

  const [playList, setPlayList] = useState<any>({});

  const voiceState = useAppSelector((state) => state.voiceState);
  const { globalVoice, loading } = voiceState;
  const defaultVoiceLoading = loading.defaultVoice;
  const toolbarRef = useRef(null);

  function preloadData<T>(data: T[], index: number, size: number): T[] {
    /**
     * 预加载数据
     * @param data - 输入的数组
     * @param index - 当前起始索引
     * @param size - 需要加载的数据量
     * @returns 返回从指定索引开始的指定数量的数据
     */
    if (!Array.isArray(data)) {
      throw new Error("The first argument must be an array.");
    }
    if (index < 0 || size <= 0) {
      throw new Error("Index must be non-negative and size must be positive.");
    }

    const end = index + size; // 计算结束位置

    return data.slice(index, end); // 使用 slice 方法提取数据
  }

  // 收集播放请求
  const handlePLayList = async () => {
    if (playEditorState?.length > 0) {
      editor.update(() => {
        const preloadNodes = preloadData(playEditorState, playIndex, 1);
        for (let index = 0; index < preloadNodes.length; index++) {
          const page = playIndex + index;

          if (playList[page]) {
            continue;
          }

          const node: any = preloadNodes[index];
          const paragraph = new ParagraphNode().exportJSON();
          node.forEach((children: any) => {
            paragraph.children.push(children.exportJSON());
          });
          const editorState = JSON.stringify([paragraph]);

          getSample({ editorState, voiceName: "zh-CN-XiaoxiaoNeural" }).then((res: any) => {
            if (res.code === 1) {
              setPlayList((prevList: any) => {
                return {
                  ...prevList,
                  [page]: res.data.prevPath
                };
              });
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    handlePLayList();
  }, [playEditorState, playIndex, globalVoice]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!playing) {
      pauseAudio();
      return;
    }
    const currentSrc = playList[playIndex];
    if (currentSrc && currentSrc !== audio.src) {
      if (playing) {
        pauseAudio();
      }

      audio.src = currentSrc;
      playAudio();

      editor.update(() => {
        const currentPlay = playEditorState[playIndex];
        for (const node of currentPlay) {
          node.setStyle("color:green");
        }
      });
    }

    // 增加对音频播放结束的监听
    const handleAudioEnded = () => {
      const playLength = playEditorState.length;
      editor.update(() => {
        const currentPlay = playEditorState[playIndex];
        for (const node of currentPlay) {
          node.setStyle("");
        }
      });
      const nextIndex = playIndex + 1;
      if (nextIndex < playLength) {
        setPlayIndex(nextIndex);
      } else {
        setPlaying(false);
        setPlayIndex(0);
      }
    };
    audioRef.current?.addEventListener("ended", handleAudioEnded);
    // 清理事件监听器
    return () => {
      audioRef.current?.removeEventListener("ended", handleAudioEnded);
    };
  }, [playIndex, playList, playing]);

  const playAudio = () => {
    // 判定audioRef是否在播放
    if (audioRef.current?.paused) {
      try {
        audioRef.current?.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current?.paused) {
      audioRef.current?.pause();
    }
  };

  // 点击试听，重新处理节点。
  const recursionNodes = (nodes: any) => {
    const newNodes: any = [];
    for (const node of nodes) {
      const newChildNodes: any = [];
      if ($isParagraphNode(node)) {
        const children = node.getChildren();
        const paragraphChildNodes = recursionNodes(children);
        newChildNodes.push({
          type: "paragraph",
          node,
          children: paragraphChildNodes
        });
      } else if ($isAudioNode(node)) {
        newChildNodes.push(node);
      } else if ($isTextNode(node)) {
        // 如果顶层节点为段落，则直接分词
        const textContent = node.getTextContent();
        // 分词
        const texts = splitTextByPunctuation(textContent);
        let offest = -1;
        let splitOffsets = [];
        for (const text of texts) {
          const index = textContent.indexOf(text);
          if (index !== -1) {
            offest = index;
            splitOffsets.push(offest);
          }
        }
        if (splitOffsets.length > 0) {
          const splitNodes = node.splitText(...splitOffsets);
          if (splitNodes.length > 0) {
            for (const node of splitNodes) {
              node.setMode("token");
              newChildNodes.push(node);
            }
          }
        }
      } else if ($isPinyinNode(node)) {
        newChildNodes.push(node);
      } else if ($isSymbolNode(node)) {
        newChildNodes.push(node);
      }
      newNodes.push(...newChildNodes);
    }
    return newNodes;
  };

  /**
   * 判断一个字符串是否是一句话（以标点符号结尾）。
   * @param text 输入字符串
   * @returns 是否是一句话
   */
  function isCompleteSentence(text: string): boolean {
    if (!text) return false;
    // 定义正则表达式匹配标点符号结尾
    const sentenceEndings = /[。？！.!?]$/;
    return sentenceEndings.test(text);
  }

  const mergeSentenceNodes = (nodes: any) => {
    const mergedResult: any = [];
    let currentSentence = "";
    let sentenceNodes = [];
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      if ($isTextNode(node)) {
        sentenceNodes.push(node);
        const text = node.getTextContent();
        currentSentence += text;
        const end = index === nodes.length - 1;
        if (isCompleteSentence(currentSentence) || end) {
          mergedResult.push(sentenceNodes);
          currentSentence = "";
          sentenceNodes = [];
        }
      } else if ($isPinyinNode(node)) {
        sentenceNodes.push(node);
        currentSentence += node.getTextContent();
      } else if ($isSymbolNode(node)) {
        sentenceNodes.push(node);
        currentSentence += node.getTextContent();
      }
    }
    return mergedResult;
  };

  // 试听
  const samplePlay = () => {
    setPlaying(!playing);
    if (!playing) {
      editor.update(() => {
        const root = $getRoot();

        let nodeKey = null;
        const selection = $getSelection();
        if (!selection) {
          return;
        }

        const nodes = selection.getNodes();
        if (nodes.length > 0) {
          nodeKey = nodes[0].getKey();
        }

        const paragraphNodes = recursionNodes(root.getChildren());
        let sentenceNodes = [];
        let keyMap: any = {};
        let index = 0;
        for (const nodes of paragraphNodes) {
          // 段落
          const sentenceNode = mergeSentenceNodes(nodes.children);
          for (const nodes of sentenceNode) {
            for (const node of nodes) {
              const key = node.getKey();
              keyMap[key] = index;
            }
            index++;
            sentenceNodes.push(nodes);
          }
        }

        setPlayEditorState(sentenceNodes);
        const currentPlay = sentenceNodes[playIndex];
        for (const node of currentPlay) {
          node.setStyle("");
        }

        if (nodeKey) {
          const currentPlayIndex = keyMap[nodeKey];
          setPlayIndex(currentPlayIndex);
        }
      });
    }
  };

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

  const voiceName = globalVoice?.shortName || "zh-CN-XiaoxiaoNeural"; // 当前主播

  return (
    <>
      <audio
        /*        style={{width: 200}}
        controls */
        ref={audioRef}
        // onPause={handlePause}
        // autoPlay
      >
        <source type="audio/mpeg" />
        Your browser does not support this audio format.
      </audio>
      <div className="toolbar" ref={toolbarRef}>
        <div
          onMouseDown={async (e) => {
            e.preventDefault();
            if (!total) {
              message.error("请先输入配音内容！");
              return;
            }
            samplePlay();
          }}
          className="toolbar-item toolbar-play"
        >
          <img
            src={`/assets/toolbar/${
              sampleLoading ? "loading.svg" : playing ? "playing.svg" : "play.svg"
            }`}
          />
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
