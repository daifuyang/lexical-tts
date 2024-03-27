export const getToken = (type = "member") => {
  const key = type === "member" ? "member_token" : "admin_token";
  const token = localStorage.getItem(key);
  if (token) {
    const obj = JSON.parse(token);
    const { accessToken } = obj;
    return accessToken;
  }
  return null;
};
