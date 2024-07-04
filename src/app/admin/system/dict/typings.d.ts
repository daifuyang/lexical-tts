// 定义数据的接口
import DictData from './data/[id]/page';
export interface DictItem {
    id: number;
    name: string;
    type: string;
    status: "enabled" | "disabled";
    remark: string;
    createTime: string;
}

export interface DictDataItem {
    type: string;
    id: number;
    label: string;
    value: string;
    sortOrder: int;
    status: "enabled" | "disabled";
    remark: string;
    createTime: string;
}