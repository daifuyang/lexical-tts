const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
// 数字转大写
function numberToChineseWords(number: number) {
  const units = ["", "十", "百", "千"];
  const largeUnits = ["", "万", "亿", "兆"]; // 可以根据需要扩展更多位

  let result = "";

  let integerPart = Math.floor(number);
  let decimalPart = Math.round((number - integerPart) * 100); // 取小数点后两位

  if (integerPart === 0) {
    result += chineseNumbers[0]; // 零
  } else {
    let unitIndex = 0;
    while (integerPart > 0) {
      let group = integerPart % 10000;
      let groupStr = "";
      let zeroFlag = false; // 是否需要添加零
      let zeroCount = 0; // 连续零的数量

      for (let i = 0; i < 4; i++) {
        let digit = group % 10;
        if (digit === 0) {
          if (!zeroFlag) {
            zeroFlag = true;
          }
          zeroCount++;
        } else {
          if (zeroFlag) {
            groupStr = chineseNumbers[0] + groupStr; // 添加零
            zeroFlag = false;
          }
          groupStr = chineseNumbers[digit] + units[i] + groupStr;
        }
        group = Math.floor(group / 10);
      }

      if (zeroCount === 4) {
        result = chineseNumbers[0] + result; // 添加万、亿等单位
      } else {
        result = groupStr + largeUnits[unitIndex] + result;
      }

      integerPart = Math.floor(integerPart / 10000);
      unitIndex++;
    }
  }

  // 处理小数部分
  if (decimalPart > 0) {
    result += "点";
    let decimalStr = decimalPart.toString();
    for (let i = 0; i < decimalStr.length; i++) {
      result += chineseNumbers[parseInt(decimalStr[i])];
    }
  }

  return result;
}

// 数字转读写
function numberToChineseRead(number: number) {
  const numberStr = number.toString();
  let chineseRead = "";
  for (let i = 0; i < numberStr.length; i++) {
    const digit = parseInt(numberStr[i]);
    chineseRead += chineseNumbers[digit];
  }
  return chineseRead;
}

const specialNumbers = ["零", "幺", "二", "三", "四", "五", "六", "七", "八", "九"];
function numberToSpecialRead(number: number) {
  const numberStr = number.toString();
  let chineseRead = "";

  for (let i = 0; i < numberStr.length; i++) {
    const digit = parseInt(numberStr[i]);
    chineseRead += specialNumbers[digit];
  }

  return chineseRead;
}

export function getNumberOptions(number: number) {
  const str = number.toString();
  const options: any[] = [];
  if (str.includes("1")) {
    const special = numberToSpecialRead(number);
    if (special) {
      options.push({
        type: "序列",
        label: `序列： ${special}`,
        value: special
      });
    }
  }

  const numStr = numberToChineseRead(number);
  if (numStr) {
    options.push({
      type: "序列",
      label: `序列： ${numStr}`,
      value: numStr
    });
  }

  const words = numberToChineseWords(number);
  if (words) {
    options.push({
      type: "数值",
      label: `数值： ${words}`,
      value: words
    });
  }

  return options;
}
