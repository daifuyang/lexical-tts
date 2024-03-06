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
  $createNodeSelection,
  $setSelection,
  $getNodeByKey,
  $createTextNode,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import * as React from "react";

import { Tag } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import clsx from "clsx";
import { useDispatch } from "react-redux";
import { setInitialState } from "@/redux/slice/initialState";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import { useEffect, useRef } from "react";

export type SerializedPinyinNode = Spread<
  {
    pinyin: string;
    text: string;
  },
  SerializedLexicalNode
>;

const Component = (props: any) => {
  const dispatch = useDispatch();
  const { pinyin, text, nodeKey } = props;
  const ref = useRef<HTMLSpanElement>(null);

  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const { nodekey: eventNodeKey } = event.target?.dataset || {};
          if (eventNodeKey === nodeKey) {
            if (event.shiftKey) {
              setSelected(!isSelected);              
            }else {
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

  return (
    <>
      <Tag
        bordered={false}
        closeIcon={<CloseCircleOutlined style={{ color: "#389e0d", fontSize: 14 }} />}
        onClose={(e) => {
          e.preventDefault();
          editor.update(() => {
            removePinYin(nodeKey);
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
                  type: "pinyin",
                  selectionText: text,
                  value: pinyin,
                  nodeKey,
                  domRect
                })
              );
            }
          });
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
      <br />
      <span data-nodekey={nodeKey} className={clsx({ text: true, selected: isSelected })} ref={ref}>
        {text}
      </span>
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

  getPinyin() {
    return this.__pinyin;
  }

  getText() {
    return this.__text;
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
    addClassNamesToElement(element, config.theme.pinyin, "editor-span");
    return element;
  }

  updateDOM(): false {
    return false;
  }

  getTextContent(): string {
    return this.__text;
  }

  decorate(): JSX.Element {
    return <Component nodeKey={this.getKey()} pinyin={this.__pinyin} text={this.__text} />;
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

export function addPinYin(pinyin: string): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.extract();
  if (nodes.length > 0) {
    const node = nodes[0];
    const pinyinNode = $createPinyinNode(pinyin, (node as TextNode).__text);
    node.insertAfter(pinyinNode);
    pinyinNode.selectEnd();
    node.remove();
  }
}

export function removePinYin(nodekey: string) {
  const pinyinNode = $getNodeByKey(nodekey);
  pinyinNode?.selectEnd();
  const selection = $getSelection();
  const text = (pinyinNode as PinyinNode).getText();
  selection?.insertText(text);
  pinyinNode?.remove();
}
