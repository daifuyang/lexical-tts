import { ModalForm, ProFormText, ProFormSwitch, ProFormTextArea, ActionType } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { cloneElement, useCallback, useState } from 'react';
import type { DictItem } from './typings.d'
import { addSystemDict, updateSystemDict } from '@/services/admin/systemDict';

export interface SaveModalFormProps {
    trigger?: JSX.Element;
    onOk?: () => void;
    values?: Partial<Omit<DictItem, 'status'> & { status: boolean }>;
};

export default function SaveModalForm(props: SaveModalFormProps) {

    const { onOk, trigger, values = {} } = props;
    const { id } = values;
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    return (
        <ModalForm
            form={form}
            initialValues={values}
            open={open}
            trigger={
                trigger ? cloneElement(trigger, {
                    onClick: setOpen,
                }) : (
                    <Button type="primary" onClick={() => {
                        setOpen(true)
                    }}>
                        新增
                    </Button>
                )
            }
            title={
                id ? '修改字典' : '添加字典'
            }
            onOpenChange={(change) => {
                setOpen(change)
            }}
            onFinish={async (values) => {
                let res: any = null;
                const data = { ...values, status: values?.status ? 1 : 0 }
                if (id) {
                    res = await updateSystemDict(id, data)
                } else {
                    res = await addSystemDict(data)
                }

                if (res?.code === 0) {
                    message.error(res?.msg || '添加失败')
                    return
                }

                onOk?.()
                setOpen(false)
            }}

            request={async () => {
                return true
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    setOpen(false);
                },
            }}
        >
            {/* id */}
            <ProFormText name="id" hidden />

            {/* 名称字段 */}
            <ProFormText
                name="name"
                label="字典名称"
                placeholder="请输入名称"
                rules={[{ required: true, message: '名称为必填项' }]}
            />
            {/* 类型字段 */}
            <ProFormText
                name="type"
                label="字典类型"
                placeholder="请输入类型"
                rules={[{ required: true, message: '类型为必填项' }]}
            />
            {/* 状态字段 */}
            <ProFormSwitch
                name="status"
                label="状态"
                initialValue={true}
            />
            {/* 备注字段 */}
            <ProFormTextArea
                name="remark"
                label="备注"
                placeholder="请输入备注"
            />
        </ModalForm>
    );
};