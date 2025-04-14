"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileTextIcon, UserIcon, ZapIcon, StarIcon, TypeIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUsageStats } from "@/services/member";
import { getCurrentUserInfo } from "@/services/member";
import { getWorkList, getWorkCount } from "@/services/work";

export function Dashboard() {
  const router = useRouter();
  interface StatItem {
    title: string;
    value: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    description: string;
    color: string;
    bgColor: string;
    increase: string;
    loading: boolean;
    error: string | null;
  }

  const [stats, setStats] = useState<StatItem[]>([
    {
      title: "作品总数",
      value: "",
      icon: FileTextIcon,
      description: "您已创建的作品总数",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      increase: "",
      loading: true,
      error: null
    },
    {
      title: "生成字符数",
      value: "",
      icon: TypeIcon,
      description: "累计生成的字符数量",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      increase: "",
      loading: true,
      error: null
    },
    {
      title: "账户类型",
      value: "",
      icon: UserIcon,
      description: "当前账户类型",
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-50",
      increase: "",
      loading: true,
      error: null
    }
  ]);

  useEffect(() => {
    // Load works count
    const loadWorks = async () => {
      try {
        const res = await getWorkCount();
        if (!res?.data || typeof res.data.count !== 'number') {
          throw new Error('Invalid work count response');
        }
        setStats(prev => prev.map(stat => 
          stat.title === "作品总数" ? {
            ...stat,
            value: res.data?.count.toString() || "0",
            loading: false,
            error: null
          } : stat
        ));
      } catch (err) {
        setStats(prev => prev.map(stat => 
          stat.title === "作品总数" ? {
            ...stat,
            error: err instanceof Error ? err.message : '加载失败',
            loading: false
          } : stat
        ));
      }
    };

    // Load usage stats
    const loadUsage = async () => {
      try {
        const res = await getUsageStats();
        if (!res?.data || typeof res.data.totalUsed !== 'number') {
          throw new Error('Invalid usage stats response');
        }
        setStats(prev => prev.map(stat => 
          stat.title === "生成字符数" ? {
            ...stat,
            value: `${(res.data?.totalUsed || 0)}`,
            loading: false,
            error: null
          } : stat
        ));
      } catch (err) {
        setStats(prev => prev.map(stat => 
          stat.title === "生成字符数" ? {
            ...stat,
            error: err instanceof Error ? err.message : '加载失败',
            loading: false
          } : stat
        ));
      }
    };

    // Load user info
    const loadUser = async () => {
      try {
        const res = await getCurrentUserInfo();
        if (!res?.data) {
          throw new Error('Invalid user info response');
        }
        setStats(prev => prev.map(stat => 
          stat.title === "账户类型" ? {
            ...stat,
            value: res.data?.membership?.type || "普通用户",
            increase: res.data?.membership?.type === "普通用户" 
              ? "升级可获取更多功能" 
              : "",
            loading: false,
            error: null
          } : stat
        ));
      } catch (err) {
        setStats(prev => prev.map(stat => 
          stat.title === "账户类型" ? {
            ...stat,
            error: err instanceof Error ? err.message : '加载失败',
            loading: false
          } : stat
        ));
      }
    };

    // Start all loads
    loadWorks();
    loadUsage();
    loadUser();
  }, []);

  const StatSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-8 w-1/2 bg-gray-200 rounded mb-1"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
    </div>
  );

  const recentActivity = [
    { title: "创建了新作品", time: "今天 14:30", icon: FileTextIcon },
    { title: "更新了个人资料", time: "昨天 09:15", icon: UserIcon },
    { title: "尝试了新语音", time: "3天前", icon: ZapIcon },
  ];

  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">欢迎回来，用户名！</h1>
            <p className="mt-2 text-blue-100">今天是个创作的好日子，让我们开始吧！</p>
            <button 
              onClick={() => router.push('/editor')}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
            >
              开始创作
            </button>
          </div>
          <div className="hidden md:block">
            {/* 这里可以放置一个SVG插图 */}
            <div className="h-32 w-32 rounded-full bg-white/10 flex items-center justify-center">
              <ZapIcon className="h-16 w-16 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div>
        <h2 className="text-xl font-bold mb-4">数据概览</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <div className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {stat.increase}
                      </div>
                    </div>
                    {stat.loading ? (
                      <StatSkeleton />
                    ) : stat.error ? (
                      <p className="text-red-500 text-sm">{stat.error}</p>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 最近活动和推荐 */}
      {/* <div className="grid gap-6 md:grid-cols-2">

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4">最近活动</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              查看全部活动
            </button>
          </CardContent>
        </Card>


        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4">推荐语音</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                    <StarIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">推荐语音 {item}</p>
                    <p className="text-xs text-gray-500">高质量自然语音</p>
                  </div>
                  <div className="ml-auto">
                    <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      试听
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              浏览更多语音
            </button>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
