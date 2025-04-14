import { getCurrentUser } from "@/lib/user";
import { createUsageLog, getUsageLogList } from "@/model/ttsUsageLog";
import response from "@/lib/response";
import { getMembershipFirst } from "@/model/membership";

/**
 * 获取用户使用统计信息
 * @param request 包含查询参数的请求对象
 * @returns 返回使用统计信息，包括已用字符数和剩余字符数
 *
 * 查询参数:
 * - workId: 可选，指定作品ID时返回该作品的用量统计
 *
 * 返回值:
 * - 当指定workId时: 返回该作品的字符用量(charsUsed)和剩余量(charsLeft)
 * - 未指定workId时: 返回会员的总用量(usedChars)和剩余量(totalChars - usedChars)
 * - 非会员用户: 返回0用量和0剩余
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workId = searchParams.get("workId");
    const user = await getCurrentUser();

    if (!workId) {
      const membership = await getMembershipFirst({ userId: user.userId });
      return response.success("获取成功", {
        totalUsed: membership?.usedChars || 0,
        remaining: membership ? membership.totalChars - membership.usedChars : 0
      });
    }

    // 1. 优先检查作品用量统计

    const workUsages = await getUsageLogList(
      1,
      0,
      {
        userId: user.userId,
        workId: Number(workId)
      },
      {
        createdAt: "desc"
      }
    );

    const latestUsage = workUsages[0];
    return response.success("获取成功", {
      totalUsed: latestUsage?.totalUsed || 0, // 作品累计已用字符数
      remaining: latestUsage?.charsLeft // 作品剩余字符数
    });
  } catch (error) {
    console.error("获取使用统计失败:", error);
    return response.error("服务器错误");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    const data = await request.json();
    const membership = await getMembershipFirst({ userId: user.userId });
    const log = await createUsageLog({
      userId: user.userId,
      ...data,
      totalUsed: (membership?.usedChars || 0) + (data.charsUsed || 0),
      createdAt: Math.floor(Date.now() / 1000)
    });

    return response.success("记录成功", log);
  } catch (error) {
    console.error("记录使用日志失败:", error);
    return response.error("服务器错误");
  }
}
