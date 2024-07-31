"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CloudUploadOutlined, EditOutlined, LeftOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, message } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { saveWork } from "@/lib/lexical";
import { downloadFile } from "@/lib/dowload";
import { setIsSaved } from "@/redux/slice/voiceState";

export default function Header() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();
  const [editor] = useLexicalComposerContext();

  const dispatch = useAppDispatch();

  const work: any = useAppSelector((state) => state.lexicalState.work);

  const voiceState = useAppSelector((state) => state.voiceState);

  const { globalVoice, isSaved } = voiceState;

  const voiceName = globalVoice?.shortName || "zh-CN-XiaoxiaoNeural"; // 当前主播

  return (
    <header className="bg-white">
      <div className="flex mx-4 my-2">
        <div className="w-80 flex items-center">
          <h1 className="text-xl">{process.env.NEXT_PUBLIC_TITLE}</h1>
          <div className="w-px h-4 bg-gray-300 mx-2"></div>
          <div onClick={() => {
            router.replace('/desktop')
          }} className="flex items-center cursor-pointer text-slate-700  mr-5">
            <LeftOutlined />
            <span>返回首页</span>
          </div>
          <div
            onClick={async () => {
              const res = await saveWork(editor, id, { voiceName });
              if (res.code === 1) {
                message.success(res.msg);
                dispatch(setIsSaved(true));
                if (!id) {
                  router.replace(`/editor?id=${res.data.id}`);
                }
              }
            }}
            className="flex items-center cursor-pointer text-slate-700"
          >
            <CloudUploadOutlined />
            <span className="ml-2">音频{isSaved ? "已保存" : "未保存"}</span>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="w-60">
            <Input
              suffix={<EditOutlined />}
              className="text-center"
              placeholder="未命名"
              value={work?.title}
              variant="filled"
            />
          </div>
        </div>
        {/* 个人中心 */}
        <div className="w-80 flex items-center justify-end text-slate-700">
          <Button
            onClick={async () => {
              const res = await saveWork(editor, id, { status: 1, voiceName });
              if (res.code === 1) {
                message.success("生成成功！");
                dispatch(setIsSaved(true));
                const { data } = res;
                await downloadFile(data?.prevPath);
                if (!id) {
                  router.replace(`/editor?id=${data.id}`);
                }
              }
            }}
            className="mr-4"
            type="primary"
          >
            生成音频
          </Button>
          <Avatar size={34} icon={<UserOutlined />} />
        </div>
      </div>
    </header>
  );
}
