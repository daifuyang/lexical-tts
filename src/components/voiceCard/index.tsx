import { Avatar } from "antd";
import { PlayCircle, Star, Clock } from "lucide-react";

export default function VoiceCard(props: any) {
  const { data, onClick } = props;

  // 随机生成一个渐变背景色
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-red-600",
  ];
  
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <div 
      onClick={onClick} 
      className="relative group overflow-hidden rounded-xl shadow-sm hover-lift transition-all duration-300"
    >
      <div className={`h-2 bg-gradient-to-r ${randomGradient}`}></div>
      <div className="bg-white p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar 
            className={`bg-gradient-to-r ${randomGradient} text-white`} 
            size="large"
          >
            {data.name?.charAt(0) || "V"}
          </Avatar>
          <div className="flex-1">
            <h3 className="text-base font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
              {data.name}
            </h3>
            <p className="text-xs text-gray-500">
              {data.desc || "高质量自然语音"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500" />
            <span>{data.rating || "4.8"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span>{data.duration || "快速"}</span>
          </div>
        </div>
        
        <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <PlayCircle className="h-4 w-4 text-blue-500" />
          试听语音
        </button>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
        <button className="mb-4 px-4 py-2 bg-white rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
          立即使用
        </button>
      </div>
    </div>
  );
}
