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
import { WrapNode } from "./nodes/wrapNode";
import TreeViewPlugin from "./plugins/treeViewPlugin";

function Placeholder() {
    return (
        <div className="editor-placeholder">
            请输入需要配音的内容，粘贴或输入文本内容，最多10000字…
        </div>
    );
}

const editorConfig = {
    namespace: "ttsEditor",
    nodes: [PinyinNode, SymbolNode, SpeedNode, WrapNode],
    // Handling of errors during update
    onError(error: Error) {
        throw error;
    },
    // The editor theme
    theme: Theme,
    editorState:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"在当今快速发展的全球市场中，**[公司名称]**始终走在创新的前沿。自成立以来，我们致力于为客户提供最优质的产品和最全面的服务。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"我们的成功源于一支富有激情和6666创新精神的团","type":"text","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"队。","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"每","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"měi"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"一","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"yī"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"位","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"wèi"},{"detail":0,"format":0,"mode":"normal","style":"","text":"员工都6666在","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"666","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"symbolNode","version":1,"value":"六六六","readType":"序列"},{"detail":0,"format":0,"mode":"normal","style":"","text":"自己的","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"wrapNode","version":1}],"direction":null,"format":"","indent":0,"type":"speed","version":1,"speed":-2},{"detail":0,"format":0,"mode":"normal","style":"","text":"岗位上发挥着至关重要的作用。他们的努力和奉献，使得**[公司名称]**成为行业的领导者。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"技术创新是我们发展的核心动力。我们拥有","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"一","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"yī"},{"detail":0,"format":0,"mode":"normal","style":"","text":"流","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"的","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"pinyinNode","version":1,"pinyin":"dì"},{"detail":0,"format":0,"mode":"normal","style":"","text":"研发团队","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"666","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"symbolNode","version":1,"value":"六六六","readType":"序列"},{"detail":0,"format":0,"mode":"normal","style":"","text":"，配备了最先进的设备和技术。通过不断的研发和创新，我们推出了一系列在市场上具有竞争力的产品。这些产品不仅满足了客户的需求，更超越了他们的期望。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"在**[公司名称]**，我们深知客户的成功就是我们的成功。因此，我们始终以客户为中心，提供个性化的解决方案和全方位的支持服务。无论是在售前咨询、售中服务还是售后支持，我们都力求做到最好，确保每一位客户的满意。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"绿色环保是我们的企业责任。我们在生产过程中严格遵守环保法规，采用环保材料，力求将对环境的影响降到最低。我们的目标是实现可持续发展，为后代留下一个美好的地球。","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"感谢您对**[公司名称]**的关注与支持，让我们携手并进，共创美好未来！","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
};

function App() {

    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

    const type = useAppSelector(state => state.initialState.floatEditType);

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    return (
        <>
            <LexicalComposer initialConfig={editorConfig}>
                <ToolbarPlugin />
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
                        <InitPlugin />
                        {type && floatingAnchorElem && <PopupPlugin anchorElem={floatingAnchorElem}>
                            <Options />
                        </PopupPlugin>}
                        <TreeViewPlugin />
                    </div>
                </div>
            </LexicalComposer>
        </>
    );
}

export default App;
