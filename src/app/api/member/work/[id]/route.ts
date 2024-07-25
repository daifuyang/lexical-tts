import response from "@/lib/response";
import { getTtsWorkById } from "@/model/ttsWork";
import { NextRequest } from "next/server";

// 获取作品详情
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    if(!id) {
        return response.error("id不能为空")
    }
    const work = await getTtsWorkById(Number(id));
    return response.success("获取成功！", work);
}

// 更新作品集
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {

}