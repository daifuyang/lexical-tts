import api from "@/lib/response";
async function create(request: Request) {
  const json = await request.json();
  return api.success("新增成功！", json);
}

module.exports = {
  POST: create
};
