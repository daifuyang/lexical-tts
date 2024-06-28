import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { closeFloat, setFloatEditValue } from "@/redux/slice/initialState";
import { Radio } from "antd";
import { pinyin } from "pinyin-pro";
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_PINYIN_COMMAND } from "../../plugins/pinyinPlugin";

export default function PinyinRadio() {
  const [editor] = useLexicalComposerContext();
  const dispatch = useAppDispatch();
  const initialState = useAppSelector((state) => state.initialState);
  const { selectionText, floatEditValue } = initialState;

  const [options, setOptions] = useState<string[]>([]);
  useEffect(() => {
    const _text = selectionText;
    if (_text) {
      const tone = pinyin(_text, {
        multiple: true // 启用多音字模式
      });
      const _options = tone?.split(" ");
      const toneNone = pinyin(_text, { toneType: "none" });
      if (!_options.includes(toneNone)) {
        _options.push(toneNone);
      }

      setOptions([..._options, '取消']);
    }
  }, [selectionText]);

  return (
    <Radio.Group
      onChange={(e) => {
        const { value } = e.target;
        if (value == '取消') {
          editor.dispatchCommand(INSERT_PINYIN_COMMAND, '')
          dispatch(closeFloat());
          return
        }
        if (value) {
          dispatch(setFloatEditValue(value));
          editor.dispatchCommand(INSERT_PINYIN_COMMAND, value)
        }
      }}
      buttonStyle="solid"
      value={floatEditValue}
    >
      {options?.map((item) => {
        return (
          <Radio.Button key={item} value={item}>
            {item}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
}