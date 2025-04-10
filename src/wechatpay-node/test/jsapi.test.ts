import { WeChatPayV3Config } from '../src/types/common';
import { WeChatPayV3 } from '../src';
import { Config } from '../src/core/config';
import { describe, it, expect } from '@jest/globals';

// 测试配置 - 从环境变量读取并验证
function getConfig(): WeChatPayV3Config {
  const requiredVars = [
    'WECHAT_APP_ID',
    'WECHAT_MCH_ID', 
    'WECHAT_PRIVATE_KEY_PATH',
    'WECHAT_SERIAL_NO',
    'WECHAT_API_V3_KEY',
    'WECHAT_NOTIFY_URL'
  ];

  const missingVars = requiredVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    throw new Error(`缺少必要的微信支付环境变量: ${missingVars.join(', ')}`);
  }

  return {
    appId: process.env.WECHAT_APP_ID as string,
    mchId: process.env.WECHAT_MCH_ID as string,
    privateKeyPath: process.env.WECHAT_PRIVATE_KEY_PATH as string,
    serialNo: process.env.WECHAT_SERIAL_NO as string,
    apiV3Key: process.env.WECHAT_API_V3_KEY as string,
    notifyUrl: process.env.WECHAT_NOTIFY_URL as string
  };
}

const TEST_CONFIG = new Config(getConfig());

describe('WeChatPayV3 JSAPI Payment', () => {
  const wechatPay = new WeChatPayV3(TEST_CONFIG);

  it('should create jsapi payment order', async () => {
    const order = {
      appid: process.env.WECHAT_APP_ID as string,
      mchid: process.env.WECHAT_MCH_ID as string,
      description: '测试商品',
      out_trade_no: `TEST_JSAPI_${Date.now()}`,
      amount: {
        total: 1, // 测试金额1分钱
        currency: 'CNY'
      },
      notify_url: 'https://yourdomain.com/notify',
      payer: {
        openid: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o' // 测试openid
      }
    };

    try {
      const result = await wechatPay.jsapi.createTransaction(order);
      expect(result).toHaveProperty('prepay_id');
      console.log('JSAPI Payment prepay_id:', result.prepay_id);
    } catch (error) {
      console.error('JSAPI Payment Error:', error);
      throw error;
    }
  });

  it('should query order', async () => {
    const transactionId = '4200002661202504095754982514'; // 替换为实际交易单号
    try {
      const result = await wechatPay.jsapi.queryOrder({
        transaction_id: transactionId,
        mchid: TEST_CONFIG.mchId
      });
      expect(result).toHaveProperty('trade_state');
      console.log('Order Status:', result.trade_state);
    } catch (error) {
      console.error('Query Order Error:', error);
      throw error;
    }
  });
});
