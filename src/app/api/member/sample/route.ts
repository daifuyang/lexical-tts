import { NextRequest } from "next/server";
import response from "@/lib/response";
import { existsSync, mkdirSync } from "fs";
import tts from "@/lib/tts";
import dayjs from "dayjs";
import redis from "@/lib/redis";
import { uploadFile } from "@/lib/qiniu";

const sampleFileDateKey = "tts:sampleFile:date:";

// 新增作品
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { ssml = "" } = json;

  if (!ssml) {
    return response.error("配音数据不能为空！");
  }

  // 统计字数

  // 判断vip

  // 其他逻辑

  const localDir = "sample/"

  const target = process.cwd() + `/output/${localDir}`;

  if (!existsSync(target)) {
        mkdirSync(target);
  }

  const currentDate = dayjs().format("YYYY-MM-DD");
  const key = `${sampleFileDateKey}${currentDate}`;

  const incrementId = await redis.incr(key);

  // 增加文件安全显示，可加上加密转换逻辑
  const name = `${currentDate}-${incrementId}`;

  const localFile = target + name + ".mp3";

  const res = await new tts(localFile).synthesizeText(ssml);

  if (res.success === "ok") {
    const filename = name + ".mp3";
    const key = "tts/" + localDir + filename

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
