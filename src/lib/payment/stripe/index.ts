/**
 * Stripe 支付适配器
 * 需要美国/欧洲公司实体
 * 需要自己处理税务
 */

import Stripe from 'stripe';
import {
  PaymentAdapter,
  PaymentProvider,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  WebhookResult,
  UserSubscription,
  PlanConfig,
  PlanId,
} from '../types';

// 定价方案配置（使用真实的 Stripe Price ID）
const STRIPE_PLANS: Record<string, PlanConfig & { priceId: string }> = {
  'pro_monthly': {
    id: 'pro_monthly',
    name: '专业版 (月付)',
    price: 9,
    currency: 'USD',
    priceId: 'price_1TkN0OCMMBAjcEo2mzUBAr9U',
    description: '$9/月，适合个人创业者',
  },
  'investor_monthly': {
    id: 'investor_monthly',
    name: '投资版 (月付)',
    price: 49,
    currency: 'USD',
    priceId: 'price_1TkN2nCMMBAjcEo25UHLEPeW',
    description: '$49/月，适合专业投资人',
  },
};

// 懒加载 Stripe 客户端
let stripeClient: Stripe | null = null;

const getStripeClient = (): Stripe | null => {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    stripeClient = new Stripe(key, {
      apiVersion: '2026-05-27.dahlia',
    });
  }
  return stripeClient;
};

export class StripeAdapter implements PaymentAdapter {
  name: PaymentProvider = 'stripe';
  displayName = 'Stripe';
  requiresCompany = true;
  handlesTax = false;
  feeDescription = '2.9% + $0.30';

  isConfigured(): boolean {
    return !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;
  }

  async createCheckoutSession(request: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    const stripe = getStripeClient();
    
    if (!stripe) {
      return {
        success: false,
        provider: this.name,
        error: 'Stripe is not configured',
      };
    }

    const plan = STRIPE_PLANS[request.planId];
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
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: request.successUrl || `${baseUrl}/${locale}/dashboard?payment=success`,
        cancel_url: request.cancelUrl || `${baseUrl}/${locale}/pricing?payment=cancelled`,
        metadata: {
          userId: request.userId,
          planId: request.planId,
          locale,
        },
      });

      return {
        success: true,
        sessionId: session.id,
        url: session.url,
        provider: this.name,
      };
    } catch (error) {
      console.error('Stripe checkout error:', error);
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
    const stripe = getStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!stripe || !webhookSecret) {
      return {
        success: false,
        error: 'Stripe is not configured',
      };
    }

    const sig = headers['stripe-signature'];
    if (!sig) {
      return {
        success: false,
        error: 'Missing stripe-signature header',
      };
    }

    try {
      const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      
      // 处理事件
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log('[Stripe] Payment completed:', {
            sessionId: session.id,
            userId: session.metadata?.userId,
            planId: session.metadata?.planId,
          });
          break;
        }
        
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`[Stripe] Subscription ${event.type.split('.')[2]}:`, subscription.id);
          break;
        }
        
        case 'invoice.payment_succeeded':
        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          console.log(`[Stripe] Invoice payment ${event.type.split('.')[2]}:`, invoice.id);
          break;
        }
      }

      return {
        success: true,
        event: {
          type: event.type,
          provider: this.name,
          data: event.data.object,
          timestamp: event.created * 1000,
        },
      };
    } catch (error) {
      console.error('[Stripe] Webhook error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook verification failed',
      };
    }
  }

  async getSubscription(subscriptionId: string): Promise<UserSubscription | null> {
    const stripe = getStripeClient();
    if (!stripe) return null;

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      return {
        id: subscription.id,
        userId: subscription.metadata?.userId || '',
        planId: (subscription.metadata?.planId as PlanId) || 'pro_monthly',
        provider: this.name,
        status: this.mapStripeStatus(subscription.status),
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      };
    } catch (error) {
      console.error('[Stripe] Get subscription error:', error);
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const stripe = getStripeClient();
    if (!stripe) return false;

    try {
      await stripe.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error) {
      console.error('[Stripe] Cancel subscription error:', error);
      return false;
    }
  }

  private mapStripeStatus(status: Stripe.Subscription.Status): 'active' | 'cancelled' | 'expired' | 'pending' {
    switch (status) {
      case 'active':
        return 'active';
      case 'canceled':
        return 'cancelled';
      case 'incomplete':
      case 'incomplete_expired':
      case 'past_due':
        return 'pending';
      default:
        return 'expired';
    }
  }
}

// 导出单例实例
export const stripeAdapter = new StripeAdapter();