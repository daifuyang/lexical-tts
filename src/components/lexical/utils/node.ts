import dayjs from "dayjs";
import {
  $getRoot,
  $isParagraphNode,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  RangeSelection
} from "lexical";
const specialChars =
  /[.,!?;:(){}[\]'"-]|。|，|？|！|：|；|「|」|『|』|【|】|《|》|—|……|（|）|〖|〗|、|•|·/;

export function arrayToTree(array: any[]): any {
  // Step 1: Create a map to store references to each node
  const nodeMap: { [key: string]: any } = {};

  // Step 2: Create nodes and populate the map
  array.forEach((item) => {
    const key = item.__key;
    const parent = item.__parent;

    const json = item.exportJSON();

    const node: Node = {
      ...json,
      key,
      parent
    };
    // Add the node to the map
    nodeMap[key] = node;

    // If parent node exists, add current node as its child
    if (parent && nodeMap[parent]) {
      if (!nodeMap[parent].children) {
        nodeMap[parent].children = [];
      }
      nodeMap[parent].children.push(node);
    }
  });

  // Step 3: Find root nodes (nodes without a parent)
  const rootNodes: any[] = [];
  array.forEach((item) => {
    if (!item.__parent || !nodeMap[item.__parent]) {
      rootNodes.push(nodeMap[item.__key]);
    }
  });

  return rootNodes;
}

export function getNodes(selection: RangeSelection): Array<LexicalNode> {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const isBefore = anchor.isBefore(focus);
  const firstPoint = isBefore ? anchor : focus;
  const lastPoint = isBefore ? focus : anchor;
  let firstNode = firstPoint.getNode();
  let lastNode = lastPoint.getNode();
  const startOffset = firstPoint.offset;
  const endOffset = lastPoint.offset;

  console.log("firstNode", firstNode, lastNode);

  let next: any = firstNode;

  let nodes = [];
  let index = 0;

  do {
    const nextNode = next.getNextSibling();

    if (nextNode) {
      next = nextNode;
      nodes.push(next);
    }

    index++;

    if (index > 100) {
      console.log("out memary");
      break;
    }

    console.log("key", next, next?.getKey(), lastNode?.getKey());

    if (next?.getKey() === lastNode.getKey()) {
      console.log("next", next);
      break;
    }
  } while (true);
  console.log("nodes", nodes);
  return [];
}

export function $getFirstText(editor: LexicalEditor): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      editor.update(() => {
        const currentDate = dayjs().format("YYYY-MM-DD");
        const root = $getRoot();
        const first = root.getFirstChild();
        if ($isParagraphNode(first)) {
          const firstText = (first as ParagraphNode).getFirstChild();
          if (firstText) {
            let text = firstText.getTextContent();
            if (specialChars.test(text)) {
              // 使用 replace 方法将结尾的特殊符号剪切掉
              text = text.replace(specialChars, "");
            }
            if(text) {
                text = `${currentDate}-${text}`
            }else {
                text = currentDate;
            }
            resolve(text);
          } else {
            resolve(currentDate); // No text found
          }
        } else {
          resolve(currentDate); // No paragraph found
        }
      }, {
        discrete: true
      });
    } catch (error) {
      reject(error);
    }
  });
}
