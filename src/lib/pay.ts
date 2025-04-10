import { WeChatPayV3 } from "@/wechatpay-node";
import { Config } from "@/wechatpay-node/src/core/config";

const wechatConfig = {
    appId: process.env.WECHAT_APP_ID as string,
    mchId: process.env.WECHAT_MCH_ID as string,
    privateKeyPath: process.env.WECHAT_PRIVATE_KEY_PATH as string,
    serialNo: process.env.WECHAT_SERIAL_NO as string,
    apiV3Key: process.env.WECHAT_API_V3_KEY as string,
    notifyUrl: process.env.WECHAT_NOTIFY_URL as string
} as Config

 export const wechatPay = new WeChatPayV3(wechatConfig);