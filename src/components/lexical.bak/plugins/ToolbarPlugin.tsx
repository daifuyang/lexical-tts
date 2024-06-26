import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $insertNodes,
  BaseSelection,
  LexicalNode,
  REDO_COMMAND,
  TextNode,
  UNDO_COMMAND
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { $numberFloat } from "../nodes/NumberNode";
import { $pinYinFloat } from "../nodes/PinyinNode";
import { $speedFloat, SpeedNode } from "../nodes/SpeedNode";

import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/24/outline";
import { $createBreakNode } from "../nodes/BreakNode";
import { Button } from "antd";
import { PlayCircleFilled, CustomerServiceOutlined, DownloadOutlined } from "@ant-design/icons";
import _ from "lodash";
import { convert } from "pinyin-pro";
import VoiceModal from "./FloatingVoicePlugin/modal";
import { $aliasFloat } from "../nodes/AliasNode";

function Divider(props: any) {

  return <div className="divider" {...props} />;
}

const parseSSMLNode = (nodes = []) => {
  let ssml = "";
  nodes.forEach((node: any) => {
    switch (node.type) {
      case "voice":
        let childrenSsml = parseSSMLNode(node.children);
        let voice = `<voice name="zh-CN-YunxiNeural">
        ${childrenSsml}
    </voice>`;
        if (childrenSsml) {
          ssml += voice;
        }
        break;
      case "pinyin":
        let ph = convert(node.pinyin, { format: "symbolToNum" });
        if (ph) {
          ph = ph.slice(0, -1) + " " + ph.slice(-1);
          ssml += `<phoneme alphabet="sapi" ph="${ph}">${node.text}</phoneme>`;
        } else {
          ssml += `${node.text}`;
        }
        break;
      case "speed":
        const speedNodes = node.children
        const text = speedNodes?.map( (item: any) => item.text )?.join('')
        ssml += `<prosody rate="${node.speed}0%">${text}</p>rosody>`
        break
      default:
        ssml += `${node.text}`;
        break;
    }
  });
  return ssml;
};

export default function ToolbarPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [selection, setSelection] = useState<BaseSelection | null>(null);

  const [voiceModal, setVoiceModal] = useState({
    open: false,
    title: ""
  });

  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      const _selection = $getSelection();
      if (selection !== _selection) {
        setSelection(_selection);
      }
    });
  });

  const dispatch = useDispatch();

  const loadContent = () => {
    const value = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"各位听众，大家好。欢迎收听今天的节目。我是您的播音员，今天将为您带来一则重要的新闻。","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"最新数据显示，全球范围内，COVID-19疫情依然严峻。许多国家正在采取积极的措施来控制疫情的蔓延，并加速疫苗接种工作。但同时，我们也需要警惕病毒的变种可能带来的挑战。","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"在科技领域，人工智能技术的应用正在日益深入各个行业。从医疗保健到金融，人工智能的智能化应用正在为我们的生活带来革命性的改变。","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"另外，在体育领域，最近举办的国际体育赛事中，我国代表团再次展现了强大的实力，为我们赢得了荣誉和喝彩。","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"最后，提醒大家，健康生活从自我保护开始。请记得保持社交距离，勤洗手，戴口罩。让我们共同努力，战胜疫情，迎接更加美好的未来。","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"感谢您的收听，我们下期节目再见。","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
    const editorState = editor.parseEditorState(value);
    editor.setEditorState(editorState);
  };

  useEffect(() => {
    // loadContent();
  }, []);

  async function getSsml() {
    const editorState = editor.getEditorState();
    const state = JSON.stringify(editorState);
    const json = JSON.parse(state);

    let ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-cn">`;

    const paragraphs = json.root.children;
    paragraphs.forEach((paragraph: any) => {
      ssml += `<voice name="zh-CN-XiaoxiaoNeural">`;
      ssml += `<p><s>`;
      const nodes = paragraph.children;
      const content = parseSSMLNode(nodes);
      console.log('content',content)
      if (content) {
        ssml += content;
      }
      ssml += `</s></p>`;
      ssml += `</voice>`;
    });
    ssml += `</speak>`;
    console.log("ssml", ssml);
    // const res = await tts({ ssml });
    // console.log("res", res);
  }

  const getContent = () => {
    // editor.update(() => {
    //   const editorState = editor.getEditorState();
    //   const htmlString = $generateHtmlFromNodes(editor);
    //   console.log("editorState", JSON.stringify(editorState));
    // });
  };

  return (
    <>
      <VoiceModal
        title="选择主播"
        open={voiceModal.open}
        onOk={() => {
          setVoiceModal((prev) => ({ ...prev, open: false }));
        }}
        onCancel={() => {
          setVoiceModal((prev) => ({ ...prev, open: false }));
        }}
      />
      <div className="toolbar" ref={toolbarRef}>
        <div className="container">
          <div className="flex flex-1">
            <button
              disabled={!canUndo}
              onClick={() => {
                editor.dispatchCommand(UNDO_COMMAND, undefined);
              }}
              className="toolbar-item spaced"
              aria-label="Undo"
            >
              <ArrowUturnLeftIcon className="h-4 w-4 text-black" />
            </button>
            <button
              disabled={!canRedo}
              onClick={() => {
                editor.dispatchCommand(REDO_COMMAND, undefined);
              }}
              className="toolbar-item"
              aria-label="Redo"
            >
              <ArrowUturnRightIcon className="h-4 w-4 text-black" />
            </button>
            <Divider style={{backgroundColor:'#f97316'}} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                $pinYinFloat(editor, dispatch);
              }}
              className="toolbar-item"
            >
              拼音
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                $numberFloat(editor, dispatch);
              }}
              className="toolbar-item"
            >
              数字
            </button>
            <Divider style={{backgroundColor:'#10b981'}} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                $speedFloat(editor, dispatch);
              }}
              style={{ color: selection ? "" : "#999" }}
              className="toolbar-item"
            >
              变速
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                $aliasFloat(editor, dispatch);
              }}
              style={{ color: selection ? "" : "#999" }}
              className="toolbar-item"
            >
              别名
            </button>

            <Divider style={{backgroundColor: '#84cc16'}}/>

            <button
              onClick={(e) => {
                e.stopPropagation();
                editor.update(() => {
                  const breakNode = $createBreakNode();
                  $insertNodes([breakNode]);
                });
              }}
              style={{ color: selection ? "" : "#999" }}
              className="toolbar-item"
            >
              停顿
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                editor.update(() => {
                  const breakNode = $createBreakNode();
                  $insertNodes([breakNode]);
                });
              }}
              style={{ color: selection ? "" : "#999" }}
              className="toolbar-item"
            >
              静音
            </button>

            <Divider style={{backgroundColor: '#0ea5e9'}} />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setVoiceModal((prev) => {
                  return {
                    ...prev,
                    open: true
                  };
                });
                // editor.update(() => {
                //   const breakNode = $createBreakNode();
                //   $insertNodes([breakNode]);
                // });
              }}
              style={{ color: selection ? "" : "#999" }}
              className="toolbar-item"
            >
              主播
            </button>

            {/* <button
          onClick={(e) => {
            e.stopPropagation();
            editor.update(() => {
              const breakNode = $createBreakNode();
              $insertNodes([breakNode]);
            });
          }}
          style={{ color: selection ? "" : "#999" }}
          className="toolbar-item"
        >
          符号静音
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            editor.update(() => {
              const breakNode = $createBreakNode();
              $insertNodes([breakNode]);
            });
          }}
          style={{ color: selection ? "" : "#999" }}
          className="toolbar-item"
        >
          段落静音
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            editor.update(() => {
              const breakNode = $createBreakNode();
              $insertNodes([breakNode]);
            });
          }}
          style={{ color: selection ? "" : "#999" }}
          className="toolbar-item"
        >
          解说模式
        </button>

        <Divider /> */}

            {/* <button
          onClick={(e) => {
            e.stopPropagation();
            editor.update(() => {
              const selection = $getSelection();
              if (!$isRangeSelection(selection)) {
                return;
              }
              const nodes = selection.extract();

              let prevParent: ElementNode | SpeedNode | null = null;

              const speedNode = $createSpeedNode("0.95");

              // 选择的内容都要加入到speedNode

              nodes.forEach((node) => {
                const parent = node.getParent();
                if ($isSpeedNode(parent)) {
                  console.log("parent", parent, node);
                  return;
                } else if ($isSpeedNode(node)) {
                  console.log("node", parent, node);
                  // 嵌套的node需要单独搞出来
                  const children = node.getChildren();
                  for (let i = 0; i < children.length; i++) {
                    speedNode.append(children[i]);
                  }
                  node.remove();
                } else {
                  node.insertBefore(speedNode);
                  speedNode.append(node);
                }
              });
            });
          }}
          style={{ color: selection ? "" : "#999" }}
        >
          测试
        </button>

        <button
          onClick={(e) => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            console.log("htmlString", htmlString);
          }}
          style={{ color: selection ? "" : "#999" }}
        >
          导出
        </button> */}
          </div>

          {/*  */}
          <div className="flex space-x-4  items-center">
            <Button
              onClick={(e) => {
                e.preventDefault();
                getContent();
                getSsml();
              }}
              type="primary"
              shape="round"
              icon={<PlayCircleFilled />}
            >
              试听
            </Button>
            <Button
              onClick={(e) => {
                const editorState = editor.getEditorState();
                const state = JSON.stringify(editorState);
                const json = JSON.parse(state);
                console.log("state", state, json);
              }}
              type="primary"
              ghost
              shape="round"
              icon={<CustomerServiceOutlined />}
            >
              合成
            </Button>
            <Button shape="round" icon={<DownloadOutlined />}>
              下载
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function $getAncestor<NodeType extends LexicalNode = LexicalNode>(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => ancestor is NodeType
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
    parent = parent.getParentOrThrow();
  }
  return predicate(parent) ? parent : null;
}
