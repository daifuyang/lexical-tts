import { getCurrentMember as member} from "@/services/member";
import {getCurrentAdmin as admin } from "@/services/admin";

export const getCurrentMember = async () => {
  const user = await member();
  return user;
};

export const getCurrentAdmin = async () => {
  const user = await admin();
  return user;
};
