import { PauseOutlined } from "@ant-design/icons";
import { InputNumber, Popover, Radio } from "antd";
import { useState } from "react";

const options = [
    { label: "100ms", value: 100 },
    { label: "150ms", value: 150 },
    { label: "200ms", value: 200 },
    { label: "300ms", value: 300 },
    { label: "400ms", value: 400 },
    { label: "600ms", value: 600 }
  ]

export default function Pause(props: any) {
  const { value, onChange } = props;
  const [open, setOpen] = useState(true);

  const [pauseValue, setPauseValue] = useState(value);

  let isDiyValue = true
  
  for (let index = 0; index < options.length; index++) {
    const item = options[index];
    if(value === item.value) {
      isDiyValue = false;
      break
    }
    
  }

  return (
    <Popover
      open={open}
      onOpenChange={(open: boolean) => {
        setOpen(open);
      }}
      content={
        <div>
          <h5 className="mb-2">选择停顿</h5>
          <div className="mb-2">
            <Radio.Group
              options={options}
              value={isDiyValue ? undefined :  pauseValue }
              onChange={(e) => {
                const { value } = e.target;
                setPauseValue(value);
                if (onChange) {
                  onChange(value);
                }
              }}
              optionType="button"
            />
          </div>
          <h5 className="mb-2">自定义</h5>
          <div className="flex items-center">
            <InputNumber
              style={{ width: 120 }}
              placeholder="自定义"
              min={0}
              max={5000}
              addonAfter="ms"
              defaultValue={isDiyValue ? pauseValue : undefined}
              onChange={(value) => {
                setPauseValue(value);
                if (onChange) {
                  onChange(value);
                }
              }}
            />
            <span className="ml-2">有效值的范围为 0 到 5000 毫秒。 </span>
          </div>
        </div>
      }
      trigger="click"
    >
      <span className="editor-pause">
        <span className="pause-tag">
          <span className="pause-tag-text">{pauseValue}ms</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="tag-close-icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path>
          </svg>
        </span>
        <span>
          <PauseOutlined />
        </span>
      </span>
    </Popover>
  );
}
