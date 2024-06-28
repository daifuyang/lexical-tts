// 多音字标注插件

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  ElementNode,
  LexicalCommand
} from "lexical";

import { useEffect } from "react";
import {
  $insertSpeed,
  $isSpeedNode,
  $removeSpeed,
  $openSpeedPopup,
  SpeedNode,
} from "../nodes/speedNode";
import { mergeRegister } from "@lexical/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { SpeedPopupPayload } from "../typings/speed";
import { $getNodeByKey } from 'lexical';

export const INSERT_SPEED_COMMAND: LexicalCommand<string> = createCommand("INSERT_SPEED_COMMAND");
export const UPDATE_SPEED_COMMAND: LexicalCommand<SpeedPopupPayload | undefined> = createCommand("UPDATE_SPEED_COMMAND");
export const REMOVE_SPEED_COMMAND: LexicalCommand<string | undefined> = createCommand("REMOVE_SPEED_COMMAND");
export const OPEN_SPEED_POPUP_COMMAND: LexicalCommand<SpeedPopupPayload | undefined> = createCommand("OPEN_SPEED_POPUP_COMMAND");

export default function SpeedPlugin(props: any) {
  const [editor] = useLexicalComposerContext();
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!editor.hasNodes([SpeedNode])) {
      throw new Error("SpeedPlugin: SpeedNode not registered on editor (initialConfig.nodes)");
    }

    const unregister = mergeRegister(
      editor.registerCommand(
        INSERT_SPEED_COMMAND,
        (payload: string) => {
          $insertSpeed(payload);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        UPDATE_SPEED_COMMAND,
        (payload: SpeedPopupPayload) => {

          const { key, speed } = payload
          const node = $getNodeByKey(key)
          if ($isSpeedNode(node)) {
            node.setSpeed(Number(speed))
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        REMOVE_SPEED_COMMAND,
        (key) => {
          $removeSpeed(key);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<SpeedPopupPayload>(
        OPEN_SPEED_POPUP_COMMAND,
        (payload) => {
          $openSpeedPopup(dispatch, payload);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )

    return () => {
      unregister();
    };

  }, [editor]);

  return null;
}
