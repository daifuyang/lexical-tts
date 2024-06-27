import { getNumberOptions } from "@/components/lexical.bak/utils/number";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setFloatEditValue } from "@/redux/slice/initialState";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { INSERT_SYMBOL_COMMAND, OPEN_SYMBOL_POPUP_COMMAND } from "../../plugins/symbolPlugin";

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

    return (
        <div>
            <ul className="rounded-xl bg-white overflow-hidden border">
                {options?.map((item: any) => {
                    const {value} = item
                    return (
                        <li className="py-2 px-3 cursor-pointer hover:bg-gray-100" key={value}>
                            <span className="inline-block w-full" onMouseDown={(e) => {
                                e.preventDefault();
                                dispatch(setFloatEditValue(value));
                                editor.dispatchCommand(INSERT_SYMBOL_COMMAND, item)
                            }}>{item.label}</span>
                        </li>
                    )
                })
                }
            </ul>
        </div>
    )
};