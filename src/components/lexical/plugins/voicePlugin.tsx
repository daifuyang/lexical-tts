"use client";

import { SearchOutlined, StarOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { Input, Modal, Select, Tabs, Avatar, Tag, Button, Slider } from "antd";
import type { TabsProps } from "antd";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from "lexical";
import { useEffect, useState } from "react";

export const OPEN_VOICE_MODAL_COMMAND: LexicalCommand<undefined> = createCommand('OPEN_VOICE_MODAL_COMMAND');

export default function VoicePlugin() {

  const [open, setOpen] = useState(false)

  const onChange = (key: string) => {
    console.log(key);
  };

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
      
      return mergeRegister(
          editor.registerCommand<number>(
            OPEN_VOICE_MODAL_COMMAND,
              (payload) => {
                  const selection = $getSelection();
                  if (!$isRangeSelection(selection)) {
                      return false;
                  }
                  setOpen(true)
                  return true;
              },
              COMMAND_PRIORITY_EDITOR,
          ),
      );
  }, [editor]);


  const items: TabsProps["items"] = [
    {
      key: "all",
      label: "全部主播"
    },
    {
      key: "collect",
      label: "收藏主播"
    }
  ];

  return (
    <Modal
      className="voice-modal"
      title={
        <Tabs tabBarStyle={{ margin: 0 }} defaultActiveKey="1" items={items} onChange={onChange} />
      }
      width="1000px"
      open={open}
      footer={false}
      maskClosable={false}
      onCancel={ () => {
        setOpen(false);
      } }
    >
      <div className="voice-container">
        <div className="voice-list">
          <div className="voice-header">
            <div className="voice-search">
              <Input placeholder="请输入主播名称" prefix={<SearchOutlined />} />
            </div>
            <div className="voice-filter">
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "性别" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "年龄" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "领域" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "风格" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
              <Select
                placeholder="Borderless"
                variant="borderless"
                className="voice-filter-item"
                defaultValue=""
                options={[
                  { value: "", label: "语种" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" }
                ]}
              />
            </div>
          </div>
          <div className="voice-content">
            <div className="voice-body">
              <div className="voice-cards">
                {new Array(10).fill(0).map((item) => {
                  return <div className="voice-card-item">
                    <div className="voice-card">
                      <div className="voice-card-avatar">
                        <Avatar style={{ backgroundColor: '#7265e6', verticalAlign: 'middle' }} size="large" gap={4}>
                          富阳
                        </Avatar>
                      </div>
                      <div className="vocie-card-content">
                        <div className="voice-card-title">
                          晓晓
                        </div>
                        <div className="voice-card-tags">
                          <Tag bordered={false} color="processing">
                            小说、教育
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="voice-detail">
          <div className="voice-detail-voice">
            <div className="voice-detail-voice-avatar">
              <Avatar style={{ backgroundColor: '#7265e6', verticalAlign: 'middle' }} size="large" gap={4}>晓晓</Avatar>
            </div>
            <div className="voice-detail-voice-content">
              <div className="voice-detail-voice-content-title-wrap">
                <span className="voice-detail-voice-content-title">晓晓</span>
                <span className="voice-detail-voice-content-collect">
                  <StarOutlined style={{ fontSize: 14, marginRight: 2 }} /><span>收藏</span>
                </span>
              </div>
              <div className="voice-detail-voice-content-desc">
                亲切温和
              </div>
            </div>
          </div>
          <div className="voice-detail-style">
            {
              new Array(10).fill(0).map((item) => {
                return (
                  <div className="voice-detail-style-item">
                    <div className="voice-detail-style-item-wrap">
                      <div className="voice-detail-style-item-avatar">
                        <Avatar style={{ backgroundColor: '#7265e6', verticalAlign: 'middle' }} size="small" gap={4}>默</Avatar>
                      </div>
                      <div className="voice-detail-style-item-title">默认</div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="voice-detail-slider">
            <div className="voice-detail-slider-group">
              <h2 className="voice-detail-slider-title">语速</h2>
              <div className="voice-detail-slider-container">
                <div className="voice-detail-slider-wrap">
                  <span className="voice-detail-slider-start-label">慢</span>
                  <Slider style={{ width: '100%' }} defaultValue={30} />
                  <span className="voice-detail-slider-end-label">快</span>
                </div>
                <div className="voice-detail-slider-btn">
                  <Button size="small">默认</Button>
                </div>
              </div>
            </div>
            <div className="voice-detail-slider-group">
              <h2 className="voice-detail-slider-title">音量</h2>
              <div className="voice-detail-slider-container">
                <div className="voice-detail-slider-wrap">
                  <span className="voice-detail-slider-start-label">慢</span>
                  <Slider style={{ width: '100%' }} defaultValue={30} />
                  <span className="voice-detail-slider-end-label">快</span>
                </div>
                <div className="voice-detail-slider-btn">
                  <Button size="small">默认</Button>
                </div>
              </div>
            </div>
            <div className="voice-detail-slider-group">
              <h2 className="voice-detail-slider-title">语调</h2>
              <div className="voice-detail-slider-container">
                <div className="voice-detail-slider-wrap">
                  <span className="voice-detail-slider-start-label">慢</span>
                  <Slider style={{ width: '100%' }} defaultValue={30} />
                  <span className="voice-detail-slider-end-label">快</span>
                </div>
                <div className="voice-detail-slider-btn">
                  <Button size="small">默认</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
