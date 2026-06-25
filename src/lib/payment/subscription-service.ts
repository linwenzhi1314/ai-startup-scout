/**
 * 订阅服务
 * 处理用户订阅状态的所有数据库操作
 */

import { getSupabaseClient } from '@/lib/supabase';
import { PaymentProvider, PlanId, SubscriptionStatus } from './types';

// Webhook 解析后的标准化事件数据
export interface NormalizedWebhookEvent {
  eventType: 'subscription_created' | 'subscription_cancelled' | 'subscription_expired' | 'payment_succeeded' | 'payment_failed';
  provider: PaymentProvider;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  providerCheckoutId?: string;
  email?: string;
  userId?: string;
  planId?: PlanId;
  planName?: string;
  status: SubscriptionStatus;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  rawEvent: unknown;
}

/**
 * 处理支付成功的 webhook 事件
 * 创建或更新用户订阅记录
 */
export async function handleSubscriptionEvent(event: NormalizedWebhookEvent): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  try {
    switch (event.eventType) {
      case 'subscription_created':
      case 'payment_succeeded': {
        // 查找是否已有该用户的订阅记录
        const lookupField = event.email ? 'email' : event.userId ? 'user_id' : null;
        const lookupValue = event.email || event.userId;

        if (!lookupField || !lookupValue) {
          console.error('No email or userId in webhook event');
          return { success: false, error: 'Missing user identifier' };
        }

        // 查找现有订阅
        const { data: existing } = await supabase
          .from('user_subscriptions')
          .select('id, status, plan_id')
          .eq(lookupField, lookupValue)
          .eq('provider', event.provider)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existing) {
          // 更新现有订阅
          const updateData: Record<string, unknown> = {
            status: event.status || 'active',
            plan_id: event.planId || existing.plan_id,
            updated_at: new Date().toISOString(),
          };
          if (event.providerSubscriptionId) updateData.provider_subscription_id = event.providerSubscriptionId;
          if (event.providerCustomerId) updateData.provider_customer_id = event.providerCustomerId;
          if (event.currentPeriodStart) updateData.current_period_start = event.currentPeriodStart;
          if (event.currentPeriodEnd) updateData.current_period_end = event.currentPeriodEnd;

          const { error } = await supabase
            .from('user_subscriptions')
            .update(updateData)
            .eq('id', existing.id);

          if (error) {
            console.error('Failed to update subscription:', error);
            return { success: false, error: error.message };
          }

          console.log(`Subscription updated for ${lookupValue}: ${existing.status} -> ${event.status || 'active'}`);
        } else {
          // 创建新订阅记录
          const insertData: Record<string, unknown> = {
            user_id: event.userId || '',
            email: event.email || '',
            plan_id: event.planId || 'pro_monthly',
            plan_name: event.planName || '',
            status: event.status || 'active',
            provider: event.provider,
            provider_customer_id: event.providerCustomerId || '',
            provider_subscription_id: event.providerSubscriptionId || '',
            provider_checkout_id: event.providerCheckoutId || '',
            current_period_start: event.currentPeriodStart || new Date().toISOString(),
            current_period_end: event.currentPeriodEnd || null,
            cancel_at_period_end: event.cancelAtPeriodEnd || false,
          };

          const { error } = await supabase
            .from('user_subscriptions')
            .insert(insertData);

          if (error) {
            console.error('Failed to create subscription:', error);
            return { success: false, error: error.message };
          }

          console.log(`Subscription created for ${event.email || event.userId}: ${event.planId}`);
        }
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        // 更新订阅状态为取消/过期
        const subLookupField = event.providerSubscriptionId ? 'provider_subscription_id' : event.email ? 'email' : null;
        const subLookupValue = event.providerSubscriptionId || event.email;

        if (!subLookupField || !subLookupValue) {
          return { success: false, error: 'Missing subscription identifier' };
        }

        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            status: event.eventType === 'subscription_cancelled' ? 'cancelled' : 'expired',
            cancel_at_period_end: event.eventType === 'subscription_cancelled' ? true : false,
            updated_at: new Date().toISOString(),
          })
          .eq(subLookupField, subLookupValue)
          .eq('provider', event.provider);

        if (error) {
          console.error('Failed to update subscription status:', error);
          return { success: false, error: error.message };
        }

        console.log(`Subscription ${event.eventType} for ${subLookupValue}`);
        break;
      }

      case 'payment_failed': {
        // 标记订阅为 past_due（暂用 expired 代替）
        if (event.providerSubscriptionId) {
          const { error } = await supabase
            .from('user_subscriptions')
            .update({
              status: 'expired',
              updated_at: new Date().toISOString(),
            })
            .eq('provider_subscription_id', event.providerSubscriptionId)
            .eq('provider', event.provider);

          if (error) {
            console.error('Failed to mark subscription as past_due:', error);
            return { success: false, error: error.message };
          }
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.eventType);
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling subscription event:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * 获取用户当前订阅状态
 */
export async function getUserSubscription(userId: string): Promise<Record<string, unknown> | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Failed to get user subscription:', error);
    return null;
  }

  return data;
}

/**
 * 获取所有订阅统计（后台管理用）
 */
export async function getSubscriptionStats(): Promise<{
  total: number;
  active: number;
  cancelled: number;
  expired: number;
  revenue: string;
}> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('status, plan_id');

  if (error) {
    console.error('Failed to get subscription stats:', error);
    return { total: 0, active: 0, cancelled: 0, expired: 0, revenue: '$0' };
  }

  const records = data || [];
  const active = records.filter((r: { status: string }) => r.status === 'active').length;
  const cancelled = records.filter((r: { status: string }) => r.status === 'cancelled').length;
  const expired = records.filter((r: { status: string }) => r.status === 'expired').length;

  // 粗略计算收入：pro $9/月 + investor $49/月
  let monthlyRevenue = 0;
  for (const record of records) {
    if (record.status === 'active') {
      if (record.plan_id === 'pro_monthly') monthlyRevenue += 9;
      if (record.plan_id === 'investor_monthly') monthlyRevenue += 49;
    }
  }

  return {
    total: records.length,
    active,
    cancelled,
    expired,
    revenue: `$${monthlyRevenue}/月`,
  };
}
