"use server";

import bcrypt from "bcrypt";
import { getUser } from "@/model/user";
import { createSession } from "@/lib/session";
import { z } from "zod";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  account: z.string().min(1, "账号不能为空").trim(),
  password: z.string().min(1, "密码不能为空").trim()
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.parse({
    account: formData.get("account"),
    password: formData.get("password"),
    userType: formData.get("userType")
  });

  const { account, password } = validatedFields;
  const user = await getUser({ loginName: account });
  if (!user) {
    return { success: false, message: "该用户不存在！" };
  }

  // 比对密码
  if (user.password) {
    const pwd = `${password}${user.salt}`;
    // 验证密码
    const isPasswordValid = bcrypt.compareSync(pwd, user.password);
    if (!isPasswordValid) {
      return { success: 0, message: "账号或密码不正确！" };
    } else {
      const userId = user.userId;
      await createSession(`${userId}`);
      // 重定向到首页
      redirect("/test");
    }
  }
}
