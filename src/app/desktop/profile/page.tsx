import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  CheckCircleFilled,
  ClockCircleOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  SmileOutlined
} from "@ant-design/icons";

import { getCurrentUser } from "@/lib/user";
import { getMembershipFirst } from "@/model/membership";
import { formatDateTime } from "@/lib/date";

interface ProfileData {
  userType: number;
  nickname?: string | null;
  avatar?: string | null;
  createdAt: string;
  membership: {
    type?: string;
    totalChars?: number;
    usedChars?: number;
    expiresAt?: string;
    status?: string;
  } | null;
}

const typeToDisplay: Record<string, string> = {
  MONTHLY: "月度会员",
  QUARTERLY: "季度会员",
  YEARLY: "年度会员"
};

const planIcons = {
  MONTHLY: <ClockCircleOutlined className="text-blue-500" />,
  QUARTERLY: <GiftOutlined className="text-purple-500" />,
  YEARLY: <SafetyCertificateOutlined className="text-green-500" />
};

// 转换时间戳为ISO格式 (保留旧函数作为备选)
const formatDate = (timestamp: number) => 
  new Date(timestamp * 1000).toISOString();

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  let profileData: ProfileData | null = null;
  try {
    const user = await getCurrentUser();
    if (!user.userId) {
      return null; 
    }

    // 获取会员信息
    const membership = await getMembershipFirst({
      userId: user.userId
    });

    profileData = {
      ...user,
      createdAt: formatDateTime(user.createdAt),
      membership: membership ? {
        type: membership.type,
        status: membership.endDate > Math.floor(Date.now() / 1000) 
          ? "ACTIVE" : "EXPIRED",
        expiresAt: formatDateTime(membership.endDate),
        totalChars: membership.totalChars,
        usedChars: membership.usedChars
      } : null
    };
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">账户信息</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 用户基本信息卡片 */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">基本信息</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">用户类型:</span>
              <span className="font-medium">
                {profileData?.userType === 0 ? "前台用户" : "后台用户"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">昵称:</span>
              <span className="font-medium">{profileData?.nickname || "未设置"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">注册时间:</span>
              <span className="font-medium">{profileData?.createdAt || "未知"}</span>
            </div>
          </div>
        </Card>

        {/* 会员状态卡片 */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            {profileData?.membership?.type ? (
              planIcons[profileData.membership.type as keyof typeof planIcons]
            ) : (
              <SmileOutlined />
            )}
            <span className="ml-2">会员状态</span>
          </h3>

          {profileData?.membership?.type ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">会员类型:</span>
                <span className="font-medium">
                  {typeToDisplay[profileData.membership.type] || profileData.membership.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">状态:</span>
                <span className="font-medium">
                  {profileData.membership.status === "ACTIVE" ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircleFilled className="mr-1" /> 有效
                    </span>
                  ) : (
                    "已过期"
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">到期时间:</span>
                <span className="font-medium">{profileData.membership.expiresAt || "未订阅"}</span>
              </div>
              <Button className="w-full mt-4">升级/续费会员</Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">您当前不是会员</p>
              <Button>立即订阅</Button>
            </div>
          )}
        </Card>

        {/* 字数包卡片 */}
        {profileData?.membership && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">字数包</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">总字数:</span>
                  <span className="font-medium">
                    {profileData.membership.totalChars?.toLocaleString() || "0"} 字符
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">已用字数:</span>
                  <span className="font-medium">
                    {profileData.membership.usedChars?.toLocaleString() || "0"} 字符
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">剩余字数:</span>
                  <span className="font-medium">
                    {profileData.membership.totalChars && profileData.membership.usedChars
                      ? (
                          profileData.membership.totalChars - profileData.membership.usedChars
                        ).toLocaleString()
                      : "0"}{" "}
                    字符
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md mt-2">
                  <p className="text-sm text-gray-600">
                    {profileData.membership.totalChars
                      ? `大约可生成 ${Math.floor(
                          ((profileData.membership.totalChars -
                            (profileData.membership.usedChars || 0)) /
                            2) *
                            0.7
                        )} 个汉字`
                      : "订阅会员或购买补充包获取更多字数"}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-2">
                购买补充包
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
