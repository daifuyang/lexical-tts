import { $isCodeHighlightNode } from '@lexical/code';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useCallback, useEffect } from "react";
import { getSelectedNode } from "../utils/getSelectedNode";
import { mergeRegister } from '@lexical/utils';
import { useAppDispatch } from '@/redux/hook';
import { closeFloat } from '@/redux/slice/initialState';

export default function InitPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    const dispatch = useAppDispatch() 

    const updateInit = useCallback(() => {

        editor.getEditorState().read(() => {
            if (editor.isComposing()) {
                return;
            }
            const selection = $getSelection();
            const nativeSelection = window.getSelection();
            if(nativeSelection == null || selection == null) {
                console.log('close')
                dispatch(closeFloat());
                return;
            }
            
            const rawTextContent = selection?.getTextContent().replace(/\n/g, '');
            console.log('rawTextContent',rawTextContent)
            if (!rawTextContent) {
                console.log('close')
                dispatch(closeFloat());
                return;
            }
        })

    }, [editor])

    useEffect(() => {
        document.addEventListener('selectionchange', updateInit);
        return () => {
            document.removeEventListener('selectionchange', updateInit);
        };
    }, [updateInit]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(() => {
                updateInit();
            })
        );
    }, [editor, updateInit]);

    return null
}