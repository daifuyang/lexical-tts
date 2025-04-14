import { NextRequest } from "next/server";
import response from "@/lib/response";
import { getWorkTotal } from "@/model/ttsWork";
import { getCurrentUser } from "@/lib/user";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getCurrentUser();
    const total = await getWorkTotal({ 
      creatorId: Number(userId), 
      deletedAt: null 
    });
    
    return response.success("获取成功", { count: total });
  } catch (error) {
    return response.error("获取作品总数失败");
  }
}
