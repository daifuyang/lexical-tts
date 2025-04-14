"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchUsageStats } from "@/redux/slice/memberState";

interface StatsPluginProps {
  total: number;
}

export default function StatsPlugin({ total }: StatsPluginProps) {
  const dispatch = useAppDispatch();
  const { usageStats } = useAppSelector((state) => state.memberState);
  const searchParams = useSearchParams();
  const workId = searchParams.get("id");

  useEffect(() => {
    if (workId) {
      dispatch(fetchUsageStats(Number(workId)));
    }
  }, [dispatch, workId]);


  return (
    <div className="absolute right-10 bottom-6">
      <div>
        字数统计：<span>{total}</span> / 5000 字
      </div>
      <div>
        项目消耗：{usageStats?.totalUsed || 0}，剩余：{usageStats?.remaining || 0}
      </div>
    </div>
  );
}
