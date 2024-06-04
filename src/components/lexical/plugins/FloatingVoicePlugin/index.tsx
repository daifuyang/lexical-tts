"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { Avatar, Col, Input, Row, Slider } from "antd";
import VoiceModal from "./modal";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Category from "@/components/category";
import { setVoice, setList, fetchVocieCategory } from "@/redux/slice/voiceState";
import { voiceCategoryList, voiceList } from "@/services/voice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import VoiceCard from "@/components/voiceCard";

function FloatingVoice() {
  const [windowState, setWindowState] = useState("normal");
  const [voiceListState, setvoiceListState] = useState(false);

  const [defaultVoice, setDefaultVoice] = useState(null);
  const [voices, setVoices] = useState([]);

  const [voiceCurrent, setVoiceCurrent] = useState(1);
  const [voicePageSize, setVoicePageSize] = useState(10);

  const currentVoice = useAppSelector((state) => state.voiceState.voice);
  const voiceCategory = useAppSelector((state) => state.voiceState.category);

  // const voiceCategoryStatus = useAppSelector((state) => state.voiceState.categoryStatus);
  // const voiceCategoryError = useAppSelector((state) => state.voiceState.categoryError);

  const dispatch = useAppDispatch();

  const maximizeWindow = (e) => {
    e.preventDefault();
    setWindowState("maximized");
    // 实际操作可根据具体需求实现
    // 例如，使用 Electron 的 API 实现最大化窗口
  };

  const minimizeWindow = (e) => {
    e.preventDefault();
    setWindowState("minimized");
    // 实际操作可根据具体需求实现
    // 例如，使用 Electron 的 API 实现最小化窗口
  };

  const toggerVoiceListState = () => {
    setvoiceListState(!voiceListState);
  };

  useEffect(() => {
    if(voiceCategory.length === 0) {
    dispatch(fetchVocieCategory({pageSize: 0}));
  }
  }, [dispatch]);

  useEffect(() => {
    const fetchVoice = async () => {
      const res: any = await voiceList();
      if (res.code === 1) {
        if (!defaultVoice) {
          dispatch(setVoice(res.data.data[0]));
        }
        setVoices(res.data.data);
        setVoiceCurrent(res.data.current);
        setVoicePageSize(res.data.pageSize);
      }
    };
    fetchVoice();
  }, []);

  // 最小样式展示
  if (windowState === "minimized") {
    return (
      <div className="fixed top-16 right-0 bg-white border rounded-l-xl overflow-hidden px-4 py-2">
        <div className="flex items-center">
          <div onClick={maximizeWindow} className="mr-3">
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <div className="mr-3">头像</div>
              <div className="flex flex-col">
                <div>标题</div>
                <div>描述描述描述描述</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-4/5 flex flex-col fixed top-16 right-8 bg-white border rounded-xl overflow-hidden">
        {/* 标题头 */}
        <div className="flex w-full items-center px-4 py-3 text-lg border-b">
          <div
            className="flex w-full items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggerVoiceListState();
            }}
          >
            {voiceListState ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
            <div className="flex-1 px-4 font-medium">
              {voiceListState ? "收起" : "展开"}
              主播列表
            </div>
          </div>
          <ArrowsPointingInIcon onClick={minimizeWindow} className="w-5 h-5" />
        </div>

        <div className="flex flex-1">
          {voiceListState && (
            <div className="w-[25rem] p-2 border-r">
              <Input.Search />

              <Category title="分类" data={voiceCategory} />
              {/* <Category />
              <Category /> */}

              {/* 主播列表 */}
              <div className="">
                <section className="grid grid-cols-3 gap-3">
                  {voices.map((item: any) => {
                    return <VoiceCard data={item} />;
                  })}
                </section>
              </div>
            </div>
          )}
          <div>
            {/* 主播卡片 */}
            <div className="flex items-center px-4 py-3 border-b">
              <Avatar size="large" />
              <div className="flex-1 flex flex-col px-4">
                <div className="flex">
                  <div className="text-lg mb-2">{currentVoice?.name}</div>
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
                    <Slider
                      step={1}
                      min={-10}
                      max={10}
                      defaultValue={0}
                      tooltip={{
                        open: true,
                        getPopupContainer: (node: any) => {
                          if (node) {
                            return node.parentNode;
                          }
                          return document.body;
                        }
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">快</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-700">朗读速度</div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400">慢</span>
                  <div className="px-2 flex-1">
                    <Slider
                      step={1}
                      min={-10}
                      max={10}
                      defaultValue={0}
                      tooltip={{
                        open: true,
                        getPopupContainer: (node: any) => {
                          if (node) {
                            return node.parentNode;
                          }
                          return document.body;
                        }
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">快</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700">朗读速度</div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400">慢</span>
                  <div className="px-2 flex-1">
                    <Slider
                      step={1}
                      min={-10}
                      max={10}
                      defaultValue={0}
                      tooltip={{
                        open: true,
                        getPopupContainer: (node: any) => {
                          if (node) {
                            return node.parentNode;
                          }
                          return document.body;
                        }
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">快</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function FloatVoicePlugin() {
  return createPortal(<FloatingVoice />, document.body);
}
