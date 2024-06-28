import { useEffect } from "react";
import {
  createCommand,
  LexicalCommand,
  COMMAND_PRIORITY_EDITOR
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { useAppDispatch } from "@/redux/hook";
import { $openSymbolPopup, $insertSymbol, SymbolNode, $removeSymbol } from "../nodes/symbolNode";
import { InsertSymbolPayload, RemoveSymbolPayload, SymbolPopupPayload } from "../typings/symbol";

export const INSERT_SYMBOL_COMMAND: LexicalCommand<InsertSymbolPayload> = createCommand("INSERT_SYMBOL_COMMAND");
export const REMOVE_SYMBOL_COMMAND: LexicalCommand<RemoveSymbolPayload> = createCommand("REMOVE_SYMBOL_COMMAND");

export const OPEN_SYMBOL_POPUP_COMMAND: LexicalCommand<SymbolPopupPayload> = createCommand("OPEN_SYMBOL_POPUP_COMMAND");

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
      editor.registerCommand<SymbolPopupPayload>(
        OPEN_SYMBOL_POPUP_COMMAND,
        (payload) => {
          $openSymbolPopup(dispatch, payload)
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<InsertSymbolPayload>(
        INSERT_SYMBOL_COMMAND,
        (payload) => {
          $insertSymbol(payload);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<RemoveSymbolPayload>(
        REMOVE_SYMBOL_COMMAND,
        (payload) => {
          $removeSymbol(payload);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )

    return () => {
      unregister();
    };

  }, [editor]);

  return null;
}
