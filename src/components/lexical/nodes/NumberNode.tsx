import {
  DecoratorNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
  Spread,
  $applyNodeReplacement,
  $getSelection,
  $isRangeSelection,
  SerializedLexicalNode,
  TextNode,
  $isTextNode,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
  $isNodeSelection,
  $getNodeByKey
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import * as React from "react";

import { Tag, message } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import clsx from "clsx";
import { useDispatch } from "react-redux";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { setInitialState } from "@/redux/slice/initialState";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import { useEffect } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { getDomRect } from "../utils/dom";

export type SerializedNumberNode = Spread<
  {
    value: string;
    type: string;
    text: string;
  },
  SerializedLexicalNode
>;

const Component = (props: any) => {
  const dispatch = useDispatch();
  const { value, vType, text, nodeKey } = props;
  const ref = React.useRef<HTMLSpanElement>(null);

  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event: MouseEvent & { target: any }) => {
          const { nodekey: eventNodeKey } = event.target?.dataset || {};
          if (eventNodeKey === nodeKey) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );

    return () => {
      isMounted = false;
      unregister();
    };
  }, [clearSelection, isSelected, editor]);

  useEffect(() => {
    editor.update(() => {
      if (ref.current) {
        const node = $getNodeByKey(nodeKey);
        if ($isNumberNode(node) && ref.current != node.getTextElem()) {
          node.setTextElem(ref.current);
        }
      }
    });
  }, [ref, editor]);

  return (
    <span onClick={ (e) => {
      e.stopPropagation()
      clearSelection();
      setSelected(true);
      $numberFloat(editor,dispatch)
    } }>
      <Tag
        bordered={false}
        closeIcon={<CloseCircleOutlined style={{ color: "#389e0d", fontSize: 14 }} />}
        onClose={(e) => {
          e.preventDefault();
          editor.update(() => {
            // 删除
          });
        }}
        className={clsx({
          "editor-tag": true,
          "editor-number-tag": true,
          "editor-green-tag": true
        })}
        color="green"
      >
        {vType}
      </Tag>
      <br />
      <span data-nodekey={nodeKey} className={clsx({ text: true, selected: isSelected })} ref={ref}>
        {text}
      </span>
    </span>
  );
};

export class NumberNode extends DecoratorNode<JSX.Element> {
  __value: string;
  __vType: string;
  __text: string;
  __textElem?: HTMLSpanElement;

  constructor(
    value: string,
    type: string,
    text: string,
    textElem?: HTMLSpanElement,
    key?: NodeKey
  ) {
    super(key);
    this.__value = value;
    this.__vType = type;
    this.__text = text;
    this.__textElem = textElem;
  }

  static getType(): string {
    return "number";
  }

  getText() {
    return this.__text;
  }

  getValue() {
    return this.__value;
  }

  setValue(value: string) {
    const writable = this.getWritable();
    writable.__value = value;
  }

  getVType() {
    return this.__vType;
  }

  setVType(vType: string) {
    const writable = this.getWritable();
    writable.__vType = vType;
  }

  getTextElem() {
    return this.__textElem;
  }

  setTextElem(elem: HTMLSpanElement) {
    const writable = this.getWritable();
    writable.__textElem = elem;
  }

  static clone(node: NumberNode): NumberNode {
    return new NumberNode(node.__value, node.__vType, node.__text, node.__textElem, node.__key);
  }

  static importJSON(serializedNode: SerializedNumberNode): NumberNode {
    const node = $createNumberNode(serializedNode.value, serializedNode.type, serializedNode.text);
    return node;
  }

  exportJSON(): SerializedNumberNode {
    return {
      ...super.exportJSON(),
      value: this.__value,
      text: this.__text,
      type: this.getType(),
      version: 1
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement("span");
    addClassNamesToElement(element, config.theme.number, "editor-span");
    return element;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): boolean {
      return true
  }

  decorate(): JSX.Element {
    return (
      <Component
        nodeKey={this.getKey()}
        text={this.getText()}
        vType={this.getVType()}
        value={this.getValue()}
      />
    );
  }
}

export function $createNumberNode(value: string, type: string, text: string): NumberNode {
  return $applyNodeReplacement(new NumberNode(value, type, text));
}

export function $isNumberNode(
  node: NumberNode | LexicalNode | null | undefined
): node is NumberNode {
  return node instanceof NumberNode;
}

export function $addNumber(value: string, type: string): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.extract();
  if (nodes.length > 0) {
    const node = nodes[0];
    if ($isTextNode(node)) {
      const numberNode = $createNumberNode(value, type, (node as TextNode).__text);
      node.insertBefore(numberNode);
      node.remove();
      numberNode.selectEnd();
    }
  }
}

export function $numberFloat(editor: LexicalEditor, dispatch: Dispatch<any>): void {
  // 新增编辑逻辑合并，打开拼音选择弹窗

  editor.update(() => {
    const selection = $getSelection();
    if (selection) {
      if ($isNodeSelection(selection)) {
        // 修改更新
        const nodes = selection.extract();
        if (nodes.length > 0) {
          const numberNode = nodes[0];

          if ($isNumberNode(numberNode)) {
            const nodeKey = numberNode.getKey();
            const text = numberNode.getText();
            const value = numberNode.getValue();
            const elem = numberNode.getTextElem();
            const domRect = getDomRect(elem);

            if (domRect) {
              dispatch(
                setInitialState({
                  type: "symbol",
                  selectionText: text,
                  value,
                  nodeKey,
                  domRect
                })
              );
            }
          }
        }

        return;
      }

      const text = selection?.getTextContent();
      if (!/^\d+(\.\d+)?$/.test(text)) {
        message.error("请选择连贯数字！");
        return;
      }
      dispatch(setInitialState({ type: "symbol", selectionText: text, value: undefined }));
    }
  });
}
