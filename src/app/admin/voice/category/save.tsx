"use client";

import { createVoiceCategory, updateVoiceCategory } from "@/services/admin/voiceCategory";
import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect } from "react";

export default function Save(props: any) {
  const { open, setOpen, formData, type, onFinish, onCancel } = props;

  useEffect(() => {
    if (open) {
    }
  }, [open]);

  return (
    <ModalForm
      title={type === "create" ? "新增" : "编辑"}
      open={open}
      width={520}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          if (onCancel) {
            onCancel();
          }
        }
      }}
      labelCol={{
        span: 6
      }}
      wrapperCol={{
        span: 16
      }}
      layout="horizontal"
      onFinish={async (values: any) => {
        let res: any = null;
        const { id } = values;
        if (id) {
          res = await updateVoiceCategory(id, values);
        } else {
          res = await createVoiceCategory(values);
        }
        if (res.code === 1) {
          message.success(res.msg);
          if(onFinish) {
            onFinish(true)
          }
        }else {
          message.error(res.msg);
        }
      }}
      initialValues={formData}
    >
      <ProFormText name="id" label="分类ID" hidden={true} />
      <ProFormText name="name" label="分类名称" placeholder="请输入分类名称" />
      <ProFormText name="desc" label="分类描述" placeholder="请输入主播分类描述" />
      <ProFormSelect
        name="status"
        label="启用状态"
        initialValue={"1"}
        options={[
          {
            label: "启用",
            value: "1"
          },
          {
            label: "停用",
            value: "0"
          }
        ]}
      />
    </ModalForm>
  );
}
