import { voiceStyleList, createVoice, updateVoice } from "@/services/admin/voice";
import { ModalForm, ProFormRadio, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect, useState } from "react";

export default function Save(props: any) {
  const { open, formData, type, onFinish, onCancel } = props;

  const [styleList, setStyleList] = useState<any>([]);

  const fetchStyleList = async () => {
    const res: any = await voiceStyleList();
    if (res.code === 1) {
      setStyleList(res.data.map((item: any) => ({ label: item.name, value: item.style })));
      return;
    }
    message.error(res.msg);
    setStyleList([]);
  };

  useEffect(() => {
    if (open) {
      fetchStyleList();
    }
  }, [open]);

  return (
    <ModalForm
      title={formData?.id ? "编辑" : "新增"}
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
          res = await updateVoice(id, values);
        } else {
          res = await createVoice(values);
        }

        if (res.code === 1) {
          onFinish?.();
        }
      }}
      initialValues={formData}
    >

      <ProFormText name="id" label="主播ID" hidden={true} />

      <ProFormText name="name" label="主播名称" placeholder="请输入主播名称" />

      <ProFormRadio.Group
        name="gender"
        label="主播性别"
        initialValue={1}
        options={[
          { label: "男", value: 1 },
          { label: "女", value: 0 }
        ]}
      />

      <ProFormSelect
        name="source"
        label="接口来源"
        initialValue="azure"
        options={[{ label: "微软", value: "azure" }]}
      />

      <ProFormText name="shortName" label="主播标识" placeholder="请输入主播标识" />

      <ProFormSelect
        name="style"
        mode="multiple"
        label="主播风格"
        options={styleList}
        fieldProps={{ tokenSeparators: [","] }}
      />

      <ProFormSelect
        name="locale"
        label="语言环境"
        options={[
          {
            label: "中文（普通话，简体）",
            value: "zh-cn"
          },
          {
            label: "中文（吴语，简体）",
            value: "wuu-CN"
          },
          {
            label: "中文（粤语，简体）",
            value: "yue-CN"
          }
        ]}
      />
    </ModalForm>
  );
}
