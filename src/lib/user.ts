import { getUserById } from "@/model/user";
import { getSession } from "./session";

export const getCurrentUser = async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const userId = session.userId;
  if (!userId) {
    return null;
  }
  const user = await getUserById(Number(userId));
  return user;
};
