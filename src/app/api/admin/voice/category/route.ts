import { NextRequest } from "next/server";
import api from '@/lib/response';
import prisma from '@/lib/prisma';

// 获取列表
export async function GET(request: NextRequest) {
    return api.success("获取成功！", [])
}

// 新增一条
export async function POST(request: NextRequest) {
    const json = await request.json()

    let status = 1
    if(json.status) {
        status = Number(json.status)
    }

    const voiceCategory = await prisma.ttsVoiceCategory.create({
        data: {
            name: json.name,
            desc: json.desc,
            status
        }
    })

    return api.success("新增成功",voiceCategory)
}