export interface PaymentPlan {
  type: string;
  display?: string;
  amount: number; // 金额(分)
  chars: string;  // 字符数描述
  durationDays?: number; // 有效期(天)，仅会员套餐需要
  originalPrice?: number; // 原价(分)，用于显示折扣
  note?: string;  // 备注说明
  discount?: string; // 折扣信息
  popular?: boolean; // 是否热门
}

export const membershipPlans: PaymentPlan[] = [
  {
    type: "MONTHLY",
    display: "月度会员",
    amount: 1000, // ¥10
    chars: "50,000字符/月",
    durationDays: 30,
    originalPrice: 1000,
    note: "平均每天约1,667字符",
    discount: "0%"
  },
  {
    type: "QUARTERLY",
    display: "季度会员",
    amount: 2700, // ¥27
    chars: "180,000字符/季度",
    durationDays: 90,
    originalPrice: 3000,
    note: "比月度会员节省￥3 (10%折扣)",
    discount: "10%",
    popular: true
  },
  {
    type: "YEARLY",
    display: "年度会员",
    amount: 9600, // ¥96
    chars: "800,000字符/年",
    durationDays: 365,
    originalPrice: 12000,
    note: "比月度会员节省￥24 (20%折扣)",
    discount: "20%"
  }
];

export const topUpPacks: PaymentPlan[] = [
  {
    type: "SMALL",
    display: "小包",
    amount: 200, // ¥2
    chars: "10,000字符"
  },
  {
    type: "MEDIUM",
    display: "中包",
    amount: 900, // ¥9
    chars: "50,000字符",
    note: "比单独购买月度会员稍便宜"
  },
  {
    type: "LARGE",
    display: "大包",
    amount: 1700, // ¥17
    chars: "100,000字符",
    note: "进一步优惠"
  },
  {
    type: "XLARGE",
    display: "超大包",
    amount: 8000, // ¥80
    chars: "500,000字符",
    note: "适合高需求用户"
  }
];

export function getPaymentPlan(type: string): PaymentPlan | undefined {
  const allPlans = [...membershipPlans, ...topUpPacks];
  return allPlans.find(plan => plan.type === type);
}
