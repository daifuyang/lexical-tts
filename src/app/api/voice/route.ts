import { getVoiceLst, getVoiceTotal } from "@/model/ttsVoice";
import { NextRequest } from "next/server";
import api from '@/lib/response';
import _ from 'lodash';

export async function GET(request: NextRequest) {
    // 查询条件
    const { searchParams } = request.nextUrl;
  
    const current = parseInt(searchParams.get("current") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
  
    const where: any = {};
  
    // 主播名称
    const name = searchParams.get("name") || '';
    if(_.trim(name)) {
      where["name"] = { contains: name };
    }
  
    // 主播标识
    const shortName = searchParams.get("shortName") || '';
    if(_.trim(shortName)) {
      where["shortName"] = { contains: shortName };
    }
  
    // 状态
    const status = searchParams.get("status") || '';
    if(_.trim(status)) {
      where["status"] = parseInt(status);
    }
  
    const total = await getVoiceTotal()
  
    const res = await getVoiceLst(current, pageSize, where , { id:  'asc' });
  
    return api.success("获取成功！", {
      total,
      data: res,
      current,
      pageSize
    });
  }