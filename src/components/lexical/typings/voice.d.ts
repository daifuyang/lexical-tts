export interface OpenVoicePayload {
    type?: "global"
    voice?: string
}

export interface InsertVoicePayload {
    name: string; // 显示名称
    shortName: string; // 主播标识
    style: string; // 风格
    styleName: string; // 风格名称
    rate: number; // 语速
    volume: number; // 音量
    pitch: number; // 音调
}