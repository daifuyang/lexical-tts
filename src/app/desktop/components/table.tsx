import { useEffect, useState } from "react";
import { Space, Table, Divider, message, Popconfirm } from "antd";
import { deleteWork, getWorkList } from "@/services/work";
import { downloadFile } from "@/lib/dowload";
import { useRouter } from "next/navigation";

export default function List() {
  const router = useRouter();

  const [list, setList] = useState([]);

  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchList = async () => {
    const res: any = await getWorkList();
    if (res.code === 1) {
      setList(res.data.data);
    }
  };

  const fetchDelete = async (id: number) => {
    const res: any = await deleteWork(id);
    if (res.code === 1) {
      message.success("删除成功");
      fetchList();
    }
  };

  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "主播",
      dataIndex: "voiceName",
      key: "voiceName"
    },
    {
      title: "时长",
      dataIndex: "duration",
      key: "duration"
    },
    {
      title: "操作",
      key: "action",
      width: 280,
      render: (_: React.ReactNode, record: any) => (
        <Space size="middle" split={<Divider type="vertical" />}>
          <a
            onClick={() => {
              router.push(`/editor?id=${record?.id}`);
            }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              downloadFile(record?.audioUrl);
            }}
          >
            下载
          </a>
          <Popconfirm
            title={"您确认删除吗"}
            onConfirm={() => {
              fetchDelete(record?.id);
            }}
          >
            <a style={{ color: "#ff4d4f" }}>删除</a>
          </Popconfirm>
        </Space>
      )
    }
  ];
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Table
      dataSource={list}
      rowKey="id"
      columns={columns}
      pagination={{
        total,
        current,
        pageSize,
        hideOnSinglePage: true,
        onChange: (page, pageSize) => {
          setCurrent(page);
          setPageSize(pageSize);
        }
      }}
    />
  );
}
