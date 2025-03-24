"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { memberRequest } from "@/utils/request";

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
  const [activeTab, setActiveTab] = useState<'completed' | 'drafts'>('completed');
  const [works, setWorks] = useState<Work[]>([]);
  const [drafts, setDrafts] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟数据 - 实际项目中应该从API获取
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        // 实际项目中应该调用API
        // const response = await memberRequest.get("/api/member/work?status=1");
        // setWorks(response.data);
        
        // 模拟数据
        setWorks([
          {
            id: 1,
            title: "产品介绍配音",
            voiceName: "自然女声",
            audioUrl: "/audio/sample1.mp3",
            duration: 120,
            status: 1,
            createdAt: Date.now() - 86400000 * 2, // 2天前
            version: 1
          },
          {
            id: 2,
            title: "企业宣传片解说",
            voiceName: "专业男声",
            audioUrl: "/audio/sample2.mp3",
            duration: 180,
            status: 1,
            createdAt: Date.now() - 86400000 * 5, // 5天前
            version: 2
          },
          {
            id: 3,
            title: "教学视频配音",
            voiceName: "温柔女声",
            audioUrl: "/audio/sample3.mp3",
            duration: 240,
            status: 1,
            createdAt: Date.now() - 86400000 * 10, // 10天前
            version: 1
          }
        ]);
        
        setDrafts([
          {
            id: 4,
            title: "新产品发布会脚本",
            voiceName: "未选择",
            audioUrl: "",
            duration: 0,
            status: 0,
            createdAt: Date.now() - 86400000, // 1天前
            version: 1
          },
          {
            id: 5,
            title: "周报总结",
            voiceName: "未选择",
            audioUrl: "",
            duration: 0,
            status: 0,
            createdAt: Date.now() - 86400000 * 3, // 3天前
            version: 1
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("获取作品失败", error);
        setLoading(false);
      }
    };
    
    fetchWorks();
  }, []);

  // 格式化时间
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // 过滤作品
  const filteredWorks = works.filter(work => 
    work.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredDrafts = drafts.filter(draft => 
    draft.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 渲染空状态
  const renderEmptyState = (type: 'completed' | 'drafts') => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <FileText className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        {type === 'completed' ? '没有已完成的作品' : '没有草稿'}
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-md">
        {type === 'completed' 
          ? '您还没有创建任何已完成的作品。点击下方按钮开始创建您的第一个作品。' 
          : '您还没有保存任何草稿。草稿可以帮助您保存未完成的工作。'}
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
            activeTab === 'completed' 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          已完成作品
          {works.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              {works.length}
            </span>
          )}
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${
            activeTab === 'drafts' 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('drafts')}
        >
          草稿
          {drafts.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              {drafts.length}
            </span>
          )}
          {activeTab === 'drafts' && (
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
          {activeTab === 'completed' && (
            <>
              {filteredWorks.length > 0 ? (
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
                              <Button variant="outline" size="sm" className="flex items-center">
                                <Play className="h-4 w-4 mr-1 text-blue-500" />
                                试听
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center">
                                <Download className="h-4 w-4 mr-1 text-blue-500" />
                                下载
                              </Button>
                              <Link href={`/editor?id=${work.id}`}>
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <Edit className="h-4 w-4 mr-1 text-blue-500" />
                                  编辑
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm" className="flex items-center text-red-500 hover:text-red-600 hover:border-red-200">
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
                renderEmptyState('completed')
              )}
            </>
          )}

          {/* 草稿列表 */}
          {activeTab === 'drafts' && (
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
                              <Button variant="outline" size="sm" className="flex items-center text-red-500 hover:text-red-600 hover:border-red-200">
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
                renderEmptyState('drafts')
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
