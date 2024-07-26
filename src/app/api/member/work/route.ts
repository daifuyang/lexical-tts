import { NextRequest } from "next/server";
import response from "@/lib/response";
import { existsSync, mkdirSync } from "fs";
import tts from "@/lib/tts";
import dayjs from "dayjs";
import redis from "@/lib/redis";
import { uploadFile } from "@/lib/qiniu";
import { createTtsWork, updateTtsWork } from "@/model/ttsWork";
import { getUserId } from "@/lib/user";

const workFileDateKey = "tts:workFile:date:";

// 新增作品
export async function POST(request: NextRequest) {
  return Save(request);
}

export async function Save(request: NextRequest, id: string = "") {
  const userId = getUserId(request);

  const json = await request.json();
  const { title = "", speaker = "", editorState = "", ssml = "", duration = 0, status = 0 } = json;

  if (!title) {
    return response.error("标题不能为空！");
  }

  if (!editorState) {
    return response.error("内容不能为空！");
  }

  // 统计字数

  // 判断vip

  // 其他逻辑
  let filePath = "";
  let filename = "";
  if (status === 1) {
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

      if (uploadRes.key) {
        filePath = uploadRes.key;
      }
    }
  }

  let work = null;
  const idInt = Number(id);

  const formData = {
    title,
    speaker,
    editorState,
    ssml,
    duration,
    status,
    creatorId: userId
  };

  if (idInt > 0) {
    work = await updateTtsWork(idInt, formData);
    return response.success("更新成功！", work);
  } else {
    work = await createTtsWork(formData);
    return response.success("保存成功！", work);
  }
}
