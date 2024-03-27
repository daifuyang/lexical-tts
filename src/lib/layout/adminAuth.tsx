"use client";
import Provider from "@/redux/provider";
import { setUser } from "@/redux/slice/userState";
import { getCurrentAdmin } from "@/lib/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  const router = useRouter();
  const fetchUser = async () => {
    const res: any = await getCurrentAdmin();
    if (res.code === 1) {
      dispatch(setUser(res.data));
      return;
    }
    router.push("/admin/login");
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return children;
}

export default function MemberAuthLayout({ children }: any) {
  return (
    <Provider>
      <Layout>{children}</Layout>
    </Provider>
  );
}
