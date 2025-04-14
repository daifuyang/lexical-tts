import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND
} from "lexical";
import * as React from "react";
import { useCallback, useEffect, type JSX } from "react";
import { createPortal } from "react-dom";
import { getDOMRangeRect } from "../utils/dom";
import { setPopupPosition } from "../utils/setPopupPosition";
import { mergeRegister } from "@lexical/utils";

interface PopopProps {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  children?: React.ReactNode;
}

function Popup(props: PopopProps) {
  const { editor, anchorElem, children } = props;
  const popupCharStylesEditorRef = React.useRef<HTMLDivElement | null>(null);
  function mouseMoveListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current && (e.buttons === 1 || e.buttons === 3)) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "none") {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = "none";
        }
      }
    }
  }

  function mouseUpListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "auto") {
        popupCharStylesEditorRef.current.style.pointerEvents = "auto";
      }
    }
  }

  const $updatePopup = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
      setPopupPosition(rangeRect, popupCharStylesEditorElem, anchorElem);
    }
  }, [editor, anchorElem]);

  useEffect(() => {
    const ro = new ResizeObserver((entries, observer) => {
      editor.getEditorState().read(() => {
        $updatePopup();
      });
    });

    if (popupCharStylesEditorRef?.current) {
      document.addEventListener("mousemove", mouseMoveListener);
      document.addEventListener("mouseup", mouseUpListener);

      ro.observe(popupCharStylesEditorRef.current);

      return () => {
        document.removeEventListener("mousemove", mouseMoveListener);
        document.removeEventListener("mouseup", mouseUpListener);
        ro.disconnect();
      };
    }
  }, [popupCharStylesEditorRef]);


  useEffect(() => {
    editor.getEditorState().read(() => {
      $updatePopup();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updatePopup();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updatePopup();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updatePopup]);

  return (
    <div ref={popupCharStylesEditorRef} className="lexical-popup">
      {children}
    </div>
  );
}

function usePopup(editor: LexicalEditor, anchorElem: HTMLElement, children?: React.ReactNode): JSX.Element | null {
  /*   const [isText, setIsText] = useState(false);
    const updatePopup = useCallback(() => {
      console.log('updatePopup')
      editor.getEditorState().read(() => {
        // Should not to pop up the floating toolbar when using IME input
        if (editor.isComposing()) {
          return;
        }
        const selection = $getSelection();
        const nativeSelection = window.getSelection();
        const rootElement = editor.getRootElement();
  
        if (
          nativeSelection !== null &&
          (!$isRangeSelection(selection) ||
            rootElement === null ||
            !rootElement.contains(nativeSelection.anchorNode))
        ) {
          setIsText(false);
          return;
        }
  
        if (!$isRangeSelection(selection)) {
          return;
        }
  
        const node = getSelectedNode(selection);
  
        console.log('node',node)
  
        if (!$isCodeHighlightNode(selection.anchor.getNode()) && selection.getTextContent() !== "") {
          setIsText($isTextNode(node) || $isParagraphNode(node));
        } else {
          setIsText(false);
        }
  
        const rawTextContent = selection.getTextContent().replace(/\n/g, "");
        if (!selection.isCollapsed() && rawTextContent === "") {
          setIsText(false);
          return;
        }
      });
    }, [editor]);
  
    useEffect(() => {
      document.addEventListener("selectionchange", updatePopup);
      return () => {
        document.removeEventListener("selectionchange", updatePopup);
      };
    }, [updatePopup]);
  
    useEffect(() => {
      return mergeRegister(
        editor.registerUpdateListener(() => {
          updatePopup();
        }),
        editor.registerRootListener(() => {
          if (editor.getRootElement() === null) {
            setIsText(false);
          }
        })
      );
    }, [editor, updatePopup]);
  
    console.log('usePopup isText',isText)
  
    if (!isText) {
      return null;
    } */

  if (!children) {
    return null
  }

  return createPortal(<Popup editor={editor} anchorElem={anchorElem} >{children}</Popup>, anchorElem);
}

interface Props {
  anchorElem: HTMLElement;
  children?: React.ReactNode;
}

export default function PopupPlugin(props: Props): JSX.Element | null {
  const { anchorElem = document.body, children } = props;
  const [editor] = useLexicalComposerContext();
  return usePopup(editor, anchorElem, children);
}
