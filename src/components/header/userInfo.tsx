import { getCurrentUser } from "@/lib/user";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import Link from "next/link";
import MembershipButton from "@/components/membership/membershipButton";
import { Button } from "@/components/ui/button";

export default async function UserInfo() {
  const user = await getCurrentUser();

  return (
    <div className="flex items-center">
      <MembershipButton />
      {user ? (
        <>
          <Avatar className="text-xl cursor-pointer" shape="square" icon={<UserOutlined />} />
          <span className="ml-2">{user.nickname || user.loginName}</span>
        </>
      ) : (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">登录</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">注册</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
