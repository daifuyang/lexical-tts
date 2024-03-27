"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingInIcon } from "@heroicons/react/24/solid";
import { Avatar, Slider } from "antd";
import { createPortal } from "react-dom";

function VoiceModal() {
  return (
    <div className="fixed top-16 right-8 bg-white border rounded-xl overflow-hidden">
      {/* 标题头 */}
      <div className="flex w-full items-center px-4 py-3 text-lg border-b">
        <ChevronLeftIcon className="w-5 h-5" />
        <div className="flex-1 px-4 font-medium">展开主播列表</div>
        <ArrowsPointingInIcon className="w-5 h-5" />
      </div>

      {/* 主播卡片 */}
      <div className="flex items-center px-4 py-3 border-b">
        <Avatar size="large" />
        <div className="flex-1 flex flex-col px-4">
          <div className="flex">
            <div className="text-lg mb-2">月月新</div>
          </div>
          <div className="text-base text-gray-400">主播详情</div>
        </div>
        <div>
          <button className="px-2 py-1 text-sm bg-transparent border border-orange-600 text-orange-600 rounded-md">
            更换主播
          </button>
        </div>
      </div>

      {/* 情绪卡片 */}
      <div className="px-4 py-3 border-b">
        <button className="mb-3 px-2 py-1 text-sm bg-transparent border border-orange-600 text-orange-600 rounded-md">
          试听情绪
        </button>

        <div className="grid grid-cols-5 gap-4">
          <div className="w-16 text-center">情绪</div>
          <div className="w-16 text-center">情绪</div>
          <div className="w-16 text-center">情绪</div>
          <div className="w-16 text-center">情绪</div>
          <div className="w-16 text-center">情绪</div>
          <div className="w-16 text-center">情绪</div>
          <div className="w-16 text-center">情绪</div>
          <div className="w-16 text-center">情绪</div>
          <div className="w-16 text-center">情绪</div>
          <div className="w-16 text-center">情绪</div>
        </div>
      </div>

      {/* 其他调节 */}
      <div className="px-4 py-3">
        <div className="mb-6">
          <div className="text-sm text-gray-700">朗读速度</div>
          <div className="flex items-center">
            <span className="text-sm text-gray-400">慢</span>
            <div className="px-2 flex-1">
              <Slider step={1} min={-10} max={10} defaultValue={0} tooltip={{ open: true, getPopupContainer: (node: any) =>{
                if(node) {
                    return node.parentNode
                }
                return document.body;
              } }} />
            </div>
            <span className="text-sm text-gray-400">快</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-700">朗读速度</div>
          <div className="flex items-center">
            <span className="text-sm text-gray-400">慢</span>
            <div className="px-2 flex-1">
              <Slider step={1} min={-10} max={10} defaultValue={0} tooltip={{ open: true, getPopupContainer: (node: any) =>{
                if(node) {
                    return node.parentNode
                }
                return document.body;
              } }} />
            </div>
            <span className="text-sm text-gray-400">快</span>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-700">朗读速度</div>
          <div className="flex items-center">
            <span className="text-sm text-gray-400">慢</span>
            <div className="px-2 flex-1">
              <Slider step={1} min={-10} max={10} defaultValue={0} tooltip={{ open: true, getPopupContainer: (node: any) =>{
                if(node) {
                    return node.parentNode
                }
                return document.body;
              } }} />
            </div>
            <span className="text-sm text-gray-400">快</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FloatVoicePlugin() {
  return createPortal(<VoiceModal />, document.body);
}
