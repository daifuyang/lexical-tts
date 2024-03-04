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
  TextNode
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import * as React from "react";

import { Tag } from "antd";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { setInitialState } from "@/redux/slice/initialState";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useRef } from "react";

export type SerializedPinyinNode = Spread<
  {
    pinyin: string;
    text: string;
  },
  SerializedLexicalNode
>;

const Component = (props: any) => {

  const dispatch = useDispatch();
  const { pinyin, text } = props;
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <>
      <Tag
        onClick={(e) => {
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
                type: "pinyin",
                selectionText: text,
                value: pinyin,
                domRect
              })
            );
          }
        }}
        className={clsx({
          "editor-tag": true,
          "editor-pinyin-tag": true,
          "editor-green-tag": true
        })}
        color="green"
      >
        {pinyin}
      </Tag>
      <span ref={ref}>{text}</span>
    </>
  );
};

export class PinyinNode extends DecoratorNode<JSX.Element> {
  __pinyin: string;
  __text: string;

  constructor(pinyin: string, text: string, key?: NodeKey) {
    super(key);
    this.__pinyin = pinyin;
    this.__text = text;
  }

  static getType(): string {
    return "pinyin";
  }

  setPinyin(pinyin: string) {
    const writable = this.getWritable();
    writable.__pinyin = pinyin;
  }

  static clone(node: PinyinNode): PinyinNode {
    return new PinyinNode(node.__pinyin, node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedPinyinNode): PinyinNode {
    const node = $createPinyinNode(serializedNode.pinyin, serializedNode.text);
    return node;
  }

  exportJSON(): SerializedPinyinNode {
    return {
      ...super.exportJSON(),
      pinyin: this.__pinyin,
      text: this.__text,
      type: this.getType(),
      version: 1
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement("span");
    addClassNamesToElement(element, config.theme.pinyin);
    return element;
  }

  updateDOM(): false {
    return false;
  }

  getTextContent(): string {
    return this.__text;
  }

  decorate(): JSX.Element {
    return <Component pinyin={this.__pinyin} text={this.__text} />;
  }
}

export function $createPinyinNode(pinyin: string, text: string): PinyinNode {
  return $applyNodeReplacement(new PinyinNode(pinyin, text));
}

export function $isPinyinNode(
  node: PinyinNode | LexicalNode | null | undefined
): node is PinyinNode {
  return node instanceof PinyinNode;
}

export function togglePinYin(pinyin: string): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }

  const nodes = selection.extract();
  if (nodes.length > 0) {
    const node = nodes[0];

    let pinyinNode = $getAncestor(node, $isPinyinNode)
    if(pinyinNode) {
      pinyinNode.setPinyin(pinyin)
    }else {
      pinyinNode = $createPinyinNode(pinyin, (node as TextNode).__text);
      node.insertBefore(pinyinNode);
      node.remove();
    }

  }
}

function $getAncestor<NodeType extends LexicalNode = LexicalNode>(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => ancestor is NodeType,
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
    parent = parent.getParentOrThrow();
  }
  return predicate(parent) ? parent : null;
}
