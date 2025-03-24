"use client";
import { PageContainer } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Divider, Space, message } from "antd";
import { useRef, useState } from "react";
import SaveModal from "./save";
import { voiceList } from "@/services/admin/voice";

type STATUS = "all" | "enable" | "disabled";

interface TtsVoice {
  id: number;
  name: string;
  Gender: number;
  locale: string;
  style: string;
  sampleRateHertz: number;
  voiceType: string;
  status: STATUS;
  wordsPerMinute: number;
}

const valueEnum = {
  0: "disabled",
  1: "enabled"
};

const statusEnum: any = {
  all: "",
  enabled: 1,
  disabled: 0
};

export default function Page() {
  const actionRef = useRef<ActionType>(undefined);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [type, setType] = useState<"create" | "update">("create");

  const add = () => {
    setOpen(true);
  };

  const edit = (record: any) => {
    setOpen(true);
    setFormData(record);
  };

  const columns: ProColumns<TtsVoice>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      search: false
    },
    {
      title: "主播名称",
      dataIndex: "name",
      width: 200,
      key: "name",
      align: "center"
    },
    {
      title: "接口来源",
      dataIndex: "source",
      key: "source",
      width: 100,
      search: false,
      align: "center"
    },
    {
      title: "主播标识",
      dataIndex: "shortName",
      key: "shortName",
      width: 200,
      align: "center"
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      search: false,
      width: 100,
      align: "center",
      renderText(text, record, index, action) {
        return text === 1 ? "男" : "女";
      }
    },
    {
      title: "语言环境",
      dataIndex: "locale",
      key: "locale",
      search: false,
      width: 150,
      align: "center"
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      key: "status",
      align: "center",
      valueEnum: {
        all: { text: "全部" },
        enabled: { text: "启用" },
        disabled: { text: "禁用" }
      }
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      width: 120,
      render: (text, record: any, _, action) => [
        <Space split={<Divider type="vertical" />}>
          <a
            onClick={() => {
              const status = statusEnum[record.status];
              edit({ ...record, status });
            }}
          >
            编辑
          </a>
          <a style={{ color: "#faad14" }}>禁用</a>
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
      <ProTable<any>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          if (params.status) {
            params.status = statusEnum[params.status as STATUS];
          }
          const res: any = await voiceList(params);
          if (res.code === 1) {
            return {
              success: true,
              data: res.data.data?.map((item: { status: 0 | 1 }) => ({
                ...item,
                status: valueEnum[item.status]
              })),
              total: res.data.total
            };
          }
          message.error(res.msg);
          return {
            success: false
          };
        }}
        pagination={{
          pageSize: 10
        }}
        rowKey="id"
        search={{
          labelWidth: "auto"
        }}
        options={{
          setting: {
            listsHeight: 400
          }
        }}
        editable={{
          type: "multiple"
        }}
        rowKey="id"
        search={{
          labelWidth: "auto"
        }}
        options={{
          setting: {
            listsHeight: 400
          }
        }}
        headerTitle="主播列表"
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
