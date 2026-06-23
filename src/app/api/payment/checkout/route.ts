/**
 * 统一 Checkout API
 * 根据当前配置的支付方案自动选择适配器
 * 支持从数据库动态切换支付方案
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter, PaymentProvider } from '@/lib/payment';
import { PlanId } from '@/lib/payment/types';
import { getActiveProviderFromDB } from '@/lib/payment/db-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, locale, provider } = body as {
      planId: PlanId;
      locale?: string;
      provider?: PaymentProvider; // 可选：指定支付方案
    };

    if (!planId) {
      return NextResponse.json(
        { error: 'Missing planId' },
        { status: 400 }
      );
    }

    // 获取用户 ID（TODO: 从 Supabase session 获取）
    const userId = 'mock_user_id';

    // 确定使用哪个支付方案
    let activeProvider: PaymentProvider;
    let configSource: 'specified' | 'database' | 'fallback' = 'fallback';
    
    if (provider) {
      // 如果请求中指定了 provider，直接使用
      activeProvider = provider;
      configSource = 'specified';
    } else {
      // 先从数据库获取配置
      const dbProvider = await getActiveProviderFromDB();
      
      if (dbProvider) {
        // 数据库有配置，优先使用（不管环境变量是否配置）
        activeProvider = dbProvider;
        configSource = 'database';
      } else {
        // 数据库没有配置，回退到环境变量或默认
        activeProvider = getFallbackProvider();
        configSource = 'fallback';
      }
    }

    const adapter = getAdapter(activeProvider);

    // 检查适配器是否已配置
    if (!adapter.isConfigured()) {
      return NextResponse.json({
        error: `${adapter.displayName} is not configured. Please set the required environment variables.`,
        provider: adapter.name,
        configSource,
        requiredEnvVars: getRequiredEnvVars(adapter.name),
      }, { status: 400 });
    }

    // 创建 Checkout Session
    const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'https://aistartupscout.com';
    const localePath = locale || 'zh-Hans';

    const result = await adapter.createCheckoutSession({
      planId,
      userId,
      locale,
      successUrl: `${baseUrl}/${localePath}/dashboard?payment=success&provider=${adapter.name}`,
      cancelUrl: `${baseUrl}/${localePath}/pricing?payment=cancelled&provider=${adapter.name}`,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, provider: result.provider },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      url: result.url,
      provider: result.provider,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

/**
 * 获取回退支付方案（从环境变量或默认值）
 */
function getFallbackProvider(): PaymentProvider {
  // 检查环境变量
  const envProvider = process.env.PAYMENT_PROVIDER as PaymentProvider;
  if (envProvider) {
    return envProvider;
  }

  // 默认返回 creem
  return 'creem';
}

// 获取各支付方案需要的环境变量
function getRequiredEnvVars(provider: PaymentProvider): string[] {
  switch (provider) {
    case 'stripe':
      return ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
    case 'creem':
      return ['CREEM_API_KEY', 'CREEM_WEBHOOK_SECRET'];
    case 'lemonsqueezy':
      return ['LEMONSQUEEZY_API_KEY', 'LEMONSQUEEZY_STORE_ID', 'LEMONSQUEEZY_WEBHOOK_SECRET'];
    case 'paddle':
      return ['PADDLE_API_KEY', 'PADDLE_WEBHOOK_SECRET_KEY'];
    case 'paypal':
      return ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET'];
    default:
      return [];
  }
}