import { getNumberOptions } from "@/components/lexical/utils/number";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setFloatEditValue } from "@/redux/slice/initialState";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

import classNames from "classnames";

import { INSERT_SYMBOL_COMMAND } from "../../plugins/symbolPlugin";

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
                    const { value } = item
                    return (
                        <li style={{ backgroundColor: floatEditValue === value ? '#369eff' : '' }} className={classNames({
                            'text-white': floatEditValue === value,
                            [`py-2 px-3 cursor-pointer hover:bg-gray-100`]: true
                        })} key={value}>
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