"use client";

import { UserOutlined, BellOutlined, SettingOutlined, CrownOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Avatar, Badge, Tooltip } from "antd";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";

export function Header() {
  return (
    <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm">
      <div className="flex h-12 items-center justify-between">
        <div className="w-[240px] h-full flex items-center px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GenLabs
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center px-4">
          
          <div className="hidden sm:flex items-center text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 ml-2">
            <span className="mr-1">✨</span>
            探索AI语音的无限可能
          </div>
        </div>
        <div className="flex items-center gap-3 px-4">
          <Tooltip title="通知">
            <Badge count={5} size="small">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-blue-50 hover:bg-blue-100 transition-colors">
                <BellOutlined className="text-blue-500" />
              </Button>
            </Badge>
          </Tooltip>
          
          <Tooltip title="设置">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-blue-50 hover:bg-blue-100 transition-colors">
              <SettingOutlined className="text-blue-500" />
            </Button>
          </Tooltip>
          
          <div className="flex items-center gap-3">
            {/* <Tooltip title="会员状态">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 transition-colors">
                <CrownOutlined className="text-white" />
              </Button>
            </Tooltip> */}
            
            <Avatar 
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-md transition-shadow" 
              size="default"
              icon={<UserOutlined />} 
            />

            admin

          </div>
        </div>
      </div>
    </div>
  );
}
