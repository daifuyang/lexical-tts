interface TagDomProps {
  tagText: string;
  tagClassName: string;
  textClassName: string;
  onTagClick?: () => void;
  onClose?: () => void;
}

export function useTagDom({ tagText, tagClassName, textClassName,onTagClick, onClose }: TagDomProps) {
  // 创建一个新的span作为容器
  const tag = document.createElement("span");
  tag.addEventListener("click", (e) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick();
    }
  })
  tag.contentEditable = "false";
  tag.className = tagClassName;

  const text = document.createElement("span");
  text.className = textClassName;
  text.innerText = tagText;

  const closeSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="#000" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="tag-close-icon">
   <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
 </svg>
 `;
  const close = new DOMParser().parseFromString(closeSvg, "image/svg+xml").documentElement;
  close.addEventListener("click", (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  });

  tag.appendChild(text);
  tag.appendChild(close);

  return tag;
}
