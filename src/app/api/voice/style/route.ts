import api from "@/lib/response";
import prisma from "@/lib/prisma";

async function list(request: Request) {
  const data = await prisma.ttsVoiceStyle.findMany();
  return api.success("获取成功！", data);
}

module.exports = {
  GET: list
};
