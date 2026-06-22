/**
 * Paddle 支付适配器
 * Merchant of Record - 自动处理全球税务、VAT
 * 无需公司实体（需审核）
 * 网站: https://paddle.com
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

// 定价方案配置（Paddle 使用 price_id）
const PADDLE_PLANS: Record<string, PlanConfig & { priceId: string }> = {
  'pro_monthly': {
    id: 'pro_monthly',
    name: '专业版 (月付)',
    price: 9,
    currency: 'USD',
    priceId: 'paddle_pro_monthly_9', // 需要在 Paddle 后台创建产品后获取真实 ID
    description: '$9/月，适合个人创业者',
  },
  'investor_monthly': {
    id: 'investor_monthly',
    name: '投资版 (月付)',
    price: 49,
    currency: 'USD',
    priceId: 'paddle_investor_monthly_49',
    description: '$49/月，适合专业投资人',
  },
};

export class PaddleAdapter implements PaymentAdapter {
  name: PaymentProvider = 'paddle';
  displayName = 'Paddle';
  requiresCompany = false; // 实际上需要审核
  handlesTax = true;
  feeDescription = '5% + $0.50';

  private getApiKey(): string | null {
    return process.env.PADDLE_API_KEY || null;
  }

  private getWebhookSecret(): string | null {
    return process.env.PADDLE_WEBHOOK_SECRET_KEY || null;
  }

  private getBaseUrl(): string {
    // Paddle 有 Sandbox 和 Production 两个环境
    const sandbox = process.env.PADDLE_SANDBOX === 'true';
    return sandbox
      ? 'https://sandbox-api.paddle.com'
      : 'https://api.paddle.com';
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
        error: 'Paddle is not configured. Please set PADDLE_API_KEY environment variable.',
      };
    }

    const plan = PADDLE_PLANS[request.planId];
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
      
      // Paddle Checkout API (新版本 - Paddle Billing)
      // 参考: https://developer.paddle.com/api-reference/checkout/overview
      const response = await fetch(`${this.getBaseUrl()}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          custom_data: {
            userId: request.userId,
            planId: request.planId,
          },
          items: [
            {
              price_id: plan.priceId,
              quantity: 1,
            },
          ],
          checkout: {
            settings: {
              success_url: request.successUrl || `${baseUrl}/${locale}/dashboard?payment=success&provider=paddle`,
              cancel_url: request.cancelUrl || `${baseUrl}/${locale}/pricing?payment=cancelled&provider=paddle`,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Paddle] Checkout error:', data);
        return {
          success: false,
          provider: this.name,
          error: data.error?.message || 'Failed to create checkout session',
        };
      }

      // Paddle 返回 checkout URL
      return {
        success: true,
        sessionId: data.data?.id,
        url: data.data?.checkout?.url,
        provider: this.name,
      };
    } catch (error) {
      console.error('[Paddle] Checkout error:', error);
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
      console.log('[Paddle] Webhook received (dev mode):', body);
      try {
        const payload = JSON.parse(body);
        return {
          success: true,
          event: {
            type: payload.event_type || 'unknown',
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

    // 验证 Paddle 签名
    const signature = headers['paddle-signature'];
    if (!signature) {
      return {
        success: false,
        error: 'Missing Paddle signature header',
      };
    }

    try {
      // Paddle 使用 HMAC-SHA256 签名
      // 参考: https://developer.paddle.com/webhooks/signature-verification
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
      const eventType = payload.event_type;

      // 处理 Paddle 事件类型
      switch (eventType) {
        case 'transaction.completed':
        case 'transaction.payment_failed':
        case 'subscription.created':
        case 'subscription.updated':
        case 'subscription.cancelled':
        case 'subscription.past_due':
          console.log(`[Paddle] Event received: ${eventType}`, payload.data);
          break;
      }

      return {
        success: true,
        event: {
          type: eventType,
          provider: this.name,
          data: payload.data,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      console.error('[Paddle] Webhook error:', error);
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
      const sub = data.data;

      return {
        id: subscriptionId,
        userId: sub?.custom_data?.userId || '',
        planId: (sub?.custom_data?.planId as any) || 'pro_monthly',
        provider: this.name,
        status: this.mapPaddleStatus(sub?.status),
        currentPeriodStart: new Date(sub?.current_billing_period?.starts_at),
        currentPeriodEnd: new Date(sub?.current_billing_period?.ends_at),
        cancelAtPeriodEnd: sub?.scheduled_change?.action === 'cancel',
      };
    } catch (error) {
      console.error('[Paddle] Get subscription error:', error);
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const apiKey = this.getApiKey();
    if (!apiKey) return false;

    try {
      const response = await fetch(
        `${this.getBaseUrl()}/subscriptions/${subscriptionId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error('[Paddle] Cancel subscription error:', error);
      return false;
    }
  }

  private mapPaddleStatus(status: string): 'active' | 'cancelled' | 'expired' | 'pending' {
    switch (status) {
      case 'active':
        return 'active';
      case 'canceled':
        return 'cancelled';
      case 'past_due':
      case 'paused':
        return 'pending';
      default:
        return 'expired';
    }
  }
}

// 导出单例实例
export const paddleAdapter = new PaddleAdapter();