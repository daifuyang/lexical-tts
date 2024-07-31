import { NextRequest } from "next/server";
import response from "@/lib/response";
import path from "path";
import { generateAudio } from "@/lib/ssml";
import { createSample, getSampleFirst } from "@/model/ttsSample";
import { now } from "@/lib/date";
import { getUserId } from "@/lib/user";

// 示例
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { voiceName, editorState = [] } = json;

  if (!editorState) {
    return response.error("配音数据不能为空！");
  }

  if (!voiceName) {
    return response.error("配音名称不能为空！");
  }

  const userId = getUserId(request);

  const sample = await getSampleFirst({
    voiceName,
    content: editorState,
    creatorId: Number(userId)
  });

  const filePath = sample?.audioUrl;

  if (sample && filePath) {
    return response.success("生成成功！", {
      filename: path.basename(filePath),
      filePath,
      prevPath: `https://cdn.vlog-v.com/${filePath}`
    });
  }

  const generateRes = await generateAudio(editorState, voiceName);

  if (generateRes.status === "error") {
    return response.error("生成失败！");
  }

  const { filename, res: uploadRes } = generateRes;

  // 入库
  await createSample({
    voiceName,
    content: editorState,
    audioUrl: "/" + uploadRes.key,
    creatorId: Number(userId),
    createdAt: now()
  });

  return response.success("生成成功！", {
    filename,
    filePath: uploadRes.key,
    prevPath: `https://cdn.vlog-v.com/${uploadRes.key}`
  });
}
