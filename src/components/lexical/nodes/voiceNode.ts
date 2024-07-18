import {
  $applyNodeReplacement,
  $getNodeByKey,
  $isRangeSelection,
  BaseSelection,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import { $insertWrapNode, WrapNode } from "./wrapNode";
import { useTagDom } from "../ui/tag";
import { OPEN_VOICE_MODAL_COMMAND } from "../plugins/voicePlugin";

export type SerializedVoiceNode = Spread<
  {
    name: string; // 显示名称
    voice: string; // 主播标识
    style: string; // 风格
    styleName: string; // 风格名称
    rate: number; // 语速
    volume: number; // 音量
    pitch: number; // 音调
  },
  SerializedElementNode
>;

export class VoiceNode extends ElementNode {
  __name: string;
  __voice: string;
  __style: string;
  __styleName: string;
  __rate: number;
  __volume: number;
  __pitch: number;

  static getType(): string {
    return "voice";
  }

  static clone(node: VoiceNode): VoiceNode {
    return new VoiceNode(
      node.__name,
      node.__voice,
      node.__style,
      node.__styleName,
      node.__rate,
      node.__volume,
      node.__pitch,
      node.__key
    );
  }

  constructor(
    name: string,
    voice: string,
    style: string,
    styleName: string,
    rate: number,
    volume: number,
    pitch: number,
    key?: NodeKey
  ) {
    super(key);
    this.__name = name;
    this.__voice = voice;
    this.__style = style;
    this.__styleName = styleName;
    this.__rate = rate;
    this.__volume = volume;
    this.__pitch = pitch;
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    // Define the DOM element here
    const name = this.getName();
    const element = document.createElement("span");

    const tag = useTagDom({
      tagClassName: "voice-tag",
      textClassName: "voice-tag-text",
      tagText: `主播：${name}`,
      onTagClick: () => {
        editor.dispatchCommand(OPEN_VOICE_MODAL_COMMAND, { voice });
      },
      onClose: () => {
        // editor.dispatchCommand(REMOVE_SPEED_COMMAND, key);
      }
    });
    element.appendChild(tag);
    addClassNamesToElement(element, config.theme.voice);
    return element;
  }

  updateDOM(prevNode: VoiceNode, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return true;
  }

  static importJSON(serializedNode: SerializedVoiceNode): VoiceNode {
    const node = $createVoiceNode(
      serializedNode.name,
      serializedNode.voice,
      serializedNode.style,
      serializedNode.styleName,
      serializedNode.rate,
      serializedNode.volume,
      serializedNode.pitch
    );
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedVoiceNode {
    return {
      ...super.exportJSON(),
      type: this.getType(),
      name: this.getName(),
      voice: this.getVoice(),
      style: this.getStyle(),
      styleName: this.getStyleName(),
      rate: this.getRate(),
      volume: this.getVolume(),
      pitch: this.getPitch(),
      version: 1
    };
  }

  setVoice(voice: string): void {
    const self = this.getWritable();
    self.__voice = voice;
  }

  getVoice(): string {
    const self = this.getLatest();
    return self.__voice;
  }

  setName(name: string): void {
    const self = this.getWritable();
    self.__name = name;
  }

  getName(): string {
    const self = this.getLatest();
    return self.__name;
  }

  setStyle(style: string): void {
    const self = this.getWritable();
    self.__style = style;
  }

  getStyle(): string {
    const self = this.getLatest();
    return self.__style;
  }

  setStyleName(styleName: string): void {
    const self = this.getWritable();
    self.__styleName = styleName;
  }

  getStyleName(): string {
    const self = this.getLatest();
    return self.__styleName;
  }

  setRate(rate: number): void {
    const self = this.getWritable();
    self.__rate = rate;
  }

  getRate(): number {
    const self = this.getLatest();
    return self.__rate;
  }

  setVolume(volume: number): void {
    const self = this.getWritable();
    self.__volume = volume;
  }

  getVolume(): number {
    const self = this.getLatest();
    return self.__volume;
  }

  setPitch(pitch: number): void {
    const self = this.getWritable();
    self.__pitch = pitch;
  }

  getPitch(): number {
    const self = this.getLatest();
    return self.__pitch;
  }

  insertNewAfter(_: RangeSelection, restoreSelection = true): null | ElementNode {
    const voiceNode = $createVoiceNode(
      this.__name, this.__voice, this.__style, this.__styleName, this.__rate, this.__volume, this.__pitch
    );
    this.insertAfter(voiceNode, restoreSelection);
    return voiceNode;
  }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): false {
    return false;
  }

  canBeEmpty(): false {
    return false;
  }

  isInline(): true {
    return true;
  }

  extractWithChild(
    child: LexicalNode,
    selection: BaseSelection,
    destination: "clone" | "html"
  ): boolean {
    if (!$isRangeSelection(selection)) {
      return false;
    }

    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();

    return (
      this.isParentOf(anchorNode) &&
      this.isParentOf(focusNode) &&
      selection.getTextContent().length > 0
    );
  }
}

export function $createVoiceNode(
  name: string,
  voice: string,
  style: string,
  styleName: string,
  rate: number,
  volume: number,
  pitch: number
): VoiceNode {
  return $applyNodeReplacement(new VoiceNode(name, voice, style, styleName, rate, volume, pitch));
}

export function $insertVoice(
  name: string,
  voice: string,
  style: string,
  styleName: string,
  rate: number,
  volume: number,
  pitch: number
) {
  const voiceNode = $createVoiceNode(name, voice, style, styleName, rate, volume, pitch);
  $insertWrapNode(voiceNode);
}

// 删除配音主播
export function $removeVoice(key: string) {
  const voiceNode = $getNodeByKey(key);
  if ($isVoiceNode(voiceNode)) {
    const nodes = (voiceNode as VoiceNode).getChildren();
    if (nodes.length > 0) {
      const parent = nodes[0];
      const wrapNodes = (parent as WrapNode)?.getChildren();
      for (let i = 0; i < wrapNodes.length; i++) {
        voiceNode.insertBefore(wrapNodes[i]);
      }
      voiceNode.remove();
    }
  }
}

/**
 * Determines if node is a LinkNode.
 * @param node - The node to be checked.
 * @returns true if node is a LinkNode, false otherwise.
 */
export function $isVoiceNode(node: LexicalNode | null | undefined): node is VoiceNode {
  return node instanceof VoiceNode;
}

export function $getVoiceAncestor(
  node: LexicalNode,
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !$isVoiceNode(parent)) {
    parent = parent.getParentOrThrow();
  }
  return $isVoiceNode(parent) ? parent : null;
}