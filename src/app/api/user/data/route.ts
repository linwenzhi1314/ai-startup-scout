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
      return NextResponse.json({ 
        success: true, 
        data: { 
          user: null, 
          subscription: null 
        } 
      });
    }

    // Get user profile from auth
    let userEmail = '';
    let userCreatedAt = '';
    try {
      const { data: { user } } = await supabase.auth.admin.getUserById(userId);
      userEmail = user?.email || '';
      userCreatedAt = user?.created_at || '';
    } catch {
      // Auth lookup may fail for non-authenticated users
    }

    // Get user subscription - wrap in try/catch since table may not be in schema cache
    let subscription = null;
    try {
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subData) {
        subscription = {
          planId: subData.plan_id as string,
          planName: subData.plan_name as string,
          status: subData.status as string,
          provider: subData.provider as string,
          currentPeriodStart: subData.current_period_start as string,
          currentPeriodEnd: subData.current_period_end as string,
          cancelAtPeriodEnd: subData.cancel_at_period_end as boolean,
        };
      }
    } catch {
      // Table may not exist yet in schema cache
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userId,
          email: userEmail,
          createdAt: userCreatedAt,
        },
        subscription,
      }
    });
  } catch (error) {
    console.error('Get user data error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
