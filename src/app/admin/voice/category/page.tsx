"use client";

import { Button, Divider, Space, message } from "antd";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import SaveModal from "./save";
import { voiceCategoryList } from "@/services/voice";

interface Anchor {
  name: string;
  description: string;
  status: boolean;
}

export default function Category() {
  const actionRef = useRef<ActionType>();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [type, setType] = useState<"create" | "update">("create");

  const add = () => {
    setOpen(true);
    setType("create");
  };

  const edit = (record: any) => {
    setOpen(true);
    setType("update");
    setFormData(record);
  };

  const columns: ProColumns<Anchor>[] = [
    {
      title: "分类名称",
      dataIndex: "name"
    },
    {
      title: "分类描述",
      dataIndex: "desc"
    },
    {
      title: "启用状态",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        true: { text: "已启用", status: "Success" },
        false: { text: "未启用", status: "Error" }
      }
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      width: 160,
      render: (text, record, _, action) => [
        <Space split={<Divider type="vertical" />}>
          <a
            onClick={() => {
              edit(record);
            }}
          >
            编辑
          </a>
          <a style={{ color: "#ff4d44" }}>删除</a>
        </Space>
      ]
    }
  ];

  return (
    <PageContainer>
      <SaveModal
        type={type}
        open={open}
        formData={formData}
        setOpen={setOpen}
        onCancel={() => {
          setFormData({});
        }}
      />
      <ProTable<Anchor>
        columns={columns}
        cardBordered={true}
        rowKey="id"
        headerTitle="分类列表"
        request={async (params, sort, filter) => {
          const res: any = await voiceCategoryList(params);
          if (res.code === 1) {
            return {
              success: true,
              data: res.data.data?.map((item: { status: 0 | 1 }) => ({
                ...item
              })),
              total: res.data.total
            };
          }
          message.error(res.msg);
          return {
            success: false
          };
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              add();
            }}
            type="primary"
          >
            新建
          </Button>
        ]}
      />
    </PageContainer>
  );
}
