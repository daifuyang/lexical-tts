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
  $isTextNode
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import * as React from "react";

import { Tag } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import clsx from "clsx";
import { useDispatch } from "react-redux";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { setInitialState } from "@/redux/slice/initialState";

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
  const [editor] = useLexicalComposerContext();

  return (
    <>
      <Tag
        bordered={false}
        closeIcon={<CloseCircleOutlined style={{ color: "#389e0d", fontSize: 14 }} />}
        onClose={(e) => {
          e.preventDefault();
          editor.update(() => {
            // 删除
          });
        }}
        onClick={(e) => {
          e.stopPropagation();
          editor.update(() => {
            const rect: DOMRect | undefined = ref?.current?.getBoundingClientRect();
            if (rect) {
              const domRect = {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left
              };

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
      <span className="text" ref={ref}>{text}</span>
    </>
  );
};

export class NumberNode extends DecoratorNode<JSX.Element> {
  __value: string;
  __vType: string;
  __text: string;

  constructor(value: string, type: string, text: string, key?: NodeKey) {
    super(key);
    this.__value = value;
    this.__vType = type;
    this.__text = text;
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

  static clone(node: NumberNode): NumberNode {
    return new NumberNode(node.__value, node.__vType, node.__text, node.__key);
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
    addClassNamesToElement(element, config.theme.number,"editor-span");
    return element;
  }

  updateDOM(): false {
    return false;
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

export function addNumber(value: string, type: string): void {
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
