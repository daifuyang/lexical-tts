import _ from "lodash";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import api from "@/lib/response";
import prisma from "@/lib/prisma";
import { getUmsAdmin } from "@/model/umsAdmin";
import { now } from "@/lib/date";
import { createUmsToken } from "@/model/umsToken";

export async function POST(request: Request) {
  const data = await request.json();
  const { account, password } = data;
  if (!_.trim(account)) {
    return api.error("账号不能为空");
  } else if (!_.trim(password)) {
    return api.error("密码不能为空");
  }

  // const pwd = bcrypt.hashSync('123456',bcrypt.genSaltSync(10))
  // console.log('pwd',pwd)

  const user = await getUmsAdmin({
    where: {
      username: account,
    }
  });

  if (!user) {
    return api.error("该用户不存在！");
  }

  // 比对密码
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return api.error("账号或密码不正确！");
  } else {
    const accessToken = jwt.sign({ userId: user.id }, "secret", { expiresIn: "1d" });
    const refreshToken = jwt.sign({ userId: user.id }, "refreshSecret", { expiresIn: "7d" }); // 7天过期
    const expiry = dayjs().add(1, "day").unix();

    const token = {
      accessToken,
      tokenType: "Bearer",
      refreshToken,
      expiry
    };

    // 入库
    const userToken = await createUmsToken({
      data: {
        userId: user.id,
        userType: 1,
        accessToken,
        refreshToken,
        expiry,
        createdAt: now()
      }
    });

    if (!userToken) {
      return api.error("登录失败！");
    }

    return api.success("登录成功！", token);
  }
}
