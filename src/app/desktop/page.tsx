'use client'
import { Avatar, Button, Input } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  CrownOutlined,
  BellOutlined,
  UserOutlined
} from "@ant-design/icons";
import { FolderIcon, HomeIcon } from "@heroicons/react/24/solid";

import List from "./components/table";

import { useRouter } from 'next/navigation'
import UserInfo from "@/components/header/userInfo";
import Logo from "@/components/header/logo";

export default function Desktop() {

  const router = useRouter()

  return (
    <div className="flex h-screen">
      <div className="w-64 h-full border-r">
        {/* 标题 */}
        <Logo />
        {/* 搜索 */}
        <div className="px-4">
          <Input placeholder="搜索" prefix={<SearchOutlined />} />
        </div>
        {/* 导航 */}
        <ul className="px-3 pt-2">
          <li className="flex px-3 py-2 cursor-pointer items-center text-base">
            <HomeIcon className="w-5 h-5" /> <span className="pl-2 font-bold">首页</span>
          </li>
          <li className="flex px-3 py-2 cursor-pointer items-center text-base">
            <FolderIcon className="w-5 h-5" /> <span className="pl-2 font-bold">我的空间</span>
          </li>
        </ul>
      </div>
      <div className="flex-1">
        <div className="p-6">
          {/* 头 */}
          <div className="flex">
            {/* 新建 */}
            <div className="flex-1">
              <Button onClick={ () => {
                router.push('/editor')
              } } icon={<PlusOutlined />} size="large" type="primary">
                新建
              </Button>
            </div>

            {/* 个人中心 */}
            <UserInfo />
          </div>

          <div className="tab">
            <ul className="flex mt-6">
              <li className="px-2 text-lg cursor-pointer">最近</li>
              <li className="px-2 text-lg cursor-pointer">收藏</li>
            </ul>
          </div>

          <div className="mt-6">
            <List />
          </div>
        </div>
      </div>
    </div>
  );
}
