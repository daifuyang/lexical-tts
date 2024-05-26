'use client'

import { createVoiceCategory } from "@/services/admin/voiceCategory";
import { ModalForm, ProFormRadio, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect, useState } from "react";

export default function Save(props: any) {
  const { open, setOpen, formData, type, onCancel } = props;

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
          setOpen(false);
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
        let res = null;
        if (type === "create") {
          res = await createVoiceCategory(values)
        }
        console.log("values", values, res);
      }}
      initialValues={formData}
    >
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
