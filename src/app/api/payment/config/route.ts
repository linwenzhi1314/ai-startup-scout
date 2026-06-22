/**
 * 支付配置管理 API
 * 用于后台查看和切换支付方案
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPaymentConfig,
  getProvidersMetadata,
  PaymentProvider,
} from '@/lib/payment';

// GET: 获取当前支付配置
export async function GET() {
  try {
    const config = getPaymentConfig();
    const providers = getProvidersMetadata();

    return NextResponse.json({
      success: true,
      config,
      providers,
    });
  } catch (error) {
    console.error('Get payment config error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get payment config' },
      { status: 500 }
    );
  }
}

// POST: 切换支付方案（需要管理员权限）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider } = body as { provider: PaymentProvider };

    // 验证是否是有效的支付方案
    const validProviders: PaymentProvider[] = ['stripe', 'creem', 'lemonsqueezy', 'paddle', 'paypal'];
    
    if (!provider || !validProviders.includes(provider)) {
      return NextResponse.json(
        { success: false, error: 'Invalid provider' },
        { status: 400 }
      );
    }

    // TODO: 验证管理员权限
    // TODO: 将配置保存到数据库或环境变量

    // 当前版本：返回提示信息（实际切换需要更新环境变量 PAYMENT_PROVIDER）
    return NextResponse.json({
      success: true,
      message: `To switch to ${provider}, please set PAYMENT_PROVIDER=${provider} in your environment variables.`,
      currentProvider: getPaymentConfig().activeProvider,
      requestedProvider: provider,
      note: 'Payment provider switching requires environment variable update. This will be automated in future versions.',
    });
  } catch (error) {
    console.error('Switch payment provider error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to switch provider' },
      { status: 500 }
    );
  }
}