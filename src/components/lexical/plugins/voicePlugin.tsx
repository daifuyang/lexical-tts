"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";

import { useAppDispatch } from "@/redux/hook";
import { fetchDefaultVoice, setGlobalVoice } from "@/redux/slice/voiceState";

import { message, type TabsProps } from "antd";
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand
} from "lexical";

import VoiceModal from "./voiceModal";
import { $isSpeedNode } from "../nodes/speedNode";
import { $insertVoice, VoiceNode } from "../nodes/voiceNode";
import { InsertVoicePayload, OpenVoicePayload } from "../typings/voice";
import { $getWrapChildren } from "../nodes/wrapNode";

export const INSERT_VOICE_COMMAND: LexicalCommand<InsertVoicePayload> = createCommand("INSERT_VOICE_COMMAND");
export const OPEN_VOICE_MODAL_COMMAND: LexicalCommand<OpenVoicePayload | undefined> = createCommand(
  "OPEN_VOICE_MODAL_COMMAND"
);
export const REMOVE_VOICE_COMMAND: LexicalCommand<OpenVoicePayload | undefined> = createCommand(
  "REMOVE_VOICE_COMMAND"
);

export default function VoicePlugin() {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [voiceType, setVoiceType] = useState<"global" | undefined>();

  const onChange = (key: string) => {
    console.log(key);
  };

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VoiceNode])) {
      throw new Error("VoicePlugin: VoiceNode not registered on editor (initialConfig.nodes)");
    }

    return mergeRegister(
      editor.registerCommand<OpenVoicePayload>(
        OPEN_VOICE_MODAL_COMMAND,
        (payload = {}) => {

          const {voice, type} = payload

          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }

          const text = selection.getTextContent();
          if (!text) {
            message.error("请先选中文字!");
            return false;
          }
          setVoiceType(type);
            setOpen(true);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<InsertVoicePayload>(
        INSERT_VOICE_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }
          $insertVoice(payload.name,
            payload.shortName,
            payload.style,
            payload.styleName,
            payload.rate,
            payload.volume,
            payload.pitch);
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<string>(
        REMOVE_VOICE_COMMAND,
        (payload) => {
          const voiceNode = $getNodeByKey(payload);
          if(voiceNode) {
          const children = $getWrapChildren(voiceNode);
          children.forEach((node: any) => {
            voiceNode.insertBefore(node);  
          })
          voiceNode.remove();
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
    )
  }, [editor]);

  useEffect(() => {
    dispatch(fetchDefaultVoice());
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "all",
      label: "全部主播"
    },
    {
      key: "collect",
      label: "收藏主播"
    }
  ];

  return (
    <VoiceModal
      open={open}
      onOpenChange={(togger: boolean) => {
        setOpen(togger);
      }}
      items={items}
      onChange={onChange}
      onOk={(values) => {
        if (voiceType === "global") {
          dispatch(setGlobalVoice(values));
        }else {
          editor.dispatchCommand(INSERT_VOICE_COMMAND, values);
            console.log('values',values)
        }
      }}
    />
  );
}
