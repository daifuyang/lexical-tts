import { getCurrentMember } from "@/services/user";

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const obj = JSON.parse(token);
    const { accessToken } = obj;
    return accessToken;
  }
  return null;
};

export const getCurrentUser = async () => {
  const user = await getCurrentMember();
  return user;
};
