"use client";

import { Modal, Tabs, TabsProps } from 'antd';

export default function VoicePlugin() {

    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'all',
            label: '全部主播',
        },
        {
            key: 'collect',
            label: '收藏',
        },
    ];

    return (
        <Modal className='voice-modal' title={
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        } width="1000px" open={true} footer={false}>
            <div className="voice-container">
                <div className='voice-list'></div>
                <div className='voice-detail'></div>
            </div>
        </Modal>
    )
}