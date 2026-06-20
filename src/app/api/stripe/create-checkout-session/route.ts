import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// 懒加载 Stripe 客户端（避免构建时检查环境变量）
let stripeClient: Stripe | null = null;

const getStripeClient = (): Stripe => {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2026-05-27.dahlia',
    });
  }
  return stripeClient;
};

// 定价方案配置（使用真实的 Stripe Price ID）
const PRICING_PLANS: Record<string, { priceId: string; name: string }> = {
  // 专业版 - 月付 $9
  'pro_monthly': {
    priceId: 'price_1TkNOCMMBAjcEo2mzUBAr9U',
    name: '专业版 (月付)',
  },
  // 投资版 - 月付 $49
  'investor_monthly': {
    priceId: 'price_1TkN2nCMMBAjcEo25UHLEPeW',
    name: '投资版 (月付)',
  },
  // 企业版 - 联系销售（不使用 Stripe）
  'enterprise': {
    priceId: '',
    name: '企业版服务',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, locale } = body as { planId: string; locale?: string };

    if (!planId) {
      return NextResponse.json(
        { error: 'Missing planId' },
        { status: 400 }
      );
    }

    // 获取用户 session（从 Supabase）
    // TODO: 实际实现需要验证用户身份
    const userId = 'mock_user_id';

    // 创建 Checkout Session
    const stripe = getStripeClient();
    const plan = PRICING_PLANS[planId];
    
    if (!plan || !plan.priceId) {
      return NextResponse.json(
        { error: 'Invalid planId' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'alipay'], // 支持信用卡和支付宝
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'https://aistartupscout.com'}/${locale || 'zh-Hans'}/dashboard?payment=success`,
      cancel_url: `${process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'https://aistartupscout.com'}/${locale || 'zh-Hans'}/pricing?payment=cancelled`,
      metadata: {
        userId,
        planId,
        locale: locale || 'zh-Hans',
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}