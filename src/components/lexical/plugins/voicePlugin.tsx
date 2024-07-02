"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Input, Modal, Select, Tabs, Divider } from "antd";
import type { TabsProps } from "antd";

export default function VoicePlugin() {
  const onChange = (key: string) => {
    console.log(key);
  };

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
      open={true}
      footer={false}
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
            <div className="voice-cards">
            {new Array(10).fill(0).map((item) => {
              return <div className="voice-card-item">1111</div>
            })}
            </div>
          </div>
        </div>
        <div className="voice-detail">
          <h1>hello h1</h1>
        </div>
      </div>
    </Modal>
  );
}
