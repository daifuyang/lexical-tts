import prisma from "@/lib/prisma";
// import tts from "@/utils/tts";
import { existsSync, mkdirSync } from "fs";
import api from "@/lib/rest";

const test = async function GET(request: Request) {
  const target = process.cwd() + "/output/";
  const name = "test.mp3";

  if (!existsSync(target)) {
    mkdirSync(target);
  }

  const filename = target + name;

  //   const res = await new tts(filename).synthesizeText(
  //     "你好，我叫配音侠。我在进行测试配音。你会在我这里获取到非常好的配音效果！"
  //   );
  return api.success("操作成功！");
};

module.exports = {
  GET: test
};
