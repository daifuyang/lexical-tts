'use client'
import Provider from "@/redux/provider";
import { setUser } from "@/redux/slice/userState";
import { getCurrentUser } from "@/utils/user";
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
    const res: any = await getCurrentUser();
    if (res.code === 1) {
      dispatch(setUser(res.data));
      return;
    }
    router.push("/login");
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return children;
}

export default function AuthLayout({ children }: any) {
  return (
    <Provider>
      <Layout>{children}</Layout>
    </Provider>
  );
}
