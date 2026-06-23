/**
 * 支付配置数据库操作
 * 用于从 Supabase 数据库读取/更新支付方案配置
 */

import { getSupabaseClient } from '@/lib/supabase';
import { PaymentProvider } from './types';

export interface PaymentConfigRow {
  id: number;
  active_provider: PaymentProvider;
  updated_at: string;
  updated_by: string | null;
}

/**
 * 从数据库获取当前激活的支付方案
 */
export async function getActiveProviderFromDB(): Promise<PaymentProvider | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payment_config')
      .select('active_provider')
      .order('id', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error('Failed to get payment config from DB:', error);
      return null;
    }

    return data?.active_provider as PaymentProvider;
  } catch (error) {
    console.error('Error getting payment config:', error);
    return null;
  }
}

/**
 * 更新数据库中的支付方案配置
 */
export async function updateActiveProviderInDB(
  provider: PaymentProvider,
  updatedBy: string = 'admin'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('payment_config')
      .update({
        active_provider: provider,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      })
      .eq('id', 1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating payment config:', error);
    return { success: false, error: 'Internal error' };
  }
}

/**
 * 获取支付方案切换历史（可选）
 */
export async function getPaymentConfigHistory(limit: number = 10): Promise<PaymentConfigRow[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payment_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to get payment config history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting payment config history:', error);
    return [];
  }
}