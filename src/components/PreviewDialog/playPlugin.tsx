import React from "react";
import { mergeSentenceNodes, recursionNodes } from "@/lib/sample";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { fetchUsageStats } from "@/redux/slice/memberState";
import { getSample } from "@/services/sample";
import { formatNumber } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $getSelection, EditorState } from "lexical";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface PlayPluginProps {
  playing: boolean;
  onChange: (playing: boolean) => void;
}
export function PlayPlugin(props: PlayPluginProps): React.ReactNode {
  const [editor] = useLexicalComposerContext();
  const { playing, onChange } = props;

  const dispatch = useAppDispatch();
  const voiceState = useAppSelector((state) => state.voiceState);
  const memberState = useAppSelector((state) => state.memberState);
  const voiceName = voiceState.globalVoice?.shortName || "zh-CN-XiaoxiaoNeural";

  const [playIndex, setPlayIndex] = useState(0);
  const [playList, setPlayList] = useState<Record<number, string>>({});

  const [nodeMap, setNodeMap] = useState<Record<string, any>>({});
  const [playEditorState, setPlayEditorState] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);

    const searchParams = useSearchParams();
  
    const workId = searchParams.get("id");

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

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      const paragraphNodes = recursionNodes(root.getChildren());
      let sentenceNodes = [];
      let keyMap: any = {};
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
      setNodeMap(keyMap);
      setPlayEditorState(sentenceNodes);
      return null;
    });
  }, [editor]);

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

          getSample({ workId, editorState, voiceName }).then((res: any) => {
            if (res.code === 1) {
              setPlayList((prevList) => ({
                ...prevList,
                [page]: res.data.prevPath
              }));
              dispatch(fetchUsageStats(Number(workId)));
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

      // 获取当前音频播放状态
      if (!audio.paused) {
        audio.pause();
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
        onChange?.(false);
        setPlayIndex(0);
      }
    };

    audio.addEventListener("ended", handleAudioEnded);
    return () => {
      audio.removeEventListener("ended", handleAudioEnded);
    };
  }, [playIndex, playList, playing]);

  const updateIndex = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      if (!selection) {
        return;
      }
      let nodeKey = "";
      const nodes = selection.getNodes();
      if (nodes.length > 0) {
        nodeKey = nodes[0].getKey();
      }

      const index = nodeMap[nodeKey];
      
      if (index !== undefined) {
        editor.update(() => {
          // 清空上一次的
          const prevPlay = playEditorState[playIndex];
          if (prevPlay) {
            for (const node of prevPlay) {
              node.setStyle("");
            }
          }
          const currentPlay = playEditorState[index];
          for (const node of currentPlay) {
            node.setStyle("color:green");
          }
        });

        setPlayIndex(index);
        onChange?.(true);
      }
    });
  }, [editor, playIndex, nodeMap]);

  useEffect(() => {
    document.addEventListener("selectionchange", updateIndex);
    return () => {
      document.removeEventListener("selectionchange", updateIndex);
    };
  }, [updateIndex]);

  return (
    <div className="flex flex-col gap-2">
      <audio ref={audioRef} className="w-full">
        <source type="audio/mpeg" />
        Your browser does not support this audio format.
      </audio>
      {memberState.usageStats && (
        <div className="absolute bottom-20 right-4 text-sm text-gray-500 bg-white/80 px-2 py-1 rounded">
          <div>已用: {formatNumber(memberState.usageStats.totalUsed)}</div>
          <div>剩余: {formatNumber(memberState.usageStats.remaining)}</div>
        </div>
      )}
    </div>
  );
}
