export function selectNode(element: Element) {
    // 创建一个新的 Range 对象
    const range = document.createRange();
    range.selectNodeContents(element); // 设置 Range 为包含被点击的 span 的内容

    // 获取当前的 Selection 对象
    const selection = window.getSelection();
    selection?.removeAllRanges(); // 清除任何已有的选区
    selection?.addRange(range); // 添加新的选区
}