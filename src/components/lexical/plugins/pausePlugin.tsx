import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $getNodeByKey, $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from "lexical";
import { $createPauseNode, PauseNode } from "../nodes/pauseNode";

interface UpdatePausePayload {
    key: string;
    value: number;
}
export const INSERT_PAUSE_COMMAND: LexicalCommand<number> = createCommand('INSERT_PAUSE_COMMAND');
export const UPDATE_PAUSE_COMMAND: LexicalCommand<UpdatePausePayload> = createCommand('UPDATE_PAUSE_COMMAND');

export default function PausePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([PauseNode])) {
            throw new Error(
                'PausePlugin: PauseNode is not registered on editor',
            );
        }

        return mergeRegister(
            editor.registerCommand<number>(
                INSERT_PAUSE_COMMAND,
                (payload) => {
                    const selection = $getSelection();
                    if (!$isRangeSelection(selection)) {
                        return false;
                    }
                    const pauseNode = $createPauseNode(payload)
                    selection.insertNodes([pauseNode])
                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
            editor.registerCommand<UpdatePausePayload>(
                UPDATE_PAUSE_COMMAND,
                (payload) => {
                    const {key,value} = payload;
                    const pauseNode = $getNodeByKey(key);
                    if(pauseNode) {
                        (pauseNode as PauseNode).setTime(value);
                    }
                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
        );
    }, [editor]);

    return null;
}