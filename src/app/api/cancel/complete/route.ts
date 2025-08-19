import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import xss from 'xss';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BodySchema = z.object({
    subscription_id: z.string().uuid(),
    accepted_downsell: z.boolean(),
    downsell_variant: z.enum(['A', 'B']),
    reason: z.string().trim().min(1).max(2000),
});

export async function POST(req: Request) {
    const userId = process.env.MOCK_USER_ID!;
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid', issues: parsed.error.flatten() }, { status: 400 });
    }
    const dto = parsed.data;

    // Sanitize reason to prevent XSS
    const cleanReason = xss(dto.reason);

    const { error } = await supabase.from('cancellations').insert({
        user_id: userId,
        subscription_id: dto.subscription_id,
        downsell_variant: dto.downsell_variant,
        accepted_downsell: dto.accepted_downsell,
        reason: cleanReason,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // (Optional) finalize subscription -> 'cancelled'
    // await supabase.from('subscriptions')
    //   .update({ status: 'cancelled' })
    //   .eq('id', dto.subscription_id);

    return NextResponse.json({ ok: true });
}
