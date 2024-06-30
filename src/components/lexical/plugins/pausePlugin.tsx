import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from "lexical";
import { $createPauseNode, PauseNode } from "../nodes/pauseNode";

export const INSERT_PAUSE_COMMAND: LexicalCommand<undefined> = createCommand('INSERT_PAUSE_COMMAND');

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

                    console.log('payload',payload)

                    const selection = $getSelection();

                    if (!$isRangeSelection(selection)) {
                        return false;
                    }

                    const focusNode = selection.focus.getNode();
                    if (focusNode !== null) {
                        const pauseNode = $createPauseNode(payload)
                        focusNode.insertAfter(pauseNode)
                    }

                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
        );
    }, [editor]);

    return null;
}