import { CrownOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export default function UserInfo() {
  return (
    <div className="flex items-center">
      <div className="text-amber-400 mr-4 cursor-pointer">
        <CrownOutlined className="text-xl" /> 会员中心
      </div>
      <div className="mr-4 cursor-pointer">
        <BellOutlined className="text-xl" />
      </div>

      <Avatar className="text-xl cursor-pointer" shape="square" icon={<UserOutlined />} />
    </div>
  );
}
