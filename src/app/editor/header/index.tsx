import Logo from "@/components/header/logo";
import UserInfo from "@/components/header/userInfo";

export default function Header() {
  return (
    <header className="bg-white">
      <div className="flex m-auto max-w-6xl">
        <Logo />
        {/* 个人中心 */}
        <div className="flex justify-end flex-1">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
