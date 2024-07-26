import { NextRequest } from "next/server";
import response from "@/lib/response";
import { existsSync, mkdirSync } from "fs";
import { v4 } from "uuid";
import tts from "@/lib/tts";
import dayjs from "dayjs";
import { uploadFile } from "@/lib/qiniu";
import { getSsml } from "@/lib/ssml";

// 新增作品
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { editorState = [] } = json;

  if (!editorState) {
    return response.error("配音数据不能为空！");
  }

  const nodes = JSON.parse(editorState);
  const ssml = getSsml(nodes);

  // 统计字数

  // 判断vip

  // 其他逻辑

  const localDir = "tts/"
  const currentDate = dayjs().format("YYYY-MM-DD");
  const keyDir = `${localDir}/${currentDate}/`;
  const assetDir = process.cwd() + `/output/`; // 资源根路径
  const target = assetDir + keyDir;
  if (!existsSync(target)) {
    mkdirSync(target,{ recursive: true });
}


  // 增加文件安全显示，可加上加密转换逻辑
  const name = v4();
  const localFile = target +"sample-"+ name + ".mp3";
  const res = await new tts(localFile).synthesizeText(ssml);

  if (res.success === "ok") {
    const filename = name + ".mp3";
    const key = keyDir + filename

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
