// 多音字标注插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand
} from "lexical";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";
import { useAppDispatch } from "@/redux/hook";
import { SpeedPopupPayload } from "../typings/speed";
import { $getNodeByKey } from 'lexical';
import { $insertSampleNode, $isSampleNode,$removeSample, SampleNode } from "../nodes/sampleNode";

export const INSERT_SAMPLE_COMMAND: LexicalCommand<string> = createCommand("INSERT_SAMPLE_COMMAND");
export const UPDATE_SAMPLE_COMMAND: LexicalCommand<SpeedPopupPayload | undefined> = createCommand("UPDATE_SAMPLE_COMMAND");
export const REMOVE_SAMPLE_COMMAND: LexicalCommand<string | undefined> = createCommand("REMOVE_SAMPLE_COMMAND");

export default function SpeedPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!editor.hasNodes([SampleNode])) {
      throw new Error("samplePlugin: sampleNode not registered on editor (initialConfig.nodes)");
    }

    const unregister = mergeRegister(
      editor.registerCommand(
        INSERT_SAMPLE_COMMAND,
        (payload: string) => {
          $insertSampleNode();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        UPDATE_SAMPLE_COMMAND,
        (payload: SpeedPopupPayload) => {

          const { key, speed } = payload
          const node = $getNodeByKey(key)
          if ($isSampleNode(node)) {
            
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        REMOVE_SAMPLE_COMMAND,
        (key) => {
          $removeSample(key);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
    )

    return () => {
      unregister();
    };

  }, [editor]);

  return null;
}
