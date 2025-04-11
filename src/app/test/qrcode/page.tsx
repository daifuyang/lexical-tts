"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { generateQRCode } from '@/lib/qrcode';

export default function QRCodeTestPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // 模拟微信支付接口返回的响应
  const mockWechatPayResponse = {
    code: 1,
    msg: "使用现有订单",
    data: {
      orderId: "cm9axn3tp00000q7uffhqqhss",
      amount: 1000,
      paymentType: "WECHAT",
      membershipType: "MONTHLY",
      paymentInfo: {
        codeUrl: "weixin://wxpay/bizpayurl?pr=16Veam3z3",
        expiresAt: 1744264717
      }
    }
  };

  const handleGenerateQRCode = async () => {
    setIsLoading(true);
    try {
      // 从响应中提取codeUrl并生成二维码
      const codeUrl = mockWechatPayResponse.data.paymentInfo.codeUrl;
      const dataUrl = await generateQRCode(codeUrl);
      setQrCodeUrl(dataUrl);
    } catch (error) {
      console.error('生成二维码失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">二维码生成测试</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">微信支付二维码</h2>
        <p className="mb-4 text-gray-600">
          点击下方按钮生成微信支付二维码。这是使用模拟的支付接口响应数据生成的。
        </p>
        
        <Button 
          onClick={handleGenerateQRCode}
          disabled={isLoading}
          className="mb-6"
        >
          {isLoading ? '生成中...' : '生成二维码'}
        </Button>
        
        {qrCodeUrl && (
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 border">
              <img 
                src={qrCodeUrl} 
                alt="微信支付二维码" 
                className="w-64 h-64 object-contain"
              />
            </div>
            <p className="text-sm text-gray-500">二维码内容: {mockWechatPayResponse.data.paymentInfo.codeUrl}</p>
          </div>
        )}
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">关于此测试</h3>
        <p className="text-sm text-blue-700">
          此页面演示了如何使用 <code>@/lib/qrcode</code> 工具库将微信支付的 codeUrl 转换为可扫描的二维码图像。
          在实际应用中，codeUrl 将从微信支付接口返回。
        </p>
      </div>
    </div>
  );
}
