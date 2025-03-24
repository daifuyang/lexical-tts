"use client";

import Provider from "@/redux/provider";

export default function Layout({ children }: any) {
  return <Provider>{children}</Provider>;
}
