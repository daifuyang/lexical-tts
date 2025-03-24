"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Mic2, FileText, Settings, User, Zap } from "lucide-react";
import { usePathname } from 'next/navigation'

const navigation = [
  { name: "首页", href: "/desktop", icon: Home, description: "查看概览" },
  { name: "我的作品", href: "/desktop/works", icon: FileText, description: "管理作品" },
  { name: "个人资料", href: "/desktop/profile", icon: User, description: "编辑资料" },
  { name: "设置", href: "/desktop/settings", icon: Settings, description: "系统设置" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex h-full w-[240px] flex-col border-r bg-white shadow-sm">
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1 block mb-1"
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 px-4",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700" 
                    : "hover:bg-blue-50 text-gray-700"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-blue-500")} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{item.name}</span>
                  {isActive && (
                    <span className="text-xs opacity-90">{item.description}</span>
                  )}
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-500">
            存储空间: <span className="font-medium text-blue-600">68%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full" style={{ width: "68%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
