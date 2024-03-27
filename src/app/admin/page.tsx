"use client";

import { PageContainer, ProCard } from "@ant-design/pro-components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/dashboard");
  }, []);
  return null;
}
