export function arrayToTree(array: any[]): any {
    // Step 1: Create a map to store references to each node
    const nodeMap: { [key: string]: any } = {};

    // Step 2: Create nodes and populate the map
    array.forEach(item => {

        const key = item.__key
        const parent = item.__parent

        const json = item.exportJSON()

        const node: Node = {
            ...json,
            key,
            parent
        }
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
    array.forEach(item => {
        if (!item.__parent || !nodeMap[item.__parent]) {
            rootNodes.push(nodeMap[item.__key]);
        }
    });

    return rootNodes;
}