import { getCurrentUser } from "@/lib/user";
import { getMembershipFirst } from "@/model/membership";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user.userId) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 获取会员信息
    const membership = await getMembershipFirst({ 
      userId: user.userId 
    });

    // 转换时间戳为ISO格式
    const formatDate = (timestamp: number) => 
      new Date(timestamp * 1000).toISOString();

    return NextResponse.json({
      userType: user.userType,
      nickname: user.nickname,
      avatar: user.avatar,
      createdAt: formatDate(user.createdAt),
      membership: membership ? {
        type: membership.type,
        status: membership.endDate > Math.floor(Date.now() / 1000) 
          ? "ACTIVE" : "EXPIRED",
        expiresAt: formatDate(membership.endDate),
        totalChars: membership.totalChars,
        usedChars: membership.usedChars
      } : null
    });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
