"use client"
import { ReactNode } from "react";
import { Space } from 'antd';
import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ProColumns } from '@ant-design/pro-table';
import { getSystemDictList } from "@/services/admin/systemDict";

const valueEnum: any = {
    0: 'disabled',
    1: 'enabled',
}

export default function Dict() {

    // 定义数据的接口
    interface DictItem {
        id: number;
        name: string;
        type: string;
        status: number;
        remark: string;
        createTime: string;
    }

    // 定义 columns 的数组
    const columns: ProColumns<DictItem>[] = [
        {
            title: 'ID',
            width: 50,
            dataIndex: 'id',
            key: 'id',
            hideInSearch: true,
        },
        {
            title: '字典名称',
            width: 100,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '字典类型',
            width: 100,
            dataIndex: 'type',
            key: 'type',
        },

        {
            title: '备注',
            width: 100,
            dataIndex: 'remark',
            key: 'remark',
            hideInSearch: true,
        },
        {
            title: '创建时间',
            width: 100,
            dataIndex: 'createTime',
            key: 'createTime',
            valueType: 'dateTime',
        },
        {
            title: '状态',
            width: 80,
            dataIndex: 'status',
            key: 'status',
            valueEnum: {
                all: { text: '默认' },
                enabled: { text: '启用', status: 'Success' },
                disabled: { text: '禁用', status: 'Default' },
            },
        },
        {
            title: '操作',
            width: 80,
            valueType: 'option',
            key: 'option',
            render: (text: ReactNode, record: DictItem) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>修改</a>
                    <a onClick={() => handleDelete(record.id)}>删除</a>
                </Space>
            ),
        },
    ];

    // 定义编辑和删除操作函数的类型
    const handleEdit = (record: DictItem) => {
        // 编辑操作的逻辑
        console.log('Edit:', record);
    };

    const handleDelete = (id: number) => {
        // 删除操作的逻辑
        console.log('Delete:', id);
    };

    return (
        <PageContainer>
            <ProTable<DictItem> headerTitle="字典管理" columns={columns} request={async () => {
                const res: any = await getSystemDictList()
                if (res.code === 1) {

                    const data = res.data.data.map((item: any) => {
                        return {
                            ...item,
                            status: valueEnum[item.status],
                        }
                    })

                    return {
                        data,
                        success: true,
                        total: res.data.total,
                    }
                }
                return {
                    success: false
                }
            }} />
        </PageContainer>
    )
}