"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import Theme from "./theme";
import ToolbarPlugin from "./plugins/toolbarPlugin";
import PinyinPlugin from "./plugins/pinyinPlugin";
import "./editor.css";
import { PinyinNode } from "./nodes/pinyinNode";
import { SpeedNode } from "./nodes/speedNode";
import SpeedPlugin from "./plugins/speedPlugin";
import PopupPlugin from "./plugins/popupPlugin";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import InitPlugin from "./plugins/initPlugin";
import Options from "./ui/options";
import SymbolPlugin from "./plugins/symbolPlugin";
import { SymbolNode } from "./nodes/symbolNode";
import { SampleNode } from "./nodes/sampleNode";
import { WrapNode } from "./nodes/wrapNode";
import TreeViewPlugin from "./plugins/treeViewPlugin";
import PausePlugin from "./plugins/pausePlugin";
import { PauseNode } from "./nodes/pauseNode";
import dynamic from "next/dynamic";
import { OnChangePlugin } from "./plugins/onChangePlugin";
import SamplePlugin from "./plugins/SamplePlugin";
import { calculateTextLength } from "./utils/util";
import { VoiceNode } from "./nodes/voiceNode";
import Header from "./plugins/header";

import { useSearchParams } from 'next/navigation'
import { fetchWorkDetail, setWork } from "@/redux/slice/lexicalState";

const VoicePlugin = dynamic(() => import("./plugins/voicePlugin"), { ssr: false });

function Placeholder() {
  return (
    <div className="editor-placeholder">请输入需要配音的内容，粘贴或输入文本内容，最多10000字…</div>
  );
}

const editorConfig = {
  namespace: "ttsEditor",
  nodes: [PinyinNode, SymbolNode, SpeedNode, WrapNode, PauseNode, SampleNode, VoiceNode],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: Theme,
  // editorState: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","text":"在遥远的未来，","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","text":"人","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"rén"},{"detail":0,"format":0,"mode":"normal","text":"类已经征服了星辰和大海。","type":"text","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","text":"艾琳是一","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","text":"名","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"míng"},{"children":[{"detail":0,"format":0,"mode":"normal","text":"年","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"nián"},{"detail":0,"format":0,"mode":"normal","text":"轻","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","text":"的","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"de"},{"detail":0,"format":0,"mode":"normal","text":"星际探险","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","text":"家","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"jie"},{"detail":0,"format":0,"mode":"normal","style":"","text":"，她的任务是探索新发现的行星——阿尔法星。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"wrapNode","version":1}],"direction":"ltr","format":"","indent":0,"type":"speedNode","version":1,"speed":2},{"detail":0,"format":0,"mode":"normal","style":"","text":"这颗星球覆盖着浓密的森林，奇异的植物在阳光下闪烁着五彩斑斓的光芒。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"一天，艾琳在一片未被探索的密林中发现了一座古老的遗迹。遗迹中央有一个神秘的石碑，上面刻着她从未见过的符号。正当她试图解读这些符号时，一道耀眼的光芒从石碑中迸发而出，将她笼罩其中。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"当光芒渐渐消散，艾琳发现自己站在","type":"text","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"一个陌生","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"wrapNode","version":1}],"direction":"ltr","format":"","indent":0,"type":"speedNode","version":1,"speed":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"的世界里。这里的","type":"text","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"天空是紫色的，","type":"text","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"空气中","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"wrapNode","version":1}],"direction":"ltr","format":"","indent":0,"type":"speedNode","version":1,"speed":3}],"direction":"ltr","format":"","indent":0,"type":"wrapNode","version":1}],"direction":"ltr","format":"","indent":0,"type":"voiceNode","version":1,"key":"67","name":"云希","voice":"zh-CN-YunxiNeural","style":"","rate":0,"volume":0,"pitch":0},{"detail":0,"format":0,"mode":"normal","style":"","text":"弥漫着甜美的香气。","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","text":"她身边出现了一个奇怪的生物","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"，像是某种晶莹剔透的水晶兽。水晶兽友好地看着她，似乎在引导她前往未知的冒险。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"艾琳心中充满了好奇和兴奋，她决定跟随这个新朋友，开始一段未知的旅程。她不知道等待她的将是危险还是奇迹，但她知道，这将是她一生中最难忘的冒险。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`
  };

function App() {

  const dispatch = useAppDispatch();

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const [total, setTotal] = useState(0);

  const type = useAppSelector((state) => state.initialState.floatEditType);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const searchParams = useSearchParams()
 
  const id = searchParams.get('id')

  const work: any = useAppSelector((state) => state.lexicalState.work);

  useEffect( () => {
    if(id) {
      dispatch(fetchWorkDetail(Number(id)))
      return
    }
    
    if(work) {
      dispatch(setWork(null))
    }

  }, [id])

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <Header />
        <ToolbarPlugin total={total} />
        <div className="editor-container">
          <div ref={onRef} className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <PinyinPlugin />
            <SymbolPlugin />
            <SpeedPlugin />
            <PausePlugin />
            <VoicePlugin />
            <InitPlugin />
            <SamplePlugin />
            <OnChangePlugin
              onChange={(editorState) => {
                if (editorState) {
                  editorState.read(() => {
                    const node = editorState.toJSON();
                    const total = calculateTextLength(node.root);
                    setTotal(total);
                  });
                }
              }}
            />
            {type && floatingAnchorElem && (
              <PopupPlugin anchorElem={floatingAnchorElem}>
                <Options />
              </PopupPlugin>
            )}
            {/* <TreeViewPlugin /> */}
          </div>

          <div className="absolute right-10 bottom-6">
            <span>{total}</span> / 10000 字
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}

export default App;
