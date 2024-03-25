import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  BaseSelection,
  ElementNode,
  LexicalNode,
  REDO_COMMAND,
  UNDO_COMMAND
} from "lexical";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { $numberFloat } from "../nodes/NumberNode";
import { $pinYinFloat } from "../nodes/PinyinNode";
import { $speedFloat } from "../nodes/SpeedNode";

import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/24/outline";
import { $createBreakNode } from "../nodes/BreakNode";

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [selection, setSelection] = useState<BaseSelection | null>(null);

  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      const _selection = $getSelection();
      if (selection !== _selection) {
        setSelection(_selection);
      }
    });
  });

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
        <Divider />
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
        <Divider />

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
            $speedFloat(editor, dispatch);
          }}
          style={{ color: selection ? "" : "#999" }}
          className="toolbar-item"
        >
          别名
        </button>

        <Divider />

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

        <Divider />

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
    </div>
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
