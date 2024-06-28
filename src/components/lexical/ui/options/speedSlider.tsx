import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button, Slider } from "antd";
import { useState } from "react";
import { INSERT_SPEED_COMMAND, UPDATE_SPEED_COMMAND } from "../../plugins/speedPlugin";
import { setFloatEditValue } from "@/redux/slice/initialState";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

export function SpeedSlider() {
    const [editor] = useLexicalComposerContext();
    const dispatch = useAppDispatch();

    const initialState = useAppSelector((state) => state.initialState);
    const { floatEditValue, nodeKey } = initialState;

    const [sliderValue, setSliderValue] = useState<number>(0);
    return (
        <div style={{ backgroundColor: '#fff', width: 300, display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <span style={{ margin: "0 4px" }}>慢</span>
                <div style={{ flex: 1 }}>
                    <Slider
                        onChange={(value) => {
                            setSliderValue(value);
                        }}
                        defaultValue={Number(floatEditValue) || 0}
                        min={-10}
                        max={10}
                        step={1}
                        tooltip={{ open: true }}
                    />
                </div>
                <span style={{ margin: "0 4px" }}>快</span>
            </div>
            <Button
                onMouseDown={(e) => {
                    e.preventDefault();
                    const value = sliderValue.toString()
                    dispatch(setFloatEditValue(value));
                    if (nodeKey) {
                        editor.dispatchCommand(UPDATE_SPEED_COMMAND, {
                            key: nodeKey,
                            speed: value
                        })
                    } else {
                        editor.dispatchCommand(INSERT_SPEED_COMMAND, value)
                    }
                }}
                style={{ marginLeft: 4 }}
                type="primary"
            >
                确定
            </Button>
        </div>
    );
};
