/**
 * LemonSqueezy 支付适配器
 * Merchant of Record - 自动处理全球税务、VAT
 * 无需公司实体，个人开发者可直接使用
 * 网站: https://lemonsqueezy.com
 */

import {
  PaymentAdapter,
  PaymentProvider,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  WebhookResult,
  UserSubscription,
  PlanConfig,
} from '../types';

// 定价方案配置（LemonSqueezy 使用 Variant ID）
const LEMON_PLANS: Record<string, PlanConfig> = {
  'pro_monthly': {
    id: 'pro_monthly',
    name: '专业版 (月付)',
    price: 9,
    currency: 'USD',
    productId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID || '',
    description: '$9/月，适合个人创业者',
  },
  'investor_monthly': {
    id: 'investor_monthly',
    name: '投资版 (月付)',
    price: 49,
    currency: 'USD',
    productId: process.env.LEMONSQUEEZY_INVESTOR_VARIANT_ID || '',
    description: '$49/月，适合专业投资人',
  },
};

export class LemonSqueezyAdapter implements PaymentAdapter {
  name: PaymentProvider = 'lemonsqueezy';
  displayName = 'LemonSqueezy';
  requiresCompany = false;
  handlesTax = true;
  feeDescription = '5% + $0.50 + 2.5% 支付处理费';

  private getApiKey(): string | null {
    return process.env.LEMONSQUEEZY_API_KEY || null;
  }

  private getWebhookSecret(): string | null {
    return process.env.LEMONSQUEEZY_WEBHOOK_SECRET || null;
  }

  private getBaseUrl(): string {
    return 'https://api.lemonsqueezy.com/v1';
  }

  isConfigured(): boolean {
    return !!this.getApiKey();
  }

  async createCheckoutSession(request: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      return {
        success: false,
        provider: this.name,
        error: 'LemonSqueezy is not configured. Please set LEMONSQUEEZY_API_KEY environment variable.',
      };
    }

    const plan = LEMON_PLANS[request.planId];
    if (!plan) {
      return {
        success: false,
        provider: this.name,
        error: 'Invalid planId',
      };
    }

    try {
      const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'https://aistartupscout.com';
      const locale = request.locale || 'zh-Hans';
      
      // LemonSqueezy Checkout API
      // 参考: https://docs.lemonsqueezy.com/api/checkouts
      const response = await fetch(`${this.getBaseUrl()}/checkouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                custom: {
                  userId: request.userId,
                  planId: request.planId,
                },
              },
              checkout_options: {
                button_color: '#6366F1', // 使用品牌色
              },
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: process.env.LEMONSQUEEZY_STORE_ID || 'default_store_id',
                },
              },
              variant: {
                data: {
                  type: 'variants',
                  id: plan.productId,
                },
              },
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[LemonSqueezy] Checkout error:', data);
        return {
          success: false,
          provider: this.name,
          error: data.errors?.[0]?.message || 'Failed to create checkout session',
        };
      }

      // LemonSqueezy 返回 checkout URL
      const checkoutUrl = data.data?.attributes?.url;
      const checkoutId = data.data?.id;

      return {
        success: true,
        sessionId: checkoutId,
        url: checkoutUrl,
        provider: this.name,
      };
    } catch (error) {
      console.error('[LemonSqueezy] Checkout error:', error);
      return {
        success: false,
        provider: this.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async handleWebhook(
    body: string,
    headers: Record<string, string | null>
  ): Promise<WebhookResult> {
    const webhookSecret = this.getWebhookSecret();
    
    if (!webhookSecret) {
      // 开发模式
      console.log('[LemonSqueezy] Webhook received (dev mode):', body);
      try {
        const payload = JSON.parse(body);
        return {
          success: true,
          event: {
            type: payload.meta?.event_name || 'unknown',
            provider: this.name,
            data: payload.data,
            timestamp: Date.now(),
          },
        };
      } catch {
        return {
          success: false,
          error: 'Invalid webhook payload',
        };
      }
    }

    // 验证 LemonSqueezy 签名
    const signature = headers['x-signature'];
    if (!signature) {
      return {
        success: false,
        error: 'Missing LemonSqueezy signature header',
      };
    }

    try {
      // LemonSqueezy 使用 HMAC-SHA256 签名
      const crypto = await import('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        return {
          success: false,
          error: 'Invalid webhook signature',
        };
      }

      const payload = JSON.parse(body);
      const eventName = payload.meta?.event_name;

      // 处理 LemonSqueezy 事件类型
      // 参考: https://docs.lemonsqueezy.com/guides/webhooks
      switch (eventName) {
        case 'order_created':
        case 'order_refunded':
        case 'subscription_created':
        case 'subscription_updated':
        case 'subscription_cancelled':
        case 'subscription_expired':
        case 'subscription_payment_success':
        case 'subscription_payment_failed':
        case 'subscription_payment_recovered':
          console.log(`[LemonSqueezy] Event received: ${eventName}`, {
            orderId: payload.data?.id,
            customData: payload.data?.attributes?.custom_data,
          });
          break;
      }

      return {
        success: true,
        event: {
          type: eventName,
          provider: this.name,
          data: payload.data,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      console.error('[LemonSqueezy] Webhook error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      };
    }
  }

  async getSubscription(subscriptionId: string): Promise<UserSubscription | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    try {
      const response = await fetch(
        `${this.getBaseUrl()}/subscriptions/${subscriptionId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      const sub = data.data?.attributes;

      return {
        id: subscriptionId,
        userId: sub?.custom_data?.userId || '',
        planId: (sub?.custom_data?.planId as any) || 'pro_monthly',
        provider: this.name,
        status: this.mapLemonStatus(sub?.status),
        currentPeriodStart: new Date(sub?.created_at),
        currentPeriodEnd: new Date(sub?.renews_at),
        cancelAtPeriodEnd: sub?.cancels_at !== null,
      };
    } catch (error) {
      console.error('[LemonSqueezy] Get subscription error:', error);
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const apiKey = this.getApiKey();
    if (!apiKey) return false;

    try {
      const response = await fetch(
        `${this.getBaseUrl()}/subscriptions/${subscriptionId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error('[LemonSqueezy] Cancel subscription error:', error);
      return false;
    }
  }

  private mapLemonStatus(status: string): 'active' | 'cancelled' | 'expired' | 'pending' {
    switch (status) {
      case 'active':
        return 'active';
      case 'cancelled':
      case 'on_trial':
        return 'pending';
      case 'expired':
        return 'expired';
      default:
        return 'expired';
    }
  }
}

// 导出单例实例
export const lemonSqueezyAdapter = new LemonSqueezyAdapter();