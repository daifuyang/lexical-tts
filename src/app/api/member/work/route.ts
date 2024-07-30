import { NextRequest } from "next/server";
import response from "@/lib/response";
import { createTtsWork, getTtsWorkFirst, updateTtsWork } from "@/model/ttsWork";
import { getUserId } from "@/lib/user";
import { now } from "@/lib/date";
import { generateAudio } from "@/lib/ssml";

// 货期作品列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
}

// 新增作品
export async function POST(request: NextRequest) {
  return Save(request);
}

export async function Save(request: NextRequest, id: string = "") {
  const userId = getUserId(request);

  const json = await request.json();
  const { title = "", voiceName = "", editorState = "", ssml = "", status = 0 } = json;

  if (!title) {
    return response.error("标题不能为空！");
  }

  if (!editorState) {
    return response.error("内容不能为空！");
  }

  // 判断是否存在生成，存在则自动下载已存在的，无需重复生成

  const existWork: any = await getTtsWorkFirst({
    editorState,
    voiceName,
    creatorId: Number(userId),
    status: 1
  });
  if (existWork) {
    existWork.prevPath = `https://cdn.vlog-v.com${existWork.audioUrl}`;
    return response.success("保存成功！", existWork);
  }

  // 统计字数

  // 判断vip

  // 其他逻辑

  let duration = 0;
  let audioUrl = "";

  if (status === 1) {
    const generateRes = await generateAudio(editorState, voiceName);
    if (generateRes.status === "error") {
      return response.error("生成失败！");
    }
    audioUrl = "/" + generateRes.res.key;
  }

  let work: any = null;
  const idInt = Number(id);

  const formData = {
    title,
    voiceName,
    editorState,
    ssml,
    audioUrl,
    duration,
    status,
    creatorId: Number(userId),
    createdAt: now()
  };

  if (idInt > 0) {
    work = await updateTtsWork(idInt, formData);
    work.prevPath = `https://cdn.vlog-v.com${audioUrl}`;
    return response.success("更新成功！", work);
  } else {
    work = await createTtsWork(formData);
    work.prevPath = `https://cdn.vlog-v.com${audioUrl}`;
    return response.success("保存成功！", work);
  }
}
