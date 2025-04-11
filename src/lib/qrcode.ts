import QRCode from 'qrcode';

/**
 * 生成二维码工具函数
 * 将微信支付的codeUrl转换为二维码图片的data URL
 * 
 * @param codeUrl - 微信支付返回的codeUrl
 * @returns Promise<string> - 返回base64编码的二维码图片数据URL
 */
export async function generateQRCode(codeUrl: string): Promise<string> {
  try {
    // 使用qrcode库生成二维码
    const dataUrl = await QRCode.toDataURL(codeUrl, {
      width: 256,  // 设置二维码宽度
      margin: 2,   // 设置二维码边距
      color: {
        dark: '#000000',   // 二维码颜色
        light: '#ffffff'   // 背景颜色
      },
      errorCorrectionLevel: 'H'  // 高级纠错级别，使扫描更容易
    });
    return dataUrl;
  } catch (error) {
    console.error('生成二维码失败:', error);
    throw new Error('生成二维码失败');
  }
}

/**
 * 处理订单响应并提取codeUrl生成二维码
 * 
 * @param response - 微信支付接口返回的响应
 * @returns Promise<string> - 返回base64编码的二维码图片数据URL
 */
export async function handlePaymentResponse(response: any): Promise<string> {
  try {
    // 验证响应格式并提取codeUrl
    if (
      response && 
      response.data && 
      response.data.paymentInfo && 
      response.data.paymentInfo.codeUrl
    ) {
      const codeUrl = response.data.paymentInfo.codeUrl;
      return await generateQRCode(codeUrl);
    } else {
      throw new Error('支付响应格式不正确或缺少codeUrl');
    }
  } catch (error) {
    console.error('处理支付响应失败:', error);
    throw error;
  }
}
