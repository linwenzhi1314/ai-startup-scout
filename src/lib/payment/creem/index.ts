/**
 * Creem 支付适配器
 * Merchant of Record - 自动处理税务
 * 无需公司实体，个人可用
 * 网站: https://creem.io
 */

import {
  PaymentAdapter,
  PaymentProvider,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  WebhookResult,
  PlanConfig,
} from '../types';

// 定价方案配置（Creem 使用产品 ID）
const CREEM_PLANS: Record<string, PlanConfig> = {
  'pro_monthly': {
    id: 'pro_monthly',
    name: '专业版 (月付)',
    price: 9,
    currency: 'USD',
    productId: process.env.CREEM_PRO_PRODUCT_ID || '',
    description: '$9/月，适合个人创业者',
  },
  'investor_monthly': {
    id: 'investor_monthly',
    name: '投资版 (月付)',
    price: 49,
    currency: 'USD',
    productId: process.env.CREEM_INVESTOR_PRODUCT_ID || '',
    description: '$49/月，适合专业投资人',
  },
};

export class CreemAdapter implements PaymentAdapter {
  name: PaymentProvider = 'creem';
  displayName = 'Creem';
  requiresCompany = false;
  handlesTax = true;
  feeDescription = '约 4-5%（含税务处理）';

  private getApiKey(): string | null {
    return process.env.CREEM_API_KEY || null;
  }

  private getWebhookSecret(): string | null {
    return process.env.CREEM_WEBHOOK_SECRET || null;
  }

  private getBaseUrl(): string {
    return 'https://api.creem.io/v1';
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
        error: 'Creem is not configured. Please set CREEM_API_KEY environment variable.',
      };
    }

    const plan = CREEM_PLANS[request.planId];
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
      
      // Creem Checkout API
      // 参考: https://docs.creem.io/api-reference/checkout
      const response = await fetch(`${this.getBaseUrl()}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          product_id: plan.productId,
          customer_email: request.userId, // 如果有邮箱可以传入
          success_url: request.successUrl || `${baseUrl}/${locale}/dashboard?payment=success&provider=creem`,
          cancel_url: request.cancelUrl || `${baseUrl}/${locale}/pricing?payment=cancelled&provider=creem`,
          metadata: {
            userId: request.userId,
            planId: request.planId,
            locale,
          },
          checkout_options: {
            include_quantity_selector: false,
          },
          checkout_data: {
            custom_data: {
              userId: request.userId,
              planId: request.planId,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[Creem] Checkout error:', data);
        return {
          success: false,
          provider: this.name,
          error: data.message || 'Failed to create checkout session',
        };
      }

      // Creem 返回 checkout_url
      return {
        success: true,
        sessionId: data.id || data.checkout_id,
        url: data.checkout_url || data.url,
        provider: this.name,
      };
    } catch (error) {
      console.error('[Creem] Checkout error:', error);
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
      // 开发模式，不验证签名
      console.log('[Creem] Webhook received (dev mode):', body);
      try {
        const payload = JSON.parse(body);
        return {
          success: true,
          event: {
            type: payload.event_type || payload.type || 'unknown',
            provider: this.name,
            data: payload.data || payload,
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

    // 验证 Creem 签名
    const signature = headers['x-creem-signature'] || headers['creem-signature'];
    if (!signature) {
      return {
        success: false,
        error: 'Missing Creem signature header',
      };
    }

    try {
      // Creem 使用 HMAC-SHA256 签名验证
      // 参考: https://docs.creem.io/webhooks
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

      // 处理 Creem 事件类型
      switch (payload.event_type) {
        case 'order_created':
        case 'subscription_created':
        case 'subscription_updated':
        case 'subscription_cancelled':
        case 'subscription_expired':
        case 'payment_success':
        case 'payment_failed':
          console.log(`[Creem] Event received: ${payload.event_type}`, payload.data);
          break;
      }

      return {
        success: true,
        event: {
          type: payload.event_type,
          provider: this.name,
          data: payload.data,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      console.error('[Creem] Webhook error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      };
    }
  }
}

// 导出单例实例
export const creemAdapter = new CreemAdapter();