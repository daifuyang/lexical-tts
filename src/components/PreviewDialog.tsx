"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
import { editorConfig } from "./lexical";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

interface PreviewDialogProps {
  children: React.ReactNode;
  total: number;
  editorState: EditorState;
}

export function PreviewDialog({ children, total, editorState }: PreviewDialogProps) {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  const [playList, setPlayList] = useState<Record<number, string>>({});
  const [playEditorState, setPlayEditorState] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const voiceState = useAppSelector((state) => state.voiceState);
  const voiceName = voiceState.globalVoice?.shortName || "zh-CN-XiaoxiaoNeural";

  const playAudio = () => {
    if (audioRef.current?.paused) {
      try {
        audioRef.current?.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current?.paused) {
      audioRef.current?.pause();
    }
  };

  const handlePlayList = async () => {
    if (playEditorState?.length > 0) {
      editor.update(() => {
        const preloadNodes = playEditorState.slice(playIndex, playIndex + 1);
        for (let index = 0; index < preloadNodes.length; index++) {
          const page = playIndex + index;

          if (playList[page]) {
            continue;
          }

          const node: any = preloadNodes[index];
          const paragraph = {
            type: "paragraph",
            children: node.map((children: any) => children.exportJSON())
          };
          const editorState = JSON.stringify([paragraph]);

          getSample({ editorState, voiceName }).then((res: any) => {
            if (res.code === 1) {
              setPlayList((prevList) => ({
                ...prevList,
                [page]: res.data.prevPath
              }));
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    handlePlayList();
  }, [playEditorState, playIndex, voiceName]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playing) {
      pauseAudio();
      return;
    }

    const currentSrc = playList[playIndex];
    if (currentSrc && currentSrc !== audio.src) {
      if (playing) {
        pauseAudio();
      }

      audio.src = currentSrc;
      playAudio();

      editor.update(() => {
        const currentPlay = playEditorState[playIndex];
        for (const node of currentPlay) {
          node.setStyle("color:green");
        }
      });
    }

    const handleAudioEnded = () => {
      editor.update(() => {
        const currentPlay = playEditorState[playIndex];
        for (const node of currentPlay) {
          node.setStyle("");
        }
      });

      const nextIndex = playIndex + 1;
      if (nextIndex < playEditorState.length) {
        setPlayIndex(nextIndex);
      } else {
        setPlaying(false);
        setPlayIndex(0);
      }
    };

    audio.addEventListener("ended", handleAudioEnded);
    return () => {
      audio.removeEventListener("ended", handleAudioEnded);
    };
  }, [playIndex, playList, playing]);

  const startPreview = () => {
    if (!total) {
      message.error("请先输入配音内容！");
      return;
    }

    setOpen(true);
    setPlaying(false);
    setPlayIndex(0);
    setPlayList({});

    editor.update(() => {
      const root = $getRoot();
      const selection = $getSelection();
      if (!selection) return;

      const nodes = selection.getNodes();
      const nodeKey = nodes.length > 0 ? nodes[0].getKey() : null;

      const paragraphNodes = recursionNodes(root.getChildren());
      let sentenceNodes = [];
      let keyMap: Record<string, number> = {};
      let index = 0;

      for (const nodes of paragraphNodes) {
        const sentenceNode = mergeSentenceNodes(nodes.children);
        for (const nodes of sentenceNode) {
          for (const node of nodes) {
            const key = node.getKey();
            keyMap[key] = index;
          }
          index++;
          sentenceNodes.push(nodes);
        }
      }

      setPlayEditorState(sentenceNodes);
      if (nodeKey) {
        setPlayIndex(keyMap[nodeKey]);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">音频预览</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col flex-1 overflow-y-auto">
     
            <LexicalComposer
              initialConfig={{ ...editorConfig, editorState: JSON.stringify(editorState) }}
            >
                <RichTextPlugin
                  contentEditable={<ContentEditable />}
                  ErrorBoundary={LexicalErrorBoundary}
                />
            </LexicalComposer>

            <audio ref={audioRef} className="w-full">
              <source type="audio/mpeg" />
              Your browser does not support this audio format.
            </audio>

            <div className="flex gap-2">
              <Button onClick={() => setPlaying(!playing)} disabled={!playEditorState.length}>
                {playing ? "暂停" : "播放"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPlaying(false);
                  setPlayIndex(0);
                }}
              >
                重置
              </Button>
    
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
