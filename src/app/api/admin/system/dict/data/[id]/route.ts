import api from "@/lib/response";
import { deleteSystemDictDataById, getSystemDictDataById, updateSystemDictData } from "@/model/systemDictData";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const dictData = await getSystemDictDataById(Number(id));
    if(!dictData) {
        return api.error("该数据不存在或已被删除！");
    }
    return api.success("获取成功！", dictData);
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const dictData = await getSystemDictDataById(Number(id));
    if(!dictData) {
        return api.error("该数据不存在或已被删除！");
    }
    const json = await request.json();
    const { type, label, value, status = 1, remark } = json;
    const update = await updateSystemDictData(Number(id), { type, label, value, status, remark });
    return api.success("更新成功！", dictData);
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const dictData = await getSystemDictDataById(Number(id));
    if(!dictData) {
        return api.error("该数据不存在或已被删除！");
    }
    const del = await deleteSystemDictDataById(Number(id));
    return api.success("删除成功", del);
}