import { WeChatPayV3 } from "@/wechatpay-node";
import { Config } from "@/wechatpay-node/src/core/config";
import { AlipaySdk } from 'alipay-sdk';

const wechatConfig = {
    appId: process.env.WECHAT_APP_ID as string,
    mchId: process.env.WECHAT_MCH_ID as string,
    privateKeyPath: process.env.WECHAT_PRIVATE_KEY_PATH as string,
    serialNo: process.env.WECHAT_SERIAL_NO as string,
    apiV3Key: process.env.WECHAT_API_V3_KEY as string,
    notifyUrl: process.env.WECHAT_NOTIFY_URL as string
} as Config

export const wechatPay = new WeChatPayV3(wechatConfig);

/* const alipaySdk = new AlipaySdk({
  appId: process.env.ALIPAY_APP_ID,
  privateKey: process.env.ALIPAY_PRIVATE_KEY,
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
  gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
  signType: 'RSA2'
});

export const alipay = {
  async createOrder(order: {
    out_trade_no: string;
    total_amount: number;
    subject: string;
    body?: string;
    time_expire?: string;
  }) {
    const method = 'alipay.trade.precreate';
    
    const result = await alipaySdk.exec(method, {
      bizContent: JSON.stringify({
        out_trade_no: order.out_trade_no,
        total_amount: (order.total_amount / 100).toFixed(2),
        subject: order.subject,
        body: order.body || order.subject,
        time_expire: order.time_expire,
        product_code: 'FACE_TO_FACE_PAYMENT'
      })
    });

    return result;
  }
}; */
