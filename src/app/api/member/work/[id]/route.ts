import response from "@/lib/response";
import { deleteTtsWork, getTtsWorkById } from "@/model/ttsWork";
import { NextRequest } from "next/server";
import { Save } from "../route";
import { getUserId } from "@/lib/user";

// 获取作品详情
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    if(!id) {
        return response.error("id不能为空")
    }

    const userId = getUserId(request);
    const work = await getTtsWorkById(Number(id));
    if(work?.creatorId != Number(userId)) {
        return response.error("非法访问！");
    }

    return response.success("获取成功！", work);
}

// 更新作品集
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    if(!id) {
        return response.error("id不能为空")
    }
    return Save(request, id);
}

// 删除单个作品集
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    if(!id) {
        return response.error("id不能为空")
    }
    const res = await deleteTtsWork(Number(id));
    return response.success("删除成功！", res);
}