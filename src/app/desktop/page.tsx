// 工作台首页
import { Avatar, Button, Input } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  CrownOutlined,
  BellOutlined,
  UserOutlined
} from "@ant-design/icons";
import { FolderIcon, HomeIcon } from "@heroicons/react/24/solid";

export default function Desktop() {
  return (
    <div className="flex h-screen">
      <div className="w-64 h-full border-r">
        {/* 标题 */}
        <div className="p-4 text-3xl text-black">AI配音</div>
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
              <Button icon={<PlusOutlined />} size="large" type="primary">
                新建
              </Button>
            </div>

            {/* 个人中心 */}
            <div className="flex items-center">
              <div className="text-amber-400 mr-4">
                <CrownOutlined className="text-xl" /> 会员中心
              </div>
              <div className="mr-4">
                <BellOutlined className="text-xl" />
              </div>

              <Avatar className="text-xl" shape="square" icon={<UserOutlined />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
