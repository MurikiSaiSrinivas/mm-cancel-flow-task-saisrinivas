import type { CancelFlowState, DownsellVariant, CancelStep } from '@/store/cancelFlowSlice';

export const money = (cents?: number) => `$${((cents ?? 0) / 100).toFixed(2)}`;

export function computeOffer(ab: DownsellVariant | undefined, planCents?: number) {
    const plan = planCents ?? 2500;
    const headline = ab === 'B'
        ? 'Stay for $10 less while you search.'
        : 'Here’s 50% off until you find a job.'; // A or undefined

    const priceWas = money(plan);
    const priceNow = ab === 'B' ? money(Math.max(plan - 1000, 0)) : money(Math.floor(plan / 2));

    return { headline, priceWas, priceNow };
}

export function buildReasonFromState(cancel: CancelFlowState): string {
    if (cancel.offerAccepted) {
        const plan = cancel.planCents ?? 2500;
        const oldPrice = money(plan);
        const isB = cancel.abVariant === 'B';
        const newCents = isB ? Math.max(plan - 1000, 0) : Math.floor(plan / 2);
        const newPrice = money(newCents);
        const label = isB ? '$10 off' : '50% off';
        return `Accepted downsell (${cancel.abVariant ?? 'A'} – ${label}): ${oldPrice} → ${newPrice}.`;
    }
    if (cancel.foundJob) {
        const bits = [
            cancel.visa?.visa ? `visa=${cancel.visa?.visa}` : null,
            cancel.visa?.hasLawyer ? `hasLawyer=${cancel.visa?.hasLawyer}` : null,
            cancel.survey?.foundWithMigrateMate ? `foundWithMM=${cancel.survey?.foundWithMigrateMate}` : null,
        ].filter(Boolean);
        const wish = cancel.wishText ? `; wish="${cancel.wishText}"` : '';
        return `Found job${bits.length ? ' (' + bits.join(', ') + ')' : ''}${wish}`;
    }
    if (cancel.reason?.reason) {
        const map: Record<string, string> = {
            too_expensive: 'Too expensive',
            not_helpful: 'Not helpful',
            not_relevant: 'Not relevant',
            not_moving: "I'm not moving",
            other: 'Other',
        };
        let base = map[cancel.reason.reason] ?? 'Other';
        if (cancel.reason.amount) base += `; amount=${cancel.reason.amount}`;
        if (cancel.reason.details) base += `; details="${cancel.reason.details}"`;
        return base;
    }
    return 'No reason provided';
}

export const TERMINAL_STEPS = new Set<CancelStep>([
    'accepted.offer',
    'complete.subscriptionEnded',
    'complete.withVisa',
    'complete.noVisa',
]);
