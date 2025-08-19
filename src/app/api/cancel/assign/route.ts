import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE = 'mm_downsell_variant';
type V = 'A' | 'B';

export async function POST() {
    const jar = await cookies();
    const existing = jar.get(COOKIE)?.value as V | undefined;
    if (existing === 'A' || existing === 'B') {
        return NextResponse.json({ variant: existing });
    }

    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const variant: V = (buf[0] % 2 === 0) ? 'A' : 'B';

    const res = NextResponse.json({ variant });
    res.cookies.set({
        name: COOKIE,
        value: variant,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30d
    });
    return res;
}
