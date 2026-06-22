/**
 * 统一 Webhook API
 * 根据请求特征自动识别支付方案并处理 webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter, PaymentProvider } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers: Record<string, string | null> = {};
    
    // 复制所有 headers
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // 根据 headers 判断支付方案
    const provider = detectProvider(headers);

    if (!provider) {
      console.error('Unknown webhook provider');
      return NextResponse.json(
        { error: 'Unknown webhook provider' },
        { status: 400 }
      );
    }

    // 获取对应的适配器
    const adapter = getAdapter(provider);

    // 处理 webhook
    const result = await adapter.handleWebhook(body, headers);

    if (!result.success) {
      console.error(`[${provider}] Webhook error:`, result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // 处理事件（TODO: 更新数据库、发送通知等）
    if (result.event) {
      await processEvent(result.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// 根据 headers 判断支付方案
function detectProvider(headers: Record<string, string | null>): PaymentProvider | null {
  // Stripe
  if (headers['stripe-signature']) {
    return 'stripe';
  }

  // Creem
  if (headers['x-creem-signature'] || headers['creem-signature']) {
    return 'creem';
  }

  // LemonSqueezy
  if (headers['x-signature'] && headers['x-event-name']) {
    return 'lemonsqueezy';
  }

  // Paddle
  if (headers['paddle-signature']) {
    return 'paddle';
  }

  // PayPal
  if (headers['paypal-transmission-id'] && headers['paypal-transmission-sig']) {
    return 'paypal';
  }

  // 尝试从 URL query 参数判断（备用）
  // webhook URL 可以带 provider 参数：/api/payment/webhook?provider=stripe
  
  return null;
}

// 处理 webhook 事件（后续扩展）
async function processEvent(event: any): Promise<void> {
  const { type, provider, data } = event;

  console.log(`[${provider}] Processing event: ${type}`);

  // TODO: 实现以下逻辑
  // 1. 支付成功：更新用户订阅状态
  // 2. 支付失败：发送通知
  // 3. 订阅取消：更新状态
  // 4. 订阅续费：更新周期

  // 示例：根据事件类型处理
  switch (type) {
    case 'checkout.session.completed':
    case 'order_created':
    case 'CHECKOUT.ORDER.COMPLETED':
    case 'subscription_created':
    case 'transaction.completed':
      // 支付成功
      console.log('Payment successful, updating subscription...');
      break;

    case 'subscription_cancelled':
    case 'customer.subscription.deleted':
    case 'subscription_expired':
      // 订阅取消/过期
      console.log('Subscription cancelled/expired...');
      break;

    default:
      console.log('Unhandled event type:', type);
  }
}