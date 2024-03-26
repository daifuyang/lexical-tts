"use client";

import AuthLayout from "@/lib/layout/auth";

export default function Layout({ children }: any) {
  return (
      <AuthLayout>{children}</AuthLayout>
  );
}
