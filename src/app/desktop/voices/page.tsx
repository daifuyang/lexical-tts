import VoiceCard from "@/components/voiceCard";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";

export default async function VoicesPage() {
    // 模拟语音数据
    const mockVoices = [
        { id: 1, name: "自然女声", desc: "清晰自然的女性声音", rating: "4.9", duration: "极速" },
        { id: 2, name: "温柔男声", desc: "温和有磁性的男性声音", rating: "4.7", duration: "快速" },
        { id: 3, name: "活力童声", desc: "充满活力的儿童声音", rating: "4.8", duration: "标准" },
        { id: 4, name: "专业播音", desc: "专业播音员风格", rating: "5.0", duration: "高质量" },
        { id: 5, name: "情感朗读", desc: "富有情感的朗读风格", rating: "4.6", duration: "标准" },
        { id: 6, name: "外语发音", desc: "准确的外语发音", rating: "4.5", duration: "快速" },
        { id: 7, name: "戏剧风格", desc: "戏剧表演风格的声音", rating: "4.7", duration: "高质量" },
        { id: 8, name: "AI合成声", desc: "高度自然的AI合成声音", rating: "4.9", duration: "极速" },
    ];

    // 模拟分类数据
    const categories = [
        { id: 1, name: "全部语音", count: 24 },
        { id: 2, name: "女声", count: 10 },
        { id: 3, name: "男声", count: 8 },
        { id: 4, name: "童声", count: 3 },
        { id: 5, name: "外语", count: 3 },
    ];

    return (
        <div className="p-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-6">
                {/* 左侧筛选区域 */}
                <div className="w-full md:w-64 space-y-6">
                    {/* 搜索框 */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="搜索语音..." 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* 分类卡片 */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="text-lg font-bold mb-3">语音分类</h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div 
                                        key={category.id}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                    >
                                        <span className="text-sm font-medium">{category.name}</span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                            {category.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* 筛选卡片 */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="text-lg font-bold mb-3">筛选选项</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">语音评分</label>
                                    <div className="flex items-center justify-between">
                                        <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">全部</button>
                                        <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">4星以上</button>
                                        <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">5星</button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">处理速度</label>
                                    <div className="flex items-center justify-between">
                                        <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">全部</button>
                                        <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">极速</button>
                                        <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">标准</button>
                                    </div>
                                </div>
                                
                                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    更多筛选
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* 右侧语音列表 */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">语音列表</h2>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                排序方式
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <Filter className="h-4 w-4" />
                                筛选
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockVoices.map((voice) => (
                            <div key={voice.id} className="animate-scaleIn">
                                
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 flex items-center justify-center">
                        <button className="px-6 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors">
                            加载更多
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
