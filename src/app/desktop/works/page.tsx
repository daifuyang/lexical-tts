"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { AudioPlayer } from "@/components/AudioPlayer";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Play,
  Download,
  Clock,
  CheckCircle,
  FileEdit,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { getWorkList } from "@/services/work";
import { Pagination } from "@/components/ui/pagination";

// 作品类型定义
interface Work {
  id: number;
  title: string;
  voiceName: string;
  audioUrl: string;
  duration: number;
  status: number;
  createdAt: number;
  version: number;
}

export default function WorksPage() {
  // 状态管理
  const [activeTab, setActiveTab] = useState<"completed" | "drafts">("completed");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentAudio, setCurrentAudio] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [drafts, setDrafts] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchWorks = async (page = pagination.current) => {
    try {
      setLoading(true);

      // 获取已完成作品
      const completedResponse = await getWorkList(page, pagination.pageSize, { status: 1 });
      if (completedResponse.code === 1) {
        setWorks(completedResponse.data.data || []);
        setPagination((prev) => ({
          ...prev,
          current: page,
          total: completedResponse.total || 0
        }));
      } else {
        console.error("获取作品失败:", completedResponse?.msg);
      }

      // 获取草稿作品
      const draftsResponse = await getWorkList(1, 10, { status: 0 });
      if (draftsResponse?.code === 1) {
        setDrafts(draftsResponse.data.data || []);
      } else {
        console.error("获取草稿失败:", draftsResponse?.msg);
      }
    } catch (error) {
      console.error("获取作品异常:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [pagination.current, pagination.pageSize]);

  // 格式化时间
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  // 过滤作品
  const filteredWorks = works.filter((work) =>
    work.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrafts = drafts.filter((draft) =>
    draft.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 渲染空状态
  const renderEmptyState = (type: "completed" | "drafts") => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <FileText className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        {type === "completed" ? "没有已完成的作品" : "没有草稿"}
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-md">
        {type === "completed"
          ? "您还没有创建任何已完成的作品。点击下方按钮开始创建您的第一个作品。"
          : "您还没有保存任何草稿。草稿可以帮助您保存未完成的工作。"}
      </p>
      <Link href="/editor">
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          创建新作品
        </Button>
      </Link>
    </div>
  );

  return (
    <>
      <div className="p-6 animate-fadeIn">
        {/* 页面标题和操作 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">我的作品</h1>
            <p className="text-sm text-gray-500">管理您创建的所有配音作品和草稿</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/editor">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                创建新作品
              </Button>
            </Link>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索作品..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 标签页切换 */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === "completed" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            已完成作品
            {works.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                {works.length}
              </span>
            )}
            {activeTab === "completed" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === "drafts" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("drafts")}
          >
            草稿
            {drafts.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                {drafts.length}
              </span>
            )}
            {activeTab === "drafts" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>

        {/* 加载状态 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : (
          <>
            {/* 已完成作品列表 */}
            {activeTab === "completed" && (
              <>
                {filteredWorks.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {filteredWorks.map((work) => (
                        <Card key={work.id} className="overflow-hidden hover-lift">
                          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                          <CardContent className="p-0">
                            <div className="p-4 md:p-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <h3 className="text-lg font-bold mr-2">{work.title}</h3>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      已完成
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                                    <div className="flex items-center mr-4 mb-2 md:mb-0">
                                      <FileText className="h-4 w-4 mr-1 text-gray-400" />
                                      语音: {work.voiceName}
                                    </div>
                                    <div className="flex items-center mr-4 mb-2 md:mb-0">
                                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                      时长: {formatDuration(work.duration)}
                                    </div>
                                    <div className="flex items-center mb-2 md:mb-0">
                                      <FileEdit className="h-4 w-4 mr-1 text-gray-400" />
                                      版本: {work.version}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    创建于 {formatDate(work.createdAt)}
                                  </div>
                                </div>
                                <div className="flex items-center mt-4 md:mt-0 space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center"
                                    onClick={() => {
                                      setCurrentAudio(work.audioUrl);
                                      setIsPlayerOpen(true);
                                    }}
                                  >
                                    <Play className="h-4 w-4 mr-1 text-blue-500" />
                                    试听
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center"
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(work.audioUrl);
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = work.title + ".mp3";
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        document.body.removeChild(a);
                                      } catch (error) {
                                        console.error("下载失败:", error);
                                      }
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-1 text-blue-500" />
                                    下载
                                  </Button>
                                  <Link href={`/editor?id=${work.id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center"
                                    >
                                      <Edit className="h-4 w-4 mr-1 text-blue-500" />
                                      编辑
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center text-red-500 hover:text-red-600 hover:border-red-200"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {pagination.total > pagination.pageSize && (
                      <div className="flex justify-center">
                        <Pagination
                          current={pagination.current}
                          pageSize={pagination.pageSize}
                          total={pagination.total}
                          onChange={(page: number) => fetchWorks(page)}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  renderEmptyState("completed")
                )}
              </>
            )}

            {/* 草稿列表 */}
            {activeTab === "drafts" && (
              <>
                {filteredDrafts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredDrafts.map((draft) => (
                      <Card key={draft.id} className="overflow-hidden hover-lift">
                        <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
                        <CardContent className="p-0">
                          <div className="p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <h3 className="text-lg font-bold mr-2">{draft.title}</h3>
                                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                                    <FileEdit className="h-3 w-3 mr-1" />
                                    草稿
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                                  <div className="flex items-center mr-4 mb-2 md:mb-0">
                                    <FileText className="h-4 w-4 mr-1 text-gray-400" />
                                    语音: {draft.voiceName}
                                  </div>
                                  <div className="flex items-center mb-2 md:mb-0">
                                    <FileEdit className="h-4 w-4 mr-1 text-gray-400" />
                                    版本: {draft.version}
                                  </div>
                                </div>

                                <div className="text-xs text-gray-400">
                                  创建于 {formatDate(draft.createdAt)}
                                </div>
                              </div>

                              <div className="flex items-center mt-4 md:mt-0 space-x-2">
                                <Link href={`/editor?id=${draft.id}`}>
                                  <Button variant="outline" size="sm" className="flex items-center">
                                    <Edit className="h-4 w-4 mr-1 text-blue-500" />
                                    继续编辑
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center text-red-500 hover:text-red-600 hover:border-red-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  renderEmptyState("drafts")
                )}
              </>
            )}
          </>
        )}
      </div>

      <Sheet open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>试听音频</SheetTitle>
          </SheetHeader>
          <AudioPlayer src={currentAudio} onClose={() => setIsPlayerOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
