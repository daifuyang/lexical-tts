import { useEffect } from "react";
import {
  createCommand,
  LexicalCommand,
  COMMAND_PRIORITY_EDITOR
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { useAppDispatch } from "@/redux/hook";
import { $insertSymbol, $openSymbolPopup, SymbolNode } from "../nodes/symbolNode";

export interface SymbolItem {
  label?: string;
  value: string;
  type: string;
} 

export const INSERT_SYMBOL_COMMAND: LexicalCommand<SymbolItem> = createCommand("INSERT_SYMBOL_COMMAND");
export const OPEN_SYMBOL_POPUP_COMMAND: LexicalCommand<string> = createCommand("OPEN_SYMBOL_POPUP_COMMAND");

export default function SymbolPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!editor.hasNodes([SymbolNode])) {
      throw new Error(
        "SymbolPlugin: SymbolNode not registered on editor (initialConfig.nodes)",
      );
    }

    const unregister = mergeRegister(
      editor.registerCommand<string>(
        OPEN_SYMBOL_POPUP_COMMAND,
        (payload) => {
          $openSymbolPopup(dispatch, payload)
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<SymbolItem>(
        INSERT_SYMBOL_COMMAND,
        (payload) => {
          $insertSymbol(payload);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      )
    )

    return () => {
      unregister();
    };

  }, [editor]);

  return null;
}
