import { getCurrentMember as member} from "@/services/member";
import {getCurrentAdmin as admin } from "@/services/admin";
import { NextRequest } from "next/server";

export const getUserId = (request: NextRequest) => {
  const userId = request.headers.get('x-userId');
  return userId;
}

export const getCurrentMember = async () => {
  const user = await member();
  return user;
};

export const getCurrentAdmin = async () => {
  const user = await admin();
  return user;
};
