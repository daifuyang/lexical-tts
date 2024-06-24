"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import PinyinPlugin from "./plugins/PinyinPlugin";
import NumberPlugin from "./plugins/NumberPlugin";
import VoicePlugin from "./plugins/VoicePlugin";

import theme from "./theme";

import "./index.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { closeFloat } from "@/redux/slice/initialState";

import { PinyinNode } from "./nodes/PinyinNode";
import { SpeedNode } from "./nodes/SpeedNode";
import { NumberNode } from "./nodes/NumberNode";
import { BreakNode } from "./nodes/BreakNode";
import { VoiceNode } from "./nodes/VoiceNode";
import SpeedPlugin from "./plugins/SpeedPlugin";
import AliasPlugin from "./plugins/AliasPlugin";

const FloatingEditorPlugin = dynamic(() => import("./plugins/FloatingEditorPlugin"), {
  ssr: false
});

const FloatingVoicePlugin = dynamic(() => import("./plugins/FloatingVoicePlugin"), {
  ssr: false
});

function Placeholder() {
  return <div className="editor-placeholder">请输入文字内容</div>;
}

const editorConfig = {
  namespace: "editor",
  editorState:'{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"配","type":"pinyin","version":1,"pinyin":"pèi"},{"detail":0,"format":0,"mode":"normal","style":"","text":"音","type":"pinyin","version":1,"pinyin":"yīn"},{"detail":0,"format":0,"mode":"normal","style":"","text":"主播","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"选择","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"speed","version":1,"speed":6}],"direction":null,"format":"","indent":0,"type":"voice","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
  nodes: [PinyinNode, NumberNode, BreakNode, SpeedNode, VoiceNode],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme
};

export default function Editor() {
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
        <div className="editor-container">
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
          <SpeedPlugin />
          <AliasPlugin />
          <VoicePlugin />
          <FloatingEditorPlugin anchorElem={floatingAnchorElem} />
          <FloatingVoicePlugin />
          <TreeViewPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
