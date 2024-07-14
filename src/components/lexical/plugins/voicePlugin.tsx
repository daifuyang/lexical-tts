"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";

import { useAppDispatch } from "@/redux/hook";
import { fetchDefaultVoice, setGlobalVoice } from "@/redux/slice/voiceState";

import type { TabsProps } from "antd";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from "lexical";

import VoiceModal from "./voiceModal";

export const OPEN_VOICE_MODAL_COMMAND: LexicalCommand<string> = createCommand('OPEN_VOICE_MODAL_COMMAND');

export default function VoicePlugin() {

  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false)

  const onChange = (key: string) => {
    console.log(key);
  };

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
      
      return mergeRegister(
          editor.registerCommand<string>(
            OPEN_VOICE_MODAL_COMMAND,
              (payload) => {
                  const selection = $getSelection();
                  if (!$isRangeSelection(selection)) {
                      return false;
                  }
                  setOpen(true)
                  return true;
              },
              COMMAND_PRIORITY_EDITOR,
          ),
      );
  }, [editor]);

  useEffect( () => {
    dispatch(fetchDefaultVoice());
  } ,[])


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
    <VoiceModal open={open} onOpenChange={ (togger: boolean) => {
        setOpen(togger)
    }} items={items} onChange={onChange} onOk={ (values) => {
      dispatch(setGlobalVoice(values))
    } } />
  );
}
