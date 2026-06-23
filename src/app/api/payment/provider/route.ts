import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// 支持的支付方案
const SUPPORTED_PROVIDERS = ['stripe', 'creem', 'lemonsqueezy', 'paddle', 'paypal'];

/**
 * GET: 获取当前激活的支付方案
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('payment_config')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();
    
    if (error) {
      // 如果表不存在或没有数据，返回默认值
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return NextResponse.json({
          success: true,
          activeProvider: process.env.PAYMENT_PROVIDER || 'creem',
          source: 'env'
        });
      }
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      activeProvider: data.active_provider,
      updatedAt: data.updated_at,
      updatedBy: data.updated_by,
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching payment config:', error);
    return NextResponse.json({
      success: false,
      activeProvider: process.env.PAYMENT_PROVIDER || 'creem',
      source: 'env_fallback',
      error: 'Failed to fetch from database'
    }, { status: 500 });
  }
}

/**
 * POST: 切换支付方案
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider } = body;
    
    if (!provider) {
      return NextResponse.json({
        success: false,
        error: 'Provider is required'
      }, { status: 400 });
    }
    
    if (!SUPPORTED_PROVIDERS.includes(provider)) {
      return NextResponse.json({
        success: false,
        error: `Unsupported provider: ${provider}. Supported: ${SUPPORTED_PROVIDERS.join(', ')}`
      }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    
    // 检查是否有配置记录
    const { data: existing } = await supabase
      .from('payment_config')
      .select('id')
      .limit(1)
      .single();
    
    if (existing) {
      // 更新现有记录
      const { error } = await supabase
        .from('payment_config')
        .update({
          active_provider: provider,
          updated_at: new Date().toISOString(),
          updated_by: 'admin'
        })
        .eq('id', existing.id);
      
      if (error) throw error;
    } else {
      // 创建新记录
      const { error } = await supabase
        .from('payment_config')
        .insert({
          active_provider: provider,
          updated_by: 'admin'
        });
      
      if (error) throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: `Payment provider switched to ${provider}`,
      activeProvider: provider
    });
  } catch (error) {
    console.error('Error switching payment provider:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to switch payment provider'
    }, { status: 500 });
  }
}