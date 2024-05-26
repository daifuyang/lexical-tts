import api from "@/lib/response";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const data = await prisma.ttsVoiceStyle.findMany();
  return api.success("获取成功！", data);
}
