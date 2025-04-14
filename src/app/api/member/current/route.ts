import { getCurrentUser } from "@/lib/user";
import { getMembershipFirst } from "@/model/membership";
import response from "@/lib/response";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const simple = url.searchParams.get('simple') === 'true';

  if (simple) {
    return getSimpleUserInfo();
  }
  
  return getFullUserInfo();
}

async function getSimpleUserInfo() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return response.error("未登录");
    }

    // 转换时间戳为ISO格式
    const formatDate = (timestamp: number) => 
      new Date(timestamp * 1000).toISOString();

    return response.success("获取用户基本信息成功", {
      userType: user.userType,
      nickname: user.nickname,
      avatar: user.avatar,
      createdAt: formatDate(user.createdAt)
    });
  } catch (error) {
    console.error("获取用户基本信息失败:", error);
    return response.error("服务器错误");
  }
}

async function getFullUserInfo() {
  try {
    const user = await getCurrentUser();
    if (!user.userId) {
      return response.error("未登录");
    }

    // 获取会员信息
    const membership = await getMembershipFirst({ 
      userId: user.userId 
    });

    // 转换时间戳为ISO格式
    const formatDate = (timestamp: number) => 
      new Date(timestamp * 1000).toISOString();

    return response.success("获取用户完整信息成功", {
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
    console.error("获取用户完整信息失败:", error);
    return response.error("服务器错误");
  }
}
