"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $getSelection, $getRoot, EditorState } from "lexical";
import { getSample } from "@/services/sample";
import { mergeSentenceNodes, recursionNodes } from "@/lib/sample";
import { useAppSelector } from "@/redux/hook";
import { message } from "antd";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { editorConfig } from "../lexical";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { PlayPlugin } from "./playPlugin";

interface PreviewDialogProps {
  children?: React.ReactNode;
  open: boolean;
  editorState: EditorState;
  onOpenChange?: (open: boolean) => void;
}

export function PreviewDialog({ children, open, onOpenChange, editorState }: PreviewDialogProps) {
  const [playing, setPlaying] = useState<boolean>(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(boolean) => {
        onOpenChange?.(boolean);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          editable: false,
          editorState
        }}
      >
        <DialogContent className="h-[80vh] w-[80vw] max-w-[1200px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">音频预览</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <RichTextPlugin
              contentEditable={<ContentEditable className="outline-none" />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <PlayPlugin playing={playing} onChange={setPlaying} />
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setPlaying(!playing);
                }}
              >
                {playing ? "暂停" : "播放"}
              </Button>
              <Button variant="outline" onClick={() => {}}>
                重置
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </LexicalComposer>
    </Dialog>
  );
}
