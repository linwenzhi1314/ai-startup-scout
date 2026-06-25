/**
 * 统一 Webhook API
 * 根据请求特征自动识别支付方案并处理 webhook
 * 解析事件后写入 user_subscriptions 表
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter, PaymentProvider } from '@/lib/payment';
import { handleSubscriptionEvent, NormalizedWebhookEvent } from '@/lib/payment/subscription-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers: Record<string, string | null> = {};
    
    // 复制所有 headers
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // 根据 headers 判断支付方案（也支持 URL query 参数）
    const urlProvider = request.nextUrl.searchParams.get('provider') as PaymentProvider | null;
    const provider = urlProvider || detectProvider(headers);

    if (!provider) {
      console.error('Unknown webhook provider');
      return NextResponse.json(
        { error: 'Unknown webhook provider' },
        { status: 400 }
      );
    }

    // 获取对应的适配器
    const adapter = getAdapter(provider);

    // 处理 webhook（验证签名 + 解析事件）
    const result = await adapter.handleWebhook(body, headers);

    if (!result.success) {
      console.error(`[${provider}] Webhook error:`, result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // 处理事件：解析标准化数据并写入数据库
    if (result.event) {
      const normalizedEvent = normalizeEvent(provider, result.event.type, result.event.data);
      if (normalizedEvent) {
        const eventResult = await handleSubscriptionEvent(normalizedEvent);
        if (!eventResult.success) {
          console.error(`[${provider}] Failed to handle subscription event:`, eventResult.error);
          // 仍然返回 200 避免支付平台重试，但记录错误
        }
      }
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

/**
 * 根据 headers 判断支付方案
 */
function detectProvider(headers: Record<string, string | null>): PaymentProvider | null {
  // Creem
  if (headers['x-creem-signature'] || headers['creem-signature']) {
    return 'creem';
  }

  // LemonSqueezy
  if (headers['x-signature'] && headers['x-event-name']) {
    return 'lemonsqueezy';
  }

  // Stripe
  if (headers['stripe-signature']) {
    return 'stripe';
  }

  // Paddle
  if (headers['paddle-signature']) {
    return 'paddle';
  }

  // PayPal
  if (headers['paypal-transmission-id'] && headers['paypal-transmission-sig']) {
    return 'paypal';
  }

  return null;
}

/**
 * 将各平台的事件数据标准化为统一的 NormalizedWebhookEvent
 */
function normalizeEvent(
  provider: PaymentProvider,
  eventType: string,
  rawData: unknown
): NormalizedWebhookEvent | null {
  try {
    const data = rawData as Record<string, unknown>;

    switch (provider) {
      case 'creem':
        return normalizeCreemEvent(eventType, data);
      case 'lemonsqueezy':
        return normalizeLemonSqueezyEvent(eventType, data);
      case 'stripe':
        return normalizeStripeEvent(eventType, data);
      default:
        console.log(`No normalizer for provider: ${provider}`);
        return null;
    }
  } catch (error) {
    console.error('Error normalizing event:', error);
    return null;
  }
}

/**
 * Creem 事件标准化
 * 文档: https://docs.creem.io/webhooks
 */
function normalizeCreemEvent(eventType: string, data: Record<string, unknown>): NormalizedWebhookEvent | null {
  const attrs = (data.attributes || data) as Record<string, unknown>;
  
  // 判断事件类别
  let normalizedType: NormalizedWebhookEvent['eventType'];
  let status: NormalizedWebhookEvent['status'] = 'active';

  switch (eventType) {
    case 'order_created':
    case 'order_paid':
      normalizedType = 'payment_succeeded';
      status = 'active';
      break;
    case 'subscription_created':
    case 'subscription_updated':
    case 'subscription_renewed':
      normalizedType = 'subscription_created';
      status = 'active';
      break;
    case 'subscription_cancelled':
      normalizedType = 'subscription_cancelled';
      status = 'cancelled';
      break;
    case 'subscription_expired':
      normalizedType = 'subscription_expired';
      status = 'expired';
      break;
    case 'order_refunded':
      normalizedType = 'subscription_cancelled';
      status = 'cancelled';
      break;
    default:
      return null;
  }

  // 从 Creem 数据中提取信息
  const customData = (attrs.custom_data || {}) as Record<string, unknown>;
  const customerEmail = (attrs.customer_email || attrs.email || customData.email) as string | undefined;
  const productId = (attrs.product_id || data.product_id) as string | undefined;

  // 根据 product_id 判断 planId
  const proProductId = process.env.CREEM_PRO_PRODUCT_ID;
  const investorProductId = process.env.CREEM_INVESTOR_PRODUCT_ID;
  let planId: 'pro_monthly' | 'investor_monthly' = 'pro_monthly';
  if (productId === investorProductId) {
    planId = 'investor_monthly';
  }

  return {
    eventType: normalizedType,
    provider: 'creem',
    providerCustomerId: (attrs.customer_id || data.customer_id) as string | undefined,
    providerSubscriptionId: (attrs.subscription_id || data.subscription_id) as string | undefined,
    providerCheckoutId: (attrs.checkout_id || data.id) as string | undefined,
    email: customerEmail,
    userId: customData.userId as string | undefined,
    planId,
    planName: planId === 'pro_monthly' ? '专业版' : '投资版',
    status,
    currentPeriodStart: (attrs.current_period_start || attrs.created_at) as string | undefined,
    currentPeriodEnd: (attrs.current_period_end || attrs.ends_at) as string | undefined,
    cancelAtPeriodEnd: eventType === 'subscription_cancelled' ? true : false,
    rawEvent: data,
  };
}

/**
 * LemonSqueezy 事件标准化
 * 文档: https://docs.lemonsqueezy.com/guides/webhooks
 */
function normalizeLemonSqueezyEvent(eventType: string, data: Record<string, unknown>): NormalizedWebhookEvent | null {
  const attrs = (data.attributes || {}) as Record<string, unknown>;
  
  let normalizedType: NormalizedWebhookEvent['eventType'];
  let status: NormalizedWebhookEvent['status'] = 'active';

  switch (eventType) {
    case 'order_created':
      normalizedType = 'payment_succeeded';
      status = 'active';
      break;
    case 'subscription_created':
    case 'subscription_updated':
      normalizedType = 'subscription_created';
      status = 'active';
      break;
    case 'subscription_payment_success':
      normalizedType = 'payment_succeeded';
      status = 'active';
      break;
    case 'subscription_payment_failed':
      normalizedType = 'payment_failed';
      status = 'expired';
      break;
    case 'subscription_cancelled':
      normalizedType = 'subscription_cancelled';
      status = 'cancelled';
      break;
    case 'subscription_expired':
      normalizedType = 'subscription_expired';
      status = 'expired';
      break;
    case 'order_refunded':
      normalizedType = 'subscription_cancelled';
      status = 'cancelled';
      break;
    default:
      return null;
  }

  // LemonSqueezy data 结构: { id, type, attributes: { ... } }
  const checkoutData = attrs.checkout_data as Record<string, unknown> | undefined;
  const customData = (attrs.custom_data || checkoutData?.custom || {}) as Record<string, unknown>;
  const userData = attrs.user as Record<string, unknown> | undefined;
  const customerEmail = (attrs.user_email || userData?.email || customData.email) as string | undefined;
  const variantId = String(attrs.variant_id || data.id || '');
  
  // 根据 variant_id 判断 planId
  const proVariantId = process.env.LEMONSQUEEZY_PRO_VARIANT_ID;
  const investorVariantId = process.env.LEMONSQUEEZY_INVESTOR_VARIANT_ID;
  let planId: 'pro_monthly' | 'investor_monthly' = 'pro_monthly';
  if (variantId === investorVariantId) {
    planId = 'investor_monthly';
  }

  return {
    eventType: normalizedType,
    provider: 'lemonsqueezy',
    providerCustomerId: (attrs.customer_id || attrs.user_id) as string | undefined,
    providerSubscriptionId: (attrs.subscription_id || data.id) as string | undefined,
    providerCheckoutId: (attrs.checkout_id || customData.checkoutId) as string | undefined,
    email: customerEmail,
    userId: customData.userId as string | undefined,
    planId,
    planName: planId === 'pro_monthly' ? '专业版' : '投资版',
    status,
    currentPeriodStart: (attrs.created_at) as string | undefined,
    currentPeriodEnd: (attrs.renews_at || attrs.ends_at) as string | undefined,
    cancelAtPeriodEnd: attrs.cancels_at !== null && attrs.cancels_at !== undefined,
    rawEvent: data,
  };
}

/**
 * Stripe 事件标准化
 */
function normalizeStripeEvent(eventType: string, data: Record<string, unknown>): NormalizedWebhookEvent | null {
  switch (eventType) {
    case 'checkout.session.completed': {
      const metadata = (data.metadata || {}) as Record<string, unknown>;
      return {
        eventType: 'payment_succeeded',
        provider: 'stripe',
        providerCustomerId: data.customer as string | undefined,
        providerSubscriptionId: data.subscription as string | undefined,
        providerCheckoutId: data.id as string | undefined,
        email: data.customer_email as string | undefined,
        userId: metadata.userId as string | undefined,
        planId: (metadata.planId as 'pro_monthly' | 'investor_monthly') || 'pro_monthly',
        planName: (metadata.planId === 'investor_monthly' ? '投资版' : '专业版'),
        status: 'active',
        rawEvent: data,
      };
    }
    case 'customer.subscription.deleted': {
      return {
        eventType: 'subscription_cancelled',
        provider: 'stripe',
        providerSubscriptionId: data.id as string | undefined,
        providerCustomerId: data.customer as string | undefined,
        status: 'cancelled',
        cancelAtPeriodEnd: true,
        rawEvent: data,
      };
    }
    default:
      return null;
  }
}