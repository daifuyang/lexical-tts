import { NextRequest } from "next/server";
import response from "@/lib/response";
import {
  createTtsWork,
  getTtsWorkFirst,
  getWorkList,
  getWorkTotal,
  updateTtsWork
} from "@/model/ttsWork";
import { getCurrentUser } from "@/lib/user";
import { now } from "@/lib/date";
import { generateAudio } from "@/lib/ssml";
import { getSampleFirst } from "@/model/ttsSample";

// 货期作品列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const { userId } = await getCurrentUser();
  const list = await getWorkList(current, pageSize, { creatorId: Number(userId), deletedAt: null });
  if (pageSize > 0) {
    const total = await getWorkTotal({ creatorId: Number(userId), deletedAt: null });

    return response.success("获取成功！", {
      current,
      pageSize,
      total,
      data: list
    });
  }
  return response.success("获取成功！", list);
}

// 新增作品
export async function POST(request: NextRequest) {
  return Save(request);
}

export async function Save(request: NextRequest, id: string = "") {
  const { userId } = await getCurrentUser();

  const json = await request.json();
  const { title = "", voiceName = "", editorState = "", ssml = "", status = 0 } = json;

  if (!title) {
    return response.error("标题不能为空！");
  }

  if (!editorState) {
    return response.error("内容不能为空！");
  }

  // 统计字数

  // 判断vip

  // 其他逻辑

  let existPrevPath = null;

  // 判断是否存在生成，存在则自动下载已存在的，无需重复生成
  const existWork: any = await getTtsWorkFirst({
    editorState,
    voiceName,
    creatorId: Number(userId),
    status: 1
  });
  if (existWork) {
    existPrevPath = `https://cdn.vlog-v.com${existWork.audioUrl}`;
  }

  let duration = 0;
  let audioUrl = "";
  if (status === 1 && !existPrevPath) {
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
    if (existPrevPath) {
      work.prevPath = existPrevPath;
    } else {
      work.prevPath = `https://cdn.vlog-v.com${audioUrl}`;
    }
    return response.success("更新成功！", work);
  } else {
    work = await createTtsWork(formData);
    if (existPrevPath) {
      work.prevPath = existPrevPath;
    } else {
      work.prevPath = `https://cdn.vlog-v.com${audioUrl}`;
    }
    return response.success("保存成功！", work);
  }
}
