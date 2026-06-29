import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get user profile from auth
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userId,
          email: user?.email || '',
          createdAt: user?.created_at || '',
        },
        subscription: subscription ? {
          planId: subscription.plan_id as string,
          planName: subscription.plan_name as string,
          status: subscription.status as string,
          provider: subscription.provider as string,
          currentPeriodStart: subscription.current_period_start as string,
          currentPeriodEnd: subscription.current_period_end as string,
          cancelAtPeriodEnd: subscription.cancel_at_period_end as boolean,
        } : null,
      }
    });
  } catch (error) {
    console.error('Get user data error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
