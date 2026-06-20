import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// 从环境变量获取 Stripe 密钥
const getStripeSecretKey = (): string => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  return key;
};

const getWebhookSecret = (): string => {
  return process.env.STRIPE_WEBHOOK_SECRET || '';
};

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2026-05-27.dahlia',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const webhookSecret = getWebhookSecret();
  
  // 开发环境如果没有 webhook secret，直接返回成功
  if (!webhookSecret) {
    console.log('Webhook received (dev mode, no verification):', body);
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // 处理不同类型的事件
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment completed:', {
        sessionId: session.id,
        userId: session.metadata?.userId,
        planId: session.metadata?.planId,
        locale: session.metadata?.locale,
      });
      
      // TODO: 更新用户订阅状态到 Supabase
      // await updateUserSubscription(session.metadata?.userId, session.metadata?.planId);
      
      break;
    }
    
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription created:', subscription.id);
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id);
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription cancelled:', subscription.id);
      
      // TODO: 更新用户订阅状态为已取消
      break;
    }
    
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment succeeded:', invoice.id);
      break;
    }
    
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment failed:', invoice.id);
      break;
    }
    
    default:
      console.log('Unhandled event type:', event.type);
  }

  return NextResponse.json({ received: true });
}