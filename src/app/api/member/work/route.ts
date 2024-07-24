import { NextRequest } from "next/server";
import response from "@/lib/response";
import { existsSync, mkdirSync } from "fs";
import tts from "@/lib/tts";
import dayjs from "dayjs";
import redis from "@/lib/redis";
import { uploadFile } from "@/lib/qiniu";
import { createTtsWork } from "@/model/ttsWork";

const workFileDateKey = "tts:workFile:date:";

// 新增作品
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { title = "", speaker = "", editorState = "", ssml = "", status = 0 } = json;

  if (!title) {
    return response.error("标题不能为空！");
  }


  // 统计字数

  // 判断vip

  // 其他逻辑
  let filePath = '';
  let filename = '';
  if(status > 1) {
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
      filename = name + ".mp3";
  
      const key = `tts/${filename}`;
  
      // 上传到七牛云
      const uploadRes: any = await uploadFile(filename, key, localFile);
  
      if(uploadRes.key) {
        filePath = uploadRes.key
      }

     
    }
  } 

  const work = await createTtsWork({
    title,
    speaker,
    editorState,
    ssml,
    status
  });

  if(work) {
    return response.success("保存成功！", work);
  }


  return response.success("保存失败！");
}
