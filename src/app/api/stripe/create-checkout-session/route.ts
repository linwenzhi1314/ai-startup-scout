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

// 定价方案配置
const PRICING_PLANS: Record<string, { priceId: string; name: string }> = {
  // 专业版 - 月付
  'pro_monthly': {
    priceId: 'price_pro_monthly', // 需要在 Stripe 创建产品后替换
    name: '专业版 (月付)',
  },
  // 投资版 - 月付
  'investor_monthly': {
    priceId: 'price_investor_monthly',
    name: '投资版 (月付)',
  },
  // 企业版 - 一次性
  'enterprise': {
    priceId: 'price_enterprise',
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'alipay'], // 支持信用卡和支付宝
      line_items: [
        {
          price_data: {
            currency: locale === 'en' ? 'usd' : 'cny',
            product_data: {
              name: PRICING_PLANS[planId]?.name || 'AI Startup Scout Subscription',
            },
            unit_amount: planId === 'pro_monthly' 
              ? (locale === 'en' ? 499 : 2900) // $4.99 或 ¥29
              : planId === 'investor_monthly' 
                ? (locale === 'en' ? 3499 : 19900) // $34.99 或 ¥199
                : (locale === 'en' ? 16900 : 99900), // $169 或 ¥999
            recurring: planId !== 'enterprise' 
              ? { interval: 'month' } 
              : undefined,
          },
          quantity: 1,
        },
      ],
      mode: planId === 'enterprise' ? 'payment' : 'subscription',
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