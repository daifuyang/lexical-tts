# 微信支付V3 Node.js SDK

## 快速开始

```typescript
import { WeChatPayV3 } from './src';

// 初始化支付实例
const wechatPay = new WeChatPayV3({
  appId: 'wxappid',
  mchId: '商户号',
  privateKeyPath: 'cert/private_key.pem',
  serialNo: '证书序列号',
  apiV3Key: 'APIv3密钥',
  notifyUrl: 'https://your.domain.com/notify'
});

// 创建Native支付订单
const response = await wechatPay.native.createOrder({
  description: "测试商品",
  out_trade_no: `ORDER_${Date.now()}`, // 使用时间戳保证唯一性
  amount: {
    total: 1, // 测试金额1分钱
    currency: "CNY"
  }
});

// 查询订单状态
const order = await wechatPay.native.queryOrder({
  transaction_id: "4200001965202108304123456789",
  mchid: "商户号"
});
```

## 环境变量配置

```typescript
// 从环境变量读取配置（适合生产环境）
import { WeChatPayV3 } from './src';

const wechatPay = new WeChatPayV3({
  appId: process.env.WECHAT_APP_ID,
  mchId: process.env.WECHAT_MCH_ID,
  privateKeyPath: process.env.WECHAT_PRIVATE_KEY_PATH,
  serialNo: process.env.WECHAT_SERIAL_NO,
  apiV3Key: process.env.WECHAT_API_V3_KEY
});
```

## 配置说明

```typescript
interface WeChatPayV3Config {
  appId: string;         // 应用ID
  mchId: string;         // 商户号
  privateKeyPath: string; // PEM私钥文件路径
  serialNo: string;      // 商户证书序列号
  apiV3Key: string;      // APIv3密钥
  notifyUrl?: string;     // 支付通知地址
}
```

## 核心模块

### HTTP客户端

- 自动签名请求
- 支持重试机制（默认3次）
- 统一错误处理
- 请求超时设置（默认10秒）

### 签名机制

- 使用RSA-SHA256算法
- 自动生成随机字符串(nonce_str)
- 请求签名缓存
- 符合微信支付V3签名规范

## 支付接口

### 创建Native支付订单

```typescript
interface NativePaymentRequest {
  description: string;    // 商品描述
  out_trade_no: string;   // 商户订单号
  amount: {
    total: number;        // 金额(分)
    currency?: string;    // 货币类型
  };
  notify_url?: string;    // 支付通知地址
  time_expire?: string;   // 订单失效时间
}

// 返回结构
interface NativePaymentResponse {
  code_url: string;  // 支付二维码链接
}
```

### 订单查询

```typescript
interface QueryOrderRequest {
  transaction_id: string; // 微信支付订单号
  mchid: string;         // 商户号
}

// 使用示例
const order = await nativePay.queryOrder({
  transaction_id: "4200001965202108304123456789",
  mchid: config.mchId
});
```

### 关闭订单

```typescript
// 关闭未支付订单
await nativePay.closeOrder("商户订单号");
```

## 错误处理

- 自动重试服务器错误（5xx状态码，默认3次）
- 结构化错误信息示例：

```typescript
try {
  await wechatPay.native.createOrder(...);
} catch (error) {
  if (error instanceof WeChatPayError) {
    console.error(`[${error.code}] ${error.message}`);
    console.error('请求详情:', error.request);
    console.error('响应数据:', error.response);
  } else {
    console.error('系统错误:', error);
  }
}
```

- 错误对象包含：
  - code: 微信支付错误码（如PARAM_ERROR）
  - message: 可读的错误描述
  - request: 原始请求信息（方法、URL、数据）
  - response: 微信返回的原始响应（状态码、headers、数据）
  - stack: 错误堆栈信息（开发环境）

## 最佳实践

1. 私钥文件应存储在安全位置（不要提交到代码仓库）
2. 使用环境变量管理敏感配置：

```dotenv
# .env 示例
WECHAT_APP_ID=wxappid
WECHAT_MCH_ID=商户号
WECHAT_PRIVATE_KEY_PATH=cert/private_key.pem
WECHAT_SERIAL_NO=证书序列号 
WECHAT_API_V3_KEY=APIv3密钥
```

3. 订单号生成规范：

```typescript
// 使用业务前缀+时间戳+随机字符
const generateTradeNo = (prefix = 'PAY') => 
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
```

4. 支付通知验证：

```typescript
// 验证微信支付签名
const isValid = wechatPay.verifySignature({
  timestamp: headers['wechatpay-timestamp'],
  nonce: headers['wechatpay-nonce'],
  signature: headers['wechatpay-signature'],
  body: rawBody
});
```

5. 测试注意事项：

- 使用1分钱金额进行测试
- 订单号需保证测试唯一性
- 查询接口需要真实transaction_id
- 关闭订单需使用未支付的out_trade_no

## 架构设计

### 目录结构

```
src/
├── core/            # 核心基础设施
│   ├── config.ts    # 配置管理
│   ├── http.ts      # HTTP客户端实现
│   ├── interfaces.ts # 核心接口定义
│   └── sign.ts      # 签名功能
├── services/        # 支付服务实现
│   ├── native.ts    # Native支付服务
│   └── jsapi.ts     # JSAPI支付服务
├── types/           # 类型定义
│   ├── common.ts    # 通用支付类型
│   └── jsapi.ts     # JSAPI特定类型
└── index.ts         # 主入口文件
```

### 设计原则

1. 分层架构：
   - 核心层(core/): 基础通信、签名等基础设施
   - 服务层(services/): 支付业务逻辑实现
   - 类型层(types/): 业务数据结构和接口

2. 接口隔离：
   - IHttpClient: HTTP通信基础能力(保留在core/)
   - 业务接口(INativeService/IJsapiService): 支付业务能力(放在types/)

3. 设计考量：
   - 高内聚：相关功能集中管理
     - HTTP客户端与接口定义放在同一目录
     - 业务类型按支付方式分类
   - 低耦合：
     - 业务服务通过IHttpClient抽象通信
     - 类型定义独立管理，便于复用

4. 扩展性：
   - 新增支付方式只需：
     1. 添加服务实现(services/)
     2. 定义相关类型(types/)
     3. 在主类中暴露接口

## 官方文档参考

- [微信支付V3文档](https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml)
- [签名算法说明](https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml)
