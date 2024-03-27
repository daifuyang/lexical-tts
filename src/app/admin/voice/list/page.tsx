"use client";
import { PageContainer } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef, useState } from "react";
import SaveModal from "./save";

interface TtsVoice {
  id: number;
  name: string;
  Gender: number;
  locale: string;
  style: string;
  sampleRateHertz: number;
  voiceType: string;
  status: boolean;
  wordsPerMinute: number;
}

const columns: ProColumns<TtsVoice>[] = [
  {
    dataIndex: "index",
    valueType: "indexBorder",
    width: 48
  },
  {
    title: "主播名称",
    dataIndex: "name",
    key: "name",
    width: 150,
    align: "center"
  },
  {
    title: "性别",
    dataIndex: "Gender",
    key: "Gender",
    width: 100,
    align: "center"
  },
  {
    title: "语言环境",
    dataIndex: "locale",
    key: "locale",
    width: 150,
    align: "center"
  },
  {
    title: "语音风格",
    dataIndex: "style",
    key: "style",
    width: 150,
    align: "center"
  },
  {
    title: "采样率",
    dataIndex: "sampleRateHertz",
    key: "sampleRateHertz",
    width: 150,
    align: "center"
  },
  {
    title: "语音类型",
    dataIndex: "voiceType",
    key: "voiceType",
    width: 150,
    align: "center"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    align: "center"
  },
  {
    title: "朗读速度",
    dataIndex: "wordsPerMinute",
    key: "wordsPerMinute",
    width: 150,
    align: "center"
  },
  {
    title: "操作",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "复制" },
          { key: "delete", name: "删除" }
        ]}
      />
    ]
  }
];

export default function Page() {
  const actionRef = useRef<ActionType>();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"create" | "update">("create");

  const add = () => {
    setOpen(true);
    setType("create");
  };

  return (
    <PageContainer>
      <SaveModal type={type} open={open} setOpen={setOpen} />
      <ProTable<any>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          return [];
        }}
        editable={{
          type: "multiple"
        }}
        columnsState={{
          persistenceKey: "pro-table-singe-demos",
          persistenceType: "localStorage",
          defaultValue: {
            option: { fixed: "right", disable: true }
          },
          onChange(value) {
            console.log("value: ", value);
          }
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
          <Button key="button" icon={<PlusOutlined />} onClick={() => {
            add()
          }} type="primary">
            新建
          </Button>
        ]}
      />
    </PageContainer>
  );
}
