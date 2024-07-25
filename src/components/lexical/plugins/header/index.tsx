"use client";
import { useRouter } from 'next/navigation'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CloudUploadOutlined, EditOutlined, LeftOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input } from "antd";
import { useState } from "react";
import { $getFirstText } from "../../utils/node";
import { addWork } from "@/services/work";
import { useAppSelector } from '@/redux/hook';

export default function Header() {

  const router = useRouter()
  const [editor] = useLexicalComposerContext();
 
  const work = useAppSelector((state) => state.lexicalState.work);

  async function saveWork() {
    const text = await $getFirstText(editor);
    const res: any = await addWork({ title: text });
    if (res.code === 1) {
      router.replace(`/editor?id=${res.data.id}`);
    }
  }

  return (
    <header className="bg-white">
      <div className="flex mx-4 my-2">
        <div className="w-80 flex items-center">
          <h1 className="text-xl">{process.env.NEXT_PUBLIC_TITLE}</h1>
          <div className="w-px h-4 bg-gray-300 mx-2"></div>
          <div className="flex items-center cursor-pointer text-slate-700  mr-5">
            <LeftOutlined />
            <span>返回首页</span>
          </div>
          <div
            onClick={async () => {
              await saveWork();
            }}
            className="flex items-center cursor-pointer text-slate-700"
          >
            <CloudUploadOutlined />
            <span className="ml-2">音频未保存</span>
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
          <Button className="mr-4" type="primary">
            生成音频
          </Button>
          <Avatar size={34} icon={<UserOutlined />} />
        </div>
      </div>
    </header>
  );
}
