import { ElementNode, type SerializedElementNode } from 'lexical';
import { $insertWrapNode } from './wrapNode';

export class AudioNode extends ElementNode {
  __text: string;
  __src?: string;

  constructor(text: string, src?: string, key?: string) {
    super(key);
    this.__text = text;
    this.__src = src;
  }

  static getType(): string {
    return 'audioNode';
  }

  static clone(node: AudioNode): AudioNode {
    return new AudioNode(node.__text, node.__src, node.__key);
  }

  getText(): string {
    return this.__text;
  }

  setText(text: string): void {
    const writable = this.getWritable();
    writable.__text = text;
  }

  getSrc(): string | undefined {
    return this.__src;
  }

  setSrc(src: string): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('span');
    dom.dataset.nodeType = "audioNode";
    dom.style.backgroundColor = "#ff0000";
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importJSON(serializedNode: SerializedAudioNode): AudioNode {
    return new AudioNode(serializedNode.text, serializedNode.src);
  }

  exportJSON(): SerializedAudioNode {
    return {
      ...super.exportJSON(),
      type: 'audioNode',
      version: 1,
      text: this.__text,
      src: this.__src,
    };
  }
}

export type SerializedAudioNode = SerializedElementNode & {
  text: string;
  src?: string;
};

export function $createAudioNode(
  text: string,
  src?: string
): AudioNode {
  return new AudioNode(text, src);
}

export function $isAudioNode(node: any): node is AudioNode {
  return node instanceof AudioNode;
}

// 增加$insertAudio函数
export function $insertAudio(
  text: string,
  src?: string
) {
  const audioNode = $createAudioNode(text, src);
  $insertWrapNode(audioNode);
}