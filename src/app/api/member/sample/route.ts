import { NextRequest } from "next/server";
import response from "@/lib/response";
import path from "path";
import { calculateBilling, generateAudio, getSsml } from "@/lib/ssml";
import { createSample, getSampleFirst } from "@/model/ttsSample";
import { getUsageLogList } from "@/model/ttsUsageLog";
import { now } from "@/lib/date";
import { getCurrentUser } from "@/lib/user";
import { getMembershipFirst } from "@/model/membership";
import { createUsageLog } from "@/model/ttsUsageLog";
import { deductChars } from "@/model/membership";
import { getTtsWorkById } from "@/model/ttsWork";

export async function POST(request: NextRequest) {
  const json = await request.json();
  const { workId, voiceName, editorState = [] } = json;

  if (!workId) {
    return response.error("作品ID不能为空！");
  }

  // 验证作品
  if (!(await getTtsWorkById(Number(workId)))) {
    return response.error("作品不存在！");
  }

  if (!editorState) {
    return response.error("配音数据不能为空！");
  }

  if (!voiceName) {
    return response.error("配音名称不能为空！");
  }

  const { userId } = await getCurrentUser();

  const existingSample = await getSampleFirst({
    voiceName,
    content: editorState,
    creatorId: Number(userId)
  });

  const filePath = existingSample?.audioUrl;

  if (existingSample && filePath) {
    return response.success("生成成功！", {
      filename: path.basename(filePath),
      filePath,
      prevPath: `https://cdn.vlog-v.com/${filePath}`
    });
  }

  const generateRes = await generateAudio(editorState, voiceName);
  if (generateRes?.status === "error") {
    return response.error("生成失败！");
  }

  const { filename = "", res: uploadRes, type, ssml = "" } = generateRes;

  const count = calculateBilling(ssml);

  // 入库
  const sample = await createSample({
    voiceName,
    content: editorState,
    ssml,
    count,
    audioUrl: "/" + uploadRes.key,
    creatorId: Number(userId),
    createdAt: now()
  });

  // 获取用户会员信息
  const membership = await getMembershipFirst({
    userId: Number(userId),
    endDate: { gt: now() }
  });

  if (membership) {
    // 获取该作品的历史用量
    const workUsages = await getUsageLogList(1, 0, {
      userId: Number(userId),
      workId: Number(workId)
    });

    // 计算该作品总用量
    const workTotalUsed = workUsages.reduce(
      (sum: number, log: { charsUsed: number }) => sum + log.charsUsed,
      0
    );

    // 创建消耗日志
    await createUsageLog({
      user: { connect: { userId: Number(userId) } },
      sample: { connect: { id: sample.id } },
      work: { connect: { id: Number(workId) } },
      voiceName: voiceName,
      voiceStyle: "",
      ssml: ssml,
      charsUsed: count,
      charsLeft: membership.totalRemaining - count,
      totalUsed: workTotalUsed + count,
      createdAt: now()
    });

    // 扣除会员字数
    await deductChars(membership.memberId, count);
  }

  return response.success("生成成功！", {
    filename,
    filePath: uploadRes.key,
    prevPath: `https://cdn.vlog-v.com/${uploadRes.key}`
  });
}
