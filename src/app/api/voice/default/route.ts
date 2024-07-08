import { getVoiceById } from "@/model/ttsVoice";
import { NextRequest } from "next/server";
import response from '@/lib/response';

export  async function GET (request: NextRequest) {
    const voice = await getVoiceById(1)
    if(!voice) {
        return response.error("默认主播不存在，请联系管理员")
    }
    return response.success("获取成功！",voice)
}