/**
 * 后台统计数据 API
 * 从数据库查询真实的订阅和用户数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { getSubscriptionStats } from '@/lib/payment/subscription-service';

// 管理员鉴权
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = request.headers.get('x-admin-key');
  const urlKey = request.nextUrl.searchParams.get('admin_key');
  const secret = process.env.ADMIN_SECRET || 'ai-startup-scout-admin-2024';

  if (authHeader === `Bearer ${secret}`) return true;
  if (adminKey === secret) return true;
  if (urlKey === secret) return true;

  return false;
}

/**
 * GET: 获取后台统计数据
 * 支持查询参数 ?section=overview|users|subscriptions
 */
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const section = request.nextUrl.searchParams.get('section') || 'overview';

  try {
    switch (section) {
      case 'overview':
        return NextResponse.json(await getOverviewStats());
      case 'users':
        return NextResponse.json(await getUsersList(request));
      case 'subscriptions':
        return NextResponse.json(await getSubscriptionDetails());
      default:
        return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

/**
 * 总览统计
 */
async function getOverviewStats() {
  const supabase = getSupabaseClient();

  // 订阅统计
  const subStats = await getSubscriptionStats();

  // 用户统计（从 subscribers 表）
  const { count: totalUsers } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true });

  // 反馈统计
  const { count: totalFeedback } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true });

  return {
    success: true,
    data: {
      users: totalUsers || 0,
      subscriptions: subStats.total,
      activeSubscriptions: subStats.active,
      cancelledSubscriptions: subStats.cancelled,
      expiredSubscriptions: subStats.expired,
      revenue: subStats.revenue,
      feedback: totalFeedback || 0,
    },
  };
}

/**
 * 用户列表
 */
async function getUsersList(request: NextRequest) {
  const supabase = getSupabaseClient();
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  // 从 subscribers 表获取用户
  const { data: subscribers, count, error } = await supabase
    .from('subscribers')
    .select('id, email, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Failed to fetch users:', error);
    return { success: false, error: error.message };
  }

  // 获取每个用户的订阅状态
  const usersWithSubs = await Promise.all(
    (subscribers || []).map(async (sub: { id: number; email: string; created_at: string }) => {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('plan_id, plan_name, status, provider')
        .eq('email', sub.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        id: sub.id,
        email: sub.email,
        plan: subscription?.plan_name || '免费版',
        planId: subscription?.plan_id || 'free',
        status: subscription?.status || 'free',
        provider: subscription?.provider || null,
        createdAt: sub.created_at,
      };
    })
  );

  return {
    success: true,
    data: usersWithSubs,
    pagination: {
      page,
      limit,
      total: count || 0,
    },
  };
}

/**
 * 订阅详情
 */
async function getSubscriptionDetails() {
  const supabase = getSupabaseClient();

  const subStats = await getSubscriptionStats();

  // 最近订阅记录
  const { data: recentSubs, error } = await supabase
    .from('user_subscriptions')
    .select('id, email, plan_id, plan_name, status, provider, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch subscriptions:', error);
  }

  // 按方案分组统计
  const planBreakdown: Record<string, number> = {};
  for (const sub of recentSubs || []) {
    const key = sub.plan_id || 'unknown';
    planBreakdown[key] = (planBreakdown[key] || 0) + 1;
  }

  // 按支付方案分组统计
  const providerBreakdown: Record<string, number> = {};
  for (const sub of recentSubs || []) {
    const key = sub.provider || 'unknown';
    providerBreakdown[key] = (providerBreakdown[key] || 0) + 1;
  }

  return {
    success: true,
    data: {
      stats: subStats,
      planBreakdown,
      providerBreakdown,
      recentSubscriptions: recentSubs || [],
    },
  };
}