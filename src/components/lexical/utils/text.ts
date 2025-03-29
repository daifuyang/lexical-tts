/**
 * 根据中文标点符号将长文本拆分成短句
 * @param text 要拆分的文本
 * @returns 拆分后的句子数组
 */
export function splitTextByPunctuation(text: string): string[] {
    // 定义中英文句子结束标点符号
    const sentenceEndings = ['。', '？', '！', '……', '；', '.', '?', '!', ';'];
    
    // 用于存储拆分后的句子
    const sentences: string[] = [];
    
    // 当前句子的起始位置
    let start = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // 如果当前字符是句子结束符号
      if (sentenceEndings.includes(char)) {
        // 获取当前句子
        const sentence = text.slice(start, i + 1).trim();
        
        // 如果句子不为空，则添加到结果中
        if (sentence) {
          sentences.push(sentence);
        }
        
        // 更新下一个句子的起始位置
        start = i + 1;
      }
    }
    
    // 处理最后可能剩余的文本
    if (start < text.length) {
      const lastSentence = text.slice(start).trim();
      if (lastSentence) {
        sentences.push(lastSentence);
      }
    }
    
    return sentences;
  }