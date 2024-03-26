import tts from "@/lib/tts";
import { existsSync, mkdirSync } from "fs";
import api from "@/lib/response";

export async function POST(request: Request) {
  const { name = "test.mp3", ssml } = await request.json();

  const target = process.cwd() + "/output/";

  if (!existsSync(target)) {
    mkdirSync(target);
  }

  const filename = target + name;

  const res = await new tts(filename).synthesizeText(ssml);
  return api.success("生成成功！", res);
}
