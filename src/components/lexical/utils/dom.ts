export function getDomRect(elem: HTMLElement | undefined){
    const rect: DOMRect | undefined = elem?.getBoundingClientRect();
    if(rect) {
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
      return domRect
    }
    return null
}