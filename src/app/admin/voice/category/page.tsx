"use client";

import { Button, Divider, Space, message } from "antd";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import SaveModal from "./save";
import { getVoiceCategoryList } from "@/services/voice";

interface Anchor {
  name: string;
  description: string;
  status: boolean;
}

const statusEnum = {
  1: "enabled",
  0: "disabled"
};

export default function Category() {
  const actionRef = useRef<ActionType>(undefined);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const add = () => {
    setOpen(true);
  };

  const edit = (record: any) => {
    setOpen(true);
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
      valueEnum: {
        enabled: { text: "启用", status: "Success" },
        disabled: { text: "禁用", status: "Error" }
      }
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      width: 160,
      render: (text, record: any, _, action) => [
        <Space split={<Divider type="vertical" />}>
          <a
            onClick={() => {
              const status = record.status  === "enabled" ? "1" : "0"
              edit({...record,status});
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
        open={open}
        formData={formData}
        onFinish={() => {
          setOpen(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setFormData({});
          setOpen(false);
        }}
      />
      <ProTable<Anchor>
        columns={columns}
        actionRef={actionRef}
        cardBordered={true}
        rowKey="id"
        headerTitle="分类列表"
        request={async (params, sort, filter) => {
          const res: any = await getVoiceCategoryList(params);
          if (res.code === 1) {
            return {
              success: true,
              data: res.data.data?.map((item: { status: 0 | 1 }) => ({
                ...item,
                status: statusEnum[item.status]
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
