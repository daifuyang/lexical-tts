import api from "@/lib/response";
import prisma from "@/lib/prisma";
import { getUmsToken } from "@/model/umsToken";
import { now } from "@/lib/date";
import { getUmsAdmin } from "@/model/umsAdmin";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return api.error("非法访问！");
  }
  // 验证token
  const userToken = await getUmsToken({
    where: {
      accessToken,
      userType: 1,
      expiry: {
        gt: now() // 没有失效
      }
    }
  });

  if (userToken?.userId) {
    const user: any = await getUmsAdmin({
      where: {
        id: userToken?.userId
      }
    });

    delete user.password;

    return api.success("获取成功！", user);
  }
  return api.error("用户不存在！");
}
