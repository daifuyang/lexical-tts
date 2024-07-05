"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";

import type { TabsProps } from "antd";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from "lexical";

import VoiceModal from "./voiceModal";

export const OPEN_VOICE_MODAL_COMMAND: LexicalCommand<undefined> = createCommand('OPEN_VOICE_MODAL_COMMAND');

export default function VoicePlugin() {

  const [open, setOpen] = useState(false)

  const onChange = (key: string) => {
    console.log(key);
  };

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
      
      return mergeRegister(
          editor.registerCommand<number>(
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
    }} items={items} onChange={onChange} />
  );
}
