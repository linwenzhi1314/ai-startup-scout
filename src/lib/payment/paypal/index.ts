/**
 * PayPal 支付适配器
 * 传统支付方案，用户基数大
 * 无需公司实体（个人账户可用）
 * 需要自己处理税务
 * 网站: https://developer.paypal.com
 */

import {
  PaymentAdapter,
  PaymentProvider,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  WebhookResult,
  PlanConfig,
} from '../types';

// 定价方案配置
const PAYPAL_PLANS: Record<string, PlanConfig> = {
  'pro_monthly': {
    id: 'pro_monthly',
    name: '专业版 (月付)',
    price: 9,
    currency: 'USD',
    description: '$9/月，适合个人创业者',
  },
  'investor_monthly': {
    id: 'investor_monthly',
    name: '投资版 (月付)',
    price: 49,
    currency: 'USD',
    description: '$49/月，适合专业投资人',
  },
};

export class PayPalAdapter implements PaymentAdapter {
  name: PaymentProvider = 'paypal';
  displayName = 'PayPal';
  requiresCompany = false;
  handlesTax = false;
  feeDescription = '约 3-4%（跨境可能更高）';

  private getClientId(): string | null {
    return process.env.PAYPAL_CLIENT_ID || null;
  }

  private getClientSecret(): string | null {
    return process.env.PAYPAL_CLIENT_SECRET || null;
  }

  private getBaseUrl(): string {
    // PayPal 有 Sandbox 和 Production 两个环境
    const sandbox = process.env.PAYPAL_SANDBOX === 'true';
    return sandbox
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';
  }

  isConfigured(): boolean {
    return !!this.getClientId() && !!this.getClientSecret();
  }

  // 获取 PayPal Access Token
  private async getAccessToken(): Promise<string | null> {
    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();

    if (!clientId || !clientSecret) return null;

    try {
      const response = await fetch(`${this.getBaseUrl()}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('[PayPal] Get access token error:', error);
      return null;
    }
  }

  async createCheckoutSession(request: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    const clientId = this.getClientId();
    
    if (!clientId) {
      return {
        success: false,
        provider: this.name,
        error: 'PayPal is not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.',
      };
    }

    const plan = PAYPAL_PLANS[request.planId];
    if (!plan) {
      return {
        success: false,
        provider: this.name,
        error: 'Invalid planId',
      };
    }

    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          provider: this.name,
          error: 'Failed to get PayPal access token',
        };
      }

      const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'https://aistartupscout.com';
      const locale = request.locale || 'zh-Hans';
      
      // PayPal Orders API
      // 参考: https://developer.paypal.com/api/orders/v2/
      const response = await fetch(`${this.getBaseUrl()}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: `${request.planId}_${request.userId}`,
              description: plan.name,
              amount: {
                currency_code: plan.currency,
                value: plan.price.toString(),
              },
              custom_id: JSON.stringify({
                userId: request.userId,
                planId: request.planId,
              }),
            },
          ],
          application_context: {
            brand_name: 'AI Startup Scout',
            user_action: 'PAY_NOW',
            return_url: request.successUrl || `${baseUrl}/${locale}/dashboard?payment=success&provider=paypal`,
            cancel_url: request.cancelUrl || `${baseUrl}/${locale}/pricing?payment=cancelled&provider=paypal`,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[PayPal] Checkout error:', data);
        return {
          success: false,
          provider: this.name,
          error: data.message || 'Failed to create checkout session',
        };
      }

      // PayPal 返回 approve link
      const approveLink = data.links?.find((l: any) => l.rel === 'approve')?.href;

      return {
        success: true,
        sessionId: data.id,
        url: approveLink,
        provider: this.name,
      };
    } catch (error) {
      console.error('[PayPal] Checkout error:', error);
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
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    
    if (!webhookId) {
      // 开发模式
      console.log('[PayPal] Webhook received (dev mode):', body);
      try {
        const payload = JSON.parse(body);
        return {
          success: true,
          event: {
            type: payload.event_type || 'unknown',
            provider: this.name,
            data: payload.resource,
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

    // 验证 PayPal 签名
    // PayPal webhook 签名验证比较复杂
    // 参考: https://developer.paypal.com/api/rest/webhooks/rest/#verify-webhook-signature
    const transmissionId = headers['paypal-transmission-id'];
    const transmissionSig = headers['paypal-transmission-sig'];
    const transmissionTime = headers['paypal-transmission-time'];
    const certUrl = headers['paypal-cert-url'];

    if (!transmissionId || !transmissionSig) {
      return {
        success: false,
        error: 'Missing PayPal signature headers',
      };
    }

    try {
      // PayPal 签名验证需要调用 verify-webhook-signature API
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          error: 'Failed to get access token for webhook verification',
        };
      }

      const verifyResponse = await fetch(`${this.getBaseUrl()}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          transmission_id: transmissionId,
          transmission_time: transmissionTime,
          cert_url: certUrl,
          auth_algo: 'SHA256',
          transmission_sig: transmissionSig,
          webhook_id: webhookId,
          event_body: body,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.verification_status !== 'SUCCESS') {
        return {
          success: false,
          error: 'Webhook signature verification failed',
        };
      }

      const payload = JSON.parse(body);
      const eventType = payload.event_type;

      // 处理 PayPal 事件类型
      switch (eventType) {
        case 'CHECKOUT.ORDER.APPROVED':
        case 'CHECKOUT.ORDER.COMPLETED':
        case 'PAYMENT.CAPTURE.COMPLETED':
        case 'PAYMENT.CAPTURE.DENIED':
        case 'PAYMENT.CAPTURE.REFUNDED':
          console.log(`[PayPal] Event received: ${eventType}`, payload.resource);
          break;
      }

      return {
        success: true,
        event: {
          type: eventType,
          provider: this.name,
          data: payload.resource,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      console.error('[PayPal] Webhook error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      };
    }
  }
}

// 导出单例实例
export const paypalAdapter = new PayPalAdapter();