import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// 支持的支付方案
const SUPPORTED_PROVIDERS = ['stripe', 'creem', 'lemonsqueezy', 'paddle', 'paypal'];

// 管理员密钥（从环境变量读取，用于 API 鉴权）
function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || 'ai-startup-scout-admin-2024';
}

// 验证管理员权限
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = request.headers.get('x-admin-key');
  const urlKey = request.nextUrl.searchParams.get('admin_key');

  // 支持三种方式验证
  if (authHeader === `Bearer ${getAdminSecret()}`) return true;
  if (adminKey === getAdminSecret()) return true;
  if (urlKey === getAdminSecret()) return true;

  return false;
}

/**
 * GET: 获取当前激活的支付方案（公开接口，读取配置不需要鉴权）
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
 * POST: 切换支付方案（需要管理员鉴权）
 */
export async function POST(request: NextRequest) {
  // 验证管理员权限
  if (!isAdmin(request)) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized. Admin access required.'
    }, { status: 401 });
  }

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