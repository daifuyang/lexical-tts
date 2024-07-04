import { ModalForm, ProFormText, ProFormSwitch, ProFormTextArea, ProFormDigit } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { cloneElement, useState } from 'react';
import type { DictDataItem } from '../../typings';
import { addSystemDictData, updateSystemDictData } from '@/services/admin/systemDictData';

export interface SaveModalFormProps {
    trigger?: JSX.Element;
    onOk?: () => void;
    values?: Partial<Omit<DictDataItem, 'status'> & { status: boolean }>;
};

export default function SaveModalForm(props: SaveModalFormProps) {

    const { onOk, trigger, values = {} } = props;
    const { id, type } = values;
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
                id ? '修改字典数据' : '添加字典数据'
            }
            onOpenChange={(change) => {
                setOpen(change)
            }}
            onFinish={async (values) => {
                let res: any = null;
                const data = { ...values, type ,status: values?.status ? 1 : 0 }
                if (id) {
                    res = await updateSystemDictData(id, data)
                } else {
                    res = await addSystemDictData(data)
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
            <ProFormText name="id" label="ID" hidden />
            <ProFormText label="字典类型" name="type" disabled placeholder="请输入字典类型" />
            <ProFormText label="数据标签" name="label" rules={[
                { required: true, message: '请输入数据标签' }]} placeholder="请输入数据标签" />
            <ProFormText label="数据键值" name="value" rules={[
                { required: true, message: '请输入数据键值' }]} placeholder="请输入数据键值" />
            <ProFormDigit label="排序" name="sort_order" fieldProps={{ precision: 0 }} />
            <ProFormSwitch label="状态" name="status" initialValue={true} />
            <ProFormTextArea label="备注" name="remark" placeholder="请输入备注"
            />
        </ModalForm>
    );
};