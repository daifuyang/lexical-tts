import { PauseOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { useState } from "react";

export default function Pause() {

    const [open, setOpen] = useState(true);

    return (
        <Popover open={open} onOpenChange={ (open: boolean) => {
            setOpen(open);
        } } content={<h1>hello h1</h1>} trigger="click">
            <span className="editor-pause">
                <span className="pause-tag"><span className="pause-tag-text">200ms</span><svg xmlns="http://www.w3.org/2000/svg" fill="#000" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="tag-close-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
                </svg></span>
                <span>
                    <PauseOutlined />
                </span>
            </span>
        </Popover>
    );
}