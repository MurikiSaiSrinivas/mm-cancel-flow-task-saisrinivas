// app/api/cancel/complete/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import xss from 'xss';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // service role for the take-home
);

const BodySchema = z.object({
    subscription_id: z.string().uuid(),
    accepted_downsell: z.boolean(),
    downsell_variant: z.enum(['A', 'B']),
    reason: z.string().trim().min(1).max(2000),
});

const COOKIE = 'mm_downsell_variant';


export async function POST(req: Request) {
    const userId = process.env.MOCK_USER_ID!;
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid', issues: parsed.error.flatten() }, { status: 400 });
    }
    const dto = parsed.data;

    // 1) Insert cancellation row (sanitize text)
    const { error: insErr } = await supabase.from('cancellations').insert({
        user_id: userId,
        subscription_id: dto.subscription_id,
        downsell_variant: dto.downsell_variant,
        accepted_downsell: dto.accepted_downsell,
        reason: xss(dto.reason),
    });
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

    // 2) Update subscription status based on outcome
    // app/api/cancel/complete/route.ts (only the update part changed)
    const newStatus = dto.accepted_downsell ? 'active' : 'cancelled' as const;

    const { data: updRows, error: updErr } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('id', dto.subscription_id)
        .eq('user_id', userId)
        .select('id');                 // <- forces returning rows

    if (updErr) {
        return NextResponse.json({ error: updErr.message }, { status: 500 });
    }
    if (!updRows || updRows.length === 0) {
        // subscription_id didn't belong to userId (or not found)
        return NextResponse.json({ error: 'Subscription not found for user' }, { status: 404 });
    }


    const res = NextResponse.json({ ok: true, status: newStatus });

    // ❗️Delete the A/B cookie so the next test re-assigns a fresh variant
    res.cookies.delete(COOKIE);

    return res;
}
