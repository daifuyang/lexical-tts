// 多音字标注插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_EDITOR,
} from "lexical";

import { useEffect } from "react"
import { SpeedNode, TOGGER_SPEED_COMMAND } from "../nodes/SpeedNode";

interface Payload {
  data: {
    value: string;
    type: string;
  };
}


export default function SpeedPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([SpeedNode])) {
      throw new Error("SpeedPlugin: SpeedNode not registered on editor (initialConfig.nodes)");
    }
    return editor.registerCommand(
      TOGGER_SPEED_COMMAND,
      (payload: Payload) => {
        const { data } = payload;
        console.log("data", data);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
