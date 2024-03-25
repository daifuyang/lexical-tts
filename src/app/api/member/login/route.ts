import api from "@/lib/rest";

async function login(request: Request) {
  return api.success("登录");
}

module.exports = {
  POST: login
};
