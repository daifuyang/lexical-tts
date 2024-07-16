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
import { useState } from "react";
import { useAppSelector } from "@/redux/hook";
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
import {OnChangePlugin} from "./plugins/onChangePlugin";
import SamplePlugin from "./plugins/SamplePlugin";
import { calculateTextLength } from "./utils/util";
import { VoiceNode } from "./nodes/voiceNode";
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
  editorState:`{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","text":"在遥远的未来，","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","text":"人","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"rén"},{"detail":0,"format":0,"mode":"normal","text":"类已经征服了星辰和大海。","type":"text","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","text":"艾琳是一","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","text":"名","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"míng"},{"children":[{"detail":0,"format":0,"mode":"normal","text":"年","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"nián"},{"detail":0,"format":0,"mode":"normal","text":"轻","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","text":"的","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"de"},{"detail":0,"format":0,"mode":"normal","text":"星际探险","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","text":"家","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"jie"}],"direction":"ltr","format":"","indent":0,"type":"wrapNode","version":1}],"direction":"ltr","format":"","indent":0,"type":"speedNode","version":1,"speed":2},{"detail":0,"format":0,"mode":"normal","style":"","text":"，她的任务是探索新发现的行星——阿尔法星。这颗星球覆盖着浓密的森林，奇异的植物在阳光下闪烁着五彩斑斓的光芒。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"一天，艾琳在一片未被探索的密林中发现了一座古老的遗迹。遗迹中央有一个神秘的石碑，上面刻着她从未见过的符号。正当她试图解读这些符号时，一道耀眼的光芒从石碑中迸发而出，将她笼罩其中。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"当光芒渐渐消散，艾琳发现自己站在一个陌生的世界里。这里的天空是紫色的，空气中弥漫着甜美的香气。","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","text":"她身边出现了一个奇怪的生物","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"，像是某种晶莹剔透的水晶兽。水晶兽友好地看着她，似乎在引导她前往未知的冒险。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"艾琳心中充满了好奇和兴奋，她决定跟随这个新朋友，开始一段未知的旅程。她不知道等待她的将是危险还是奇迹，但她知道，这将是她一生中最难忘的冒险。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`
  //   '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"在当今快速发展的全球市场中，**[公司名称]**始终走在创新的前沿。自成立以来，我们致力于为客户提供最优质的产品和最全面的服务。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"我们的成功源于一支富有激情和6666创新精神的团","type":"text","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"队。","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"每","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"měi"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"一","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"yī"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"位","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"wèi"},{"detail":0,"format":0,"mode":"normal","style":"","text":"员工都6666在","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"666","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"symbolNode","version":1,"value":"六六六","readType":"序列"},{"detail":0,"format":0,"mode":"normal","style":"","text":"自己的","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"wrapNode","version":1}],"direction":null,"format":"","indent":0,"type":"speedNode","version":1,"speed":-2},{"detail":0,"format":0,"mode":"normal","style":"","text":"岗位上发挥着至关重要的作用。他们的努力和奉献，使得**[公司名称]**成为行业的领导者。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"技术创新是我们发展的核心动力。我们拥有","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"一","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"yī"},{"detail":0,"format":0,"mode":"normal","style":"","text":"流","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"的","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"dì"},{"detail":0,"format":0,"mode":"normal","style":"","text":"研发团队","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"666","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"symbolNode","version":1,"value":"六六六","readType":"序列"},{"detail":0,"format":0,"mode":"normal","style":"","text":"，配备了最先进的设备和技术。通过不断的研发和创新，我们推出了一系列在市场上具有竞争力的产品。这些产品不仅满足了客户的需求，更超越了他们的期望。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"在**[公司名称]**，我们深知客户的成功就是我们的成功。因此，我们始终以客户为中心，提供个性化的解决方案和全方位的支持服务。无论是在售前咨询、售中服务还是售后支持，我们都力求做到最好，确保每一位客户的满意。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"绿色环保是我们的企业责任。我们在生产过程中严格遵守环保法规，采用环保材料，力求将对环境的影响降到最低。我们的目标是实现可持续发展，为后代留下一个美好的地球。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"感谢您对**[公司名称]**的关注与支持，让我们携手并进，共创美好未来！","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
};

function App() {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const [total, setTotal] = useState(0);

  const type = useAppSelector((state) => state.initialState.floatEditType);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
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
            <OnChangePlugin onChange={(editorState) => {
                if(editorState) {
                    editorState.read( () => {
                        const node = editorState.toJSON() 
                        const total = calculateTextLength(node.root)
                        setTotal(total);
                    })
                }
            }} />
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
