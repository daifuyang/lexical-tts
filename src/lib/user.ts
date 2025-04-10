import { getUserById } from "@/model/user";
import { getSession } from "./session";
import { SysUser } from "@prisma/client";

export const getCurrentUser = async (): Promise<SysUser> => {
  const session = await getSession();
  const defaultUser = {} as SysUser;
  if (!session) {
    return defaultUser;
  }
  const userId = session.userId;
  if (!userId) {
    return defaultUser;
  }
  const user = await getUserById(Number(userId));
  return user;
};
