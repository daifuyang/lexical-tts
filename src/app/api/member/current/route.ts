import api from "@/lib/response";
import prisma from "@/lib/prisma";
import { now } from "@/lib/date";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return api.error("非法访问！");
  }
  // 验证token
  const usereToken = await prisma.umsToken.findFirst({
    where: {
      accessToken,
      expiry: {
        gt: now() // 没有失效
      }
    }
  });

  if (usereToken?.userId) {
    const user: any = await prisma.umsMember.findFirst({
      where: {
        id: usereToken?.userId
      }
    });

    delete user.password;

    return api.success("获取成功！", user);
  }
  return api.error("用户不存在！");
}