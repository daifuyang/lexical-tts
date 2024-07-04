"use client";
import AuthLayout from "@/lib/layout/adminAuth";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

import "./loading.css";

const AdminLayout = dynamic(() => import("./components/adminLayout"), {
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen min-h-[362px]">
      <div className="page-loading-warp">
        <div className="ant-spin ant-spin-lg ant-spin-spinning">
          <span className="ant-spin-dot ant-spin-dot-spin">
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
          </span>
        </div>
      </div>
      <div className="loading-title">正在加载资源</div>
      <div className="loading-sub-title">初次加载资源可能需要较多时间，请耐心等待</div>
    </div>
  ),
  ssr: false
});

export default function Layout(props: any) {
  const { children } = props;

  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <AuthLayout>
      <AdminLayout>{children}</AdminLayout>
    </AuthLayout>
  );
}
