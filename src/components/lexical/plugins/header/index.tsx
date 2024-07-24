'use client'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CloudUploadOutlined, EditOutlined, LeftOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input } from "antd";
import { $getRoot, $isParagraphNode, ParagraphNode } from "lexical";
import { useState } from "react";

export default function Header() {

  const [editor] = useLexicalComposerContext();

  const [title, setTitle] = useState(undefined);

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
          <div onClick={() => {
            editor.update( () => {
              const root = $getRoot();
              const first = root.getFirstChild();
              if($isParagraphNode(first)) {
                const firstText = (first as ParagraphNode).getFirstChild();
              }
            })
          } } className="flex items-center cursor-pointer text-slate-700">
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
              value={title}
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
