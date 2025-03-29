import { EditorConfig, ParagraphNode, SerializedParagraphNode, Spread } from "lexical";

export type SerializedCustomParagraphNode = Spread<
  {
    type: string;
  },
  SerializedParagraphNode
>;

export class CustomParagraphNode extends ParagraphNode {
  static getType() {
    return "custom-paragraph";
  }

  static clone(node: CustomParagraphNode) {
    return new CustomParagraphNode(node.__key);
  }

  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config);
    return dom;
  }
}
