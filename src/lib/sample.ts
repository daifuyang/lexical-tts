import { $isAudioNode } from "@/components/lexical/nodes/audioNode";
import { $isPinyinNode } from "@/components/lexical/nodes/pinyinNode";
import { $isSymbolNode } from "@/components/lexical/nodes/symbolNode";
import { splitTextByPunctuation } from "@/components/lexical/utils/text";
import { $isParagraphNode, $isTextNode } from "lexical";

export const recursionNodes = (nodes: any) => {
  const newNodes: any = [];
  for (const node of nodes) {
    const newChildNodes: any = [];
    if ($isParagraphNode(node)) {
      const children = node.getChildren();
      const paragraphChildNodes = recursionNodes(children);
      newChildNodes.push({
        type: "paragraph",
        node,
        children: paragraphChildNodes
      });
    } else if ($isAudioNode(node)) {
      newChildNodes.push(node);
    } else if ($isTextNode(node)) {
      // 如果顶层节点为段落，则直接分词
      const textContent = node.getTextContent();
      // 分词
      const texts = splitTextByPunctuation(textContent);
      let offest = -1;
      let splitOffsets = [];
      for (const text of texts) {
        const index = textContent.indexOf(text);
        if (index !== -1) {
          offest = index;
          splitOffsets.push(offest);
        }
      }
      if (splitOffsets.length > 0) {
        const splitNodes = node.splitText(...splitOffsets);
        if (splitNodes.length > 0) {
          for (const node of splitNodes) {
            node.setMode("token");
            newChildNodes.push(node);
          }
        }
      }
    } else if ($isPinyinNode(node)) {
      newChildNodes.push(node);
    } else if ($isSymbolNode(node)) {
      newChildNodes.push(node);
    }
    newNodes.push(...newChildNodes);
  }
  return newNodes;
};

/**
 * 判断一个字符串是否是一句话（以标点符号结尾）。
 * @param text 输入字符串
 * @returns 是否是一句话
 */
export function isCompleteSentence(text: string): boolean {
  if (!text) return false;
  // 定义正则表达式匹配标点符号结尾
  const sentenceEndings = /[。？！.!?]$/;
  return sentenceEndings.test(text);
}

export const mergeSentenceNodes = (nodes: any) => {
  const mergedResult: any = [];
  let currentSentence = "";
  let sentenceNodes = [];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if ($isTextNode(node)) {
      sentenceNodes.push(node);
      const text = node.getTextContent();
      currentSentence += text;
      const end = index === nodes.length - 1;
      if (isCompleteSentence(currentSentence) || end) {
        mergedResult.push(sentenceNodes);
        currentSentence = "";
        sentenceNodes = [];
      }
    } else if ($isPinyinNode(node)) {
      sentenceNodes.push(node);
      currentSentence += node.getTextContent();
    } else if ($isSymbolNode(node)) {
      sentenceNodes.push(node);
      currentSentence += node.getTextContent();
    }
  }
  return mergedResult;
};
