"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import PinyinPlugin from "./plugins/PinyinPlugin";
import NumberPlugin from "./plugins/NumberPlugin";
import { PinyinNode } from "./nodes/PinyinNode";
import { NumberNode } from "./nodes/NumberNode";
import theme from "./theme";

import "./index.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { closeFloat, setFloatType } from "@/redux/slice/initialState";
import Provider from "@/redux/provider";
// import FloatingPinyinEditorPlugin from "./plugins/FloatingPinyinEditorPlugin";

const FloatingEditorPlugin = dynamic(() => import("./plugins/FloatingEditorPlugin"), {
  ssr: false
});

function Placeholder() {
  return <div className="editor-placeholder">请输入文字内容</div>;
}

const editorConfig = {
  namespace: "editor",
  nodes: [PinyinNode, NumberNode],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme
};

function EditorMain() {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement>();
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const dispatch = useDispatch();

  return (
    <div
      onClick={(e) => {
        dispatch(closeFloat());
      }}
    >
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin />
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="editor-container"
        >
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable className="content-editable" />
                </div>
              </div>
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <PinyinPlugin />
          <NumberPlugin />
          <FloatingEditorPlugin anchorElem={floatingAnchorElem} />
          <TreeViewPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}

export default function Editor() {
  return (
    <Provider>
      <EditorMain />
    </Provider>
  );
}
