"use client";

import AuthLayout from "@/lib/layout/memberAuth";

export default function Layout({ children }: any) {
  return (
      <AuthLayout>{children}</AuthLayout>
  );
}
