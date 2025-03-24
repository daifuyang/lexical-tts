"use client"

import { ReactNode, useEffect, useRef, useState, use } from "react";
import { ActionType, PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Divider, message, Popconfirm, Space } from "antd";
import type { DictDataItem, DictItem } from "../../typings";
import SaveModal from './save';
import { getSystemDictDetail } from "@/services/admin/systemDict";
import { useRouter } from "next/navigation";
import { deleteSystemDictData, getSystemDictDataList } from "@/services/admin/systemDictData";

const statusValueEnum: any = {
    0: 'disabled',
    1: 'enabled',
}

const statusKeyEnum: any = {
    disabled: 0,
    enabled: 1,
}

export default function DictData(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);

    const { id } = params;
    const [sysDictType, setSysDictType] = useState<DictItem>();
    const [loading, setLoading] = useState(false);
    const actionRef = useRef<ActionType>(undefined);
    const router = useRouter();

    // 定义 columns 的数组
    const columns: ProColumns<DictDataItem>[] = [
        {
            title: 'ID',
            width: 50,
            dataIndex: 'id',
            key: 'id',
            hideInSearch: true,
        },
        {
            title: '字典标签',
            width: 80,
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: '字典键值',
            width: 80,
            dataIndex: 'value',
            key: 'value',
            hideInSearch: true,
        },
        {
            title: '字典排序',
            width: 80,
            dataIndex: 'sort_order',
            key: 'value',
            hideInSearch: true,
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
            title: '操作',
            width: 80,
            valueType: 'option',
            key: 'option',
            render: (text: ReactNode, record) => {
                return (
                    <Space split={<Divider type="vertical" />}>
                        <SaveModal trigger={<a>修改</a>} onOk={() => {
                            actionRef.current?.reload()
                        }} values={{ ...record, type: sysDictType?.type, status: record.status === 'enabled' ? true : false }} />
                        <Popconfirm title="确认删除" onConfirm={async () => {
                            const res: any = await deleteSystemDictData(record.id)
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res: any = await getSystemDictDetail(Number(id))
            setLoading(false)
            if (res.code === 1) {
                setSysDictType(res.data)
                return
            }
            message.error(res.msg);
        }
        fetchData()
    }, [id])

    return (
        <PageContainer loading={loading} title={sysDictType?.name || '字典数据'} onBack={() => {
            router.replace('/admin/system/dict')
        }}>
            <ProTable headerTitle={sysDictType?.name || '字典数据'} rowKey="id" columns={columns} actionRef={actionRef} toolBarRender={() => [
                <SaveModal key="create" onOk={() => {
                    actionRef.current?.reload()
                }} values={{ type: sysDictType?.type }} />
            ]} request={async (params, sort, filter) => {
                const res: any = await getSystemDictDataList({
                    ...params,
                    status: statusKeyEnum[params.status],
                    type: sysDictType?.type
                })
                if (res.code === 1) {

                    const data = res.data.map((item: any) => {
                        return {
                            ...item,
                            status: statusValueEnum[item.status],
                        }
                    })

                    return {
                        success: true,
                        data,
                    }
                }
                return {
                    success: false
                }
            }} pagination={false} />
        </PageContainer>
    )
}