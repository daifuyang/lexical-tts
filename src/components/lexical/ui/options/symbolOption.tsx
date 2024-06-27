import { getNumberOptions } from "@/components/lexical.bak/utils/number";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setFloatEditValue } from "@/redux/slice/initialState";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Menu } from "antd";
import { useEffect, useState } from "react";

export default function SymbolOption() {

    const [editor] = useLexicalComposerContext();
    const dispatch = useAppDispatch();
    const initialState = useAppSelector((state) => state.initialState);
    const { selectionText, floatEditValue } = initialState;


    const [options, setOptions] = useState<string[]>([]);
    useEffect(() => {
        const _text = selectionText;
        if (_text) {
            const _options = getNumberOptions(Number(_text));
            setOptions(_options);
        }
    }, [selectionText]);

    const items = options?.map((item: any) => {
        return {
            key: item.value,
            label: item.label,
        }
    })

    return (
        <Menu items={items} onClick={({item}: any) => {
            const { value } = item;
            if (value) {
                dispatch(setFloatEditValue(value));
            }
        }} selectedKeys={[floatEditValue || ""]} style={{ border: "none" }} />
    );
};