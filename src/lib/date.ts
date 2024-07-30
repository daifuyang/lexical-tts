import dayjs from "dayjs";

export function now() {
  return Math.floor(new Date().getTime() / 1000);
}

interface Mapping {
  fromField: string;
  toField: string;
  format?: string;
}

interface DataItem {
  [key: string]: any;
}

/**
 * 格式化数组对象中的多个指定字段，并生成新的字段
 * @param {DataItem[]} data - 包含对象的数组
 * @param {Mapping[]} mappings - 映射数组，包含多个映射对象，每个对象包含fromField、toField和format
 * @return {DataItem[]} - 返回新的数组对象，包含新的格式化字段
 */
export function formatFields(data: DataItem[], mappings: Mapping[]) {
  data.forEach((item: any) => {
    mappings.forEach((mapping) => {
      const { fromField, toField, format = "YYYY-MM-DD HH:mm:ss" } = mapping;
      item[toField] = dayjs.unix(item[fromField]).format(format);
    });
  });
}
