"use client"
import { ReactNode, useRef } from "react";
import { Space, Divider, Popconfirm, message } from 'antd';
import { ActionType, PageContainer, ProTable } from "@ant-design/pro-components";
import type { ProColumns } from '@ant-design/pro-table';
import { deleteSystemDict, getSystemDictList } from "@/services/admin/systemDict";
import SaveModal from "./save";
import type { DictItem } from './typings.d'
import { useRouter } from "next/navigation";
import dayjs from "dayjs";


const statusValueEnum: any = {
    0: 'disabled',
    1: 'enabled',
}

const statusKeyEnum: any = {
    disabled: 0,
    enabled: 1,
}

export default function Dict() {

    const router = useRouter();
    const actionRef = useRef<ActionType>(undefined);
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
            render: (text: ReactNode, record) => {
                return <a onClick={() => {
                    router.push(`/admin/system/dict/data/${record.id}`)
                }}>{text}</a>
            }
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
            hideInSearch: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTimeRange',
            hideInTable: true,
            search: {
              transform: (value) => {
                return {
                  createdStartAt: dayjs(value[0]).unix(),
                  createdEndAt: dayjs(value[1]).unix(),
                };
              },
            },
          },
        {
            title: '操作',
            width: 80,
            valueType: 'option',
            key: 'option',
            render: (text: ReactNode, record: DictItem) => {
                return (
                    <Space split={<Divider type="vertical" />}>
                        <SaveModal trigger={<a>修改</a>} onOk={() => {
                            actionRef.current?.reload()
                        }} values={{ ...record, status: record.status === 'enabled' ? true : false }} />
                        <Popconfirm title="确认删除" onConfirm={async () => {
                            const res: any = await deleteSystemDict(record.id)
                            if (res.code === 1) {
                                message.success(res.msg)
                                actionRef.current?.reload()
                                return
                            }
                            message.error(res.msg);
                        }}>
                            <a style={{ color: '#ff4d4f' }}>删除</a>
                        </Popconfirm>
                    </Space>
                )
            }
        },
    ];

    return (
        <PageContainer>
            <ProTable<DictItem> rowKey="id" actionRef={actionRef} headerTitle="字典管理"
                toolBarRender={() => [
                    <SaveModal key="create" onOk={() => {
                        actionRef.current?.reload()
                    }} />
                ]}
                columns={columns} request={async (params, sort, filter) => {
                    const res: any = await getSystemDictList({...params, status: statusKeyEnum[params.status]})
                    if (res.code === 1) {
                        const data = res.data.data.map((item: any) => {
                            return {
                                ...item,
                                status: statusValueEnum[item.status],
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