import { Space, Table, Divider } from "antd";

export default function List() {
  const dataSource = [
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号"
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号"
    }
  ];

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index"
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "主播",
      dataIndex: "voice",
      key: "voice"
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
      render: (_, record) => (
        <Space size="middle" split={ <Divider type="vertical" /> }>
          <a>编辑</a>
          <a>下载</a>
          <a style={{color:'#ff4d4f'}}>删除</a>
        </Space>
      )
    }
  ];

  return <Table dataSource={dataSource} columns={columns} />;
}
