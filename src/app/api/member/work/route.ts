import { NextRequest } from "next/server";
import response from "@/lib/response";
import { existsSync, mkdirSync } from "fs";
import tts from "@/lib/tts";
import dayjs from "dayjs";
import redis from "@/lib/redis";
import { uploadFile } from "@/lib/qiniu";

const workFileDateKey = "tts:workFile:date:";

// 新增作品
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { title = "", speaker = "", editorState = "", ssml = "" } = json;

  if (!title) {
    return response.error("标题不能为空！");
  }

  if (!speaker) {
    return response.error("发音人不能为空！");
  }

  if (!editorState) {
    return response.error("富文本数据不能为空！");
  }

  if (!ssml) {
    return response.error("配音数据不能为空！");
  }

  // 统计字数

  // 判断vip

  // 其他逻辑

  const target = process.cwd() + "/output/";

  if (!existsSync(target)) {
    mkdirSync(target);
  }

  const currentDate = dayjs().format("YYYY-MM-DD");
  const key = `${workFileDateKey}${currentDate}`;

  const incrementId = await redis.incr(key);

  // 增加文件安全显示，可加上加密转换逻辑
  const name = `${currentDate}-${incrementId}`;

  const localFile = target + name + ".mp3";

  const res = await new tts(localFile).synthesizeText(ssml);

  if (res.success === "ok") {
    const filename = name + ".mp3";

    const key = `tts/${filename}`

    // 上传到七牛云
    const uploadRes: any = await uploadFile(filename, key, localFile);

    return response.success("生成成功！", {
      filename,
      filePath: uploadRes.key,
      prevPath: `https://cdn.vlog-v.com/${uploadRes.key}`
    });
  }

  return response.success("生成失败！");
}
