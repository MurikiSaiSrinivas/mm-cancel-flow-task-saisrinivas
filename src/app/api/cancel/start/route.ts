import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
    const userId = process.env.MOCK_USER_ID!;
    // Update status -> 'pending_cancellation'
    await supabase
        .from('subscriptions')
        .update({ status: 'pending_cancellation' })
        .eq('user_id', userId);

    // Fetch current sub (pending or active)
    const { data: sub, error } = await supabase
        .from('subscriptions')
        .select('id, monthly_price, status')
        .eq('user_id', userId)
        .in('status', ['active', 'pending_cancellation'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !sub) {
        return NextResponse.json({ error: error?.message ?? 'No subscription' }, { status: 404 });
    }

    return NextResponse.json({
        subscription_id: sub.id,
        price_cents: sub.monthly_price,
        status: sub.status,
    });
}
