"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { subscribe } from "@/services/member";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeMembershipModal } from "@/redux/slice/modalState";
import { 
  CheckCircleFilled, 
  QuestionCircleOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  SmileOutlined,
  WechatOutlined,
  AlipayCircleOutlined
} from "@ant-design/icons";
import { Alert } from "@/components/ui/alert";

interface MembershipPlan {
  type: string;
  chars: string;
  price: string;
  originalPrice?: string;
  note?: string;
  discount?: string;
  popular?: boolean;
}

interface TopUpPack {
  type: string;
  chars: string;
  price: string;
  note?: string;
}

const membershipPlans: MembershipPlan[] = [
  {
    type: "月度会员",
    chars: "50,000字符/月",
    price: "￥10/月",
    originalPrice: "￥10/月",
    note: "平均每天约1,667字符",
    discount: "0%"
  },
  {
    type: "季度会员",
    chars: "180,000字符/季度",
    price: "￥27/季度",
    originalPrice: "￥30/季度",
    note: "比月度会员节省￥3 (10%折扣)",
    discount: "10%",
    popular: true
  },
  {
    type: "年度会员",
    chars: "800,000字符/年",
    price: "￥96/年",
    originalPrice: "￥120/年",
    note: "比月度会员节省￥24 (20%折扣)",
    discount: "20%"
  }
];

const topUpPacks: TopUpPack[] = [
  {
    type: "小包",
    chars: "10,000字符",
    price: "￥2"
  },
  {
    type: "中包",
    chars: "50,000字符",
    price: "￥9",
    note: "比单独购买月度会员稍便宜"
  },
  {
    type: "大包",
    chars: "100,000字符",
    price: "￥17",
    note: "进一步优惠"
  },
  {
    type: "超大包",
    chars: "500,000字符",
    price: "￥80",
    note: "适合高需求用户"
  }
];

// 图标映射
const planIcons = {
  "月度会员": <ClockCircleOutlined className="text-blue-500" />,
  "季度会员": <GiftOutlined className="text-purple-500" />,
  "年度会员": <SafetyCertificateOutlined className="text-green-500" />,
  "小包": <SmileOutlined className="text-yellow-500" />,
  "中包": <SmileOutlined className="text-orange-500" />,
  "大包": <SmileOutlined className="text-red-500" />,
  "超大包": <SmileOutlined className="text-pink-500" />
};

export function MembershipModal() {
  const dispatch = useDispatch();
  const showMembershipModal = useSelector(
    (state: RootState) => state.modalState.showMembershipModal
  );
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | TopUpPack | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"wechat" | "alipay" | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"selectPlan" | "selectPayment" | "scanQRCode" | "completed">("selectPlan");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handlePlanSelect = (plan: MembershipPlan | TopUpPack) => {
    setSelectedPlan(plan);
    setPaymentStep("selectPayment");
  };

  const handlePaymentSelect = async (payment: "wechat" | "alipay") => {
    if (!selectedPlan) return;
    
    setIsSubmitting(true);
    try {
      const response = await subscribe({
        planId: selectedPlan.type,
        paymentMethod: payment
      });
      setSelectedPayment(payment);
      setQrCodeUrl(response.qrCodeUrl);
      setPaymentStep("scanQRCode");
    } catch (error) {
      console.error("订阅失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentCompleted = () => {
    setPaymentCompleted(true);
    setPaymentStep("completed");
    // 这里可以添加验证支付状态的逻辑，例如调用查询订单API
    // 然后在确认支付成功后关闭弹窗
    
    // 模拟支付成功后的延迟关闭
    setTimeout(() => {
      dispatch(closeMembershipModal());
    }, 2000);
  };

  const handleBackToPlans = () => {
    setSelectedPlan(null);
    setSelectedPayment(null);
    setQrCodeUrl("");
    setPaymentStep("selectPlan");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch(closeMembershipModal());
      setSelectedPlan(null);
      setSelectedPayment(null);
      setQrCodeUrl("");
      setPaymentStep("selectPlan");
      setPaymentCompleted(false);
    }
  };

  return (
    <Dialog open={showMembershipModal} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl w-[95%] max-h-[90vh] overflow-auto transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <DollarOutlined className="text-yellow-500" /> 会员套餐与充值
          </DialogTitle>
        </DialogHeader>

        {paymentCompleted ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircleFilled className="text-4xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">支付成功！</h3>
            <p className="text-gray-600 mb-6">您的账户已成功充值，感谢您的订购！</p>
            <Button 
              onClick={() => dispatch(closeMembershipModal())}
              className="px-8"
            >
              完成
            </Button>
          </div>
        ) : paymentStep === "selectPlan" ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Tabs defaultValue="membership" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 rounded-lg h-12">
                  <TabsTrigger 
                    value="membership" 
                    className="text-sm md:text-base rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold"
                  >
                    <ClockCircleOutlined className="mr-1 md:mr-2" /> 会员套餐
                  </TabsTrigger>
                  <TabsTrigger 
                    value="topup" 
                    className="text-sm md:text-base rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold"
                  >
                    <GiftOutlined className="mr-1 md:mr-2" /> 补充包
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="membership" className="pt-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {membershipPlans.map((plan) => (
                        <Card
                          key={plan.type}
                          className={`relative p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
                            plan.popular ? 'border-blue-500 border-2' : ''
                          } ${
                            selectedPlan?.type === plan.type 
                              ? 'ring-2 ring-primary shadow-lg' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => handlePlanSelect(plan)}
                        >
                          {plan.popular && (
                            <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full py-1 px-3 text-xs font-bold">
                              最受欢迎
                            </div>
                          )}
                          <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                {planIcons[plan.type as keyof typeof planIcons]}
                                <h4 className="font-bold text-xl ml-2">{plan.type}</h4>
                              </div>
                              {plan.discount !== "0%" && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
                                  节省{plan.discount}
                                </span>
                              )}
                            </div>
                            
                            <div className="my-4">
                              <p className="text-primary text-2xl font-bold">{plan.price}</p>
                              {plan.originalPrice && plan.discount !== "0%" ? (
                                <p className="text-gray-500 line-through text-sm">{plan.originalPrice}</p>
                              ): <div className="h-5"></div> }
                            </div>
                            
                            <div className="flex-grow">
                              {plan.note && <p className="text-sm text-gray-600 line-clamp-2 h-10">{plan.note}</p>}
                            </div>
                            
                            <div className="mt-2">
                              <div className="bg-gray-50 p-3 rounded-md mb-3">
                                <p className="text-base font-medium">{plan.chars}</p>
                              </div>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlanSelect(plan);
                                }}
                              >
                                选择此套餐
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                      <div className="flex items-start">
                        <SafetyCertificateOutlined className="text-xl text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">订阅越久越划算！</h4>
                          <p className="text-sm">
                            选择更长的订阅周期可享受更多折扣：季度会员享10%折扣，年度会员享20%折扣。
                            订阅时间越长，平均每月价格越低！
                          </p>
                        </div>
                      </div>
                    </Alert>
                  </div>
                </TabsContent>

                <TabsContent value="topup" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {topUpPacks.map((pack) => (
                      <Card
                        key={pack.type}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                          selectedPlan?.type === pack.type 
                            ? 'ring-2 ring-primary shadow-md' 
                            : 'hover:shadow-sm'
                        }`}
                        onClick={() => handlePlanSelect(pack)}
                      >
                        <div className="flex flex-col h-full min-h-[180px]">
                          <div>
                            <div className="flex items-center mb-2">
                              {planIcons[pack.type as keyof typeof planIcons]}
                              <h4 className="font-bold text-lg ml-2">{pack.type}</h4>
                            </div>
                            <p className="text-primary text-xl font-bold my-2">{pack.price}</p>
                          </div>
                          
                          <div className="flex-grow">
                              {pack.note && <p className="text-xs text-gray-600 line-clamp-2 h-10">{pack.note}</p>}
                          </div>
                          
                          <div className="mt-auto">
                            <div className="bg-gray-50 p-3 rounded-md mb-3">
                              <p className="text-base">{pack.chars}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlanSelect(pack);
                              }}
                            >
                              选择
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="md:w-80 flex-shrink-0">
              <Card className="p-6 sticky top-4 bg-gray-50">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold flex items-center">
                    <QuestionCircleOutlined className="mr-2 text-blue-500" /> 为什么选择我们？
                  </h3>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center text-sm">
                      <CheckCircleFilled className="text-green-500 mr-2" /> 超高品质语音合成
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircleFilled className="text-green-500 mr-2" /> 多种语音风格可选
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircleFilled className="text-green-500 mr-2" /> 灵活的会员套餐
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircleFilled className="text-green-500 mr-2" /> 即时生成，实时预览
                    </li>
                  </ul>
                </div>
                
                <div className="text-sm text-gray-600">
                  <h4 className="font-medium text-gray-700">字符与汉字换算：</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white p-2 rounded text-center">
                      <div className="text-xs text-gray-500">10,000字符</div>
                      <div className="font-medium">≈ 5,000汉字</div>
                    </div>
                    <div className="bg-white p-2 rounded text-center">
                      <div className="text-xs text-gray-500">50,000字符</div>
                      <div className="font-medium">≈ 25,000汉字</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {paymentStep === "selectPayment" && selectedPlan ? (
              <>
                <div className="flex-1">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-6">您选择的套餐</h3>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
                      <div className="mr-4 text-2xl">
                        {planIcons[selectedPlan.type as keyof typeof planIcons]}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{selectedPlan.type}</h4>
                        <p className="text-gray-600">{selectedPlan.chars}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-primary text-xl font-bold">{selectedPlan.price}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">选择支付方式</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Button
                        variant={selectedPayment === 'wechat' ? 'default' : 'outline'}
                        className="w-full flex items-center justify-center gap-3 py-6"
                        onClick={() => handlePaymentSelect('wechat')}
                        disabled={isSubmitting}
                      >
                        <WechatOutlined className="text-2xl text-green-500" />
                        <span className="text-lg">微信支付</span>
                      </Button>
                      <Button
                        variant={selectedPayment === 'alipay' ? 'default' : 'outline'}
                        className="w-full flex items-center justify-center gap-3 py-6"
                        onClick={() => handlePaymentSelect('alipay')}
                        disabled={isSubmitting}
                      >
                        <AlipayCircleOutlined className="text-2xl text-blue-500" />
                        <span className="text-lg">支付宝</span>
                      </Button>
                    </div>

                    <div className="text-center mt-6">
                      <Button 
                        variant="outline" 
                        onClick={handleBackToPlans}
                        className="px-6"
                      >
                        返回选择其他套餐
                      </Button>
                    </div>
                  </Card>
                </div>
                
                <div className="md:w-80 flex-shrink-0">
                  <Card className="p-6 sticky top-4">
                    <h3 className="text-lg font-semibold mb-4">订单详情</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">套餐类型</span>
                        <span className="font-medium">{selectedPlan.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">字符数量</span>
                        <span className="font-medium">{selectedPlan.chars}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg pt-4 mt-4 border-t">
                        <span className="text-gray-600">应付金额</span>
                        <span className="font-bold text-primary text-xl">{selectedPlan.price}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        支付成功后，系统将自动为您的账户充值相应的字符数量，您可以立即使用。
                      </p>
                    </div>
                  </Card>
                </div>
              </>
            ) : paymentStep === "scanQRCode" && qrCodeUrl ? (
              <>
                <div className="flex-1">
                  <Card className="p-6 flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-6">扫码支付</h3>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
                      <img 
                        src={qrCodeUrl} 
                        alt="支付二维码" 
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                    <p className="text-center text-gray-600 mb-8">
                      请使用{selectedPayment === 'wechat' ? '微信' : '支付宝'}扫描上方二维码完成支付
                    </p>
                    
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={handleBackToPlans}
                      >
                        取消支付
                      </Button>
                      <Button 
                        onClick={handlePaymentCompleted}
                      >
                        我已完成支付
                      </Button>
                    </div>
                  </Card>
                </div>
                
                <div className="md:w-80 flex-shrink-0">
                  <Card className="p-6 sticky top-4">
                    <h3 className="text-lg font-semibold mb-4">订单详情</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">套餐类型</span>
                        <span className="font-medium">{selectedPlan?.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">字符数量</span>
                        <span className="font-medium">{selectedPlan?.chars}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg pt-4 mt-4 border-t">
                        <span className="text-gray-600">应付金额</span>
                        <span className="font-bold text-primary text-xl">{selectedPlan?.price}</span>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                        <QuestionCircleOutlined className="mr-2" />
                        支付遇到问题？
                      </h4>
                      <p className="text-sm text-yellow-700">
                        如果您在支付过程中遇到任何问题，请尝试刷新页面或联系客服获取帮助。
                      </p>
                    </div>
                  </Card>
                </div>
              </>
            ) : null}
          </div>
        )}
        
        {paymentStep === "selectPlan" && (
          <div className="mt-6">
            <Card className="p-4 text-left text-sm">
              <h4 className="font-semibold mb-2 flex items-center">
                <QuestionCircleOutlined className="mr-2 text-blue-500" />
                计费字符说明：
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>所有字符（包括标点、空格）均会计费</li>
                <li>每个汉字计为2个字符（含日文、韩文汉字）</li>
                <li>多音字，数字/符号，停顿，局部变速，多人配音均会计费</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">* 以实际生成消耗为准</p>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
