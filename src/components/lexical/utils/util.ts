type Node = {
    children?: Node[];
    text?: string;
    [key: string]: any;
};

export function calculateTextLength(node: Node): number {
    let length = 0;

    if (node.text) {
        length += node.text.length;
    }

    if (node.children) {
        for (const child of node.children) {
            length += calculateTextLength(child);
        }
    }

    return length;
}