/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef } from 'react';
import { TERMINAL_STEPS, buildReasonFromState } from '../lib';
import type { CancelFlowState } from '@/store/cancelFlowSlice';

export const useCompleteOnTerminalStep = (
  step: string,
  subId: string | undefined,
  cancel: CancelFlowState
) => {
  const sent = useRef(false);

  useEffect(() => {
    if (!TERMINAL_STEPS.has(step as any)) return;
    if (!subId) return;
    if (sent.current) return;

    const run = async () => {
      sent.current = true;

      const payload = {
        subscription_id: subId,
        accepted_downsell: !!cancel.offerAccepted,
        downsell_variant: (cancel.abVariant ?? 'A') as 'A' | 'B',
        reason: buildReasonFromState(cancel),
      };

      try {
        const res = await fetch('/api/cancel/complete', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error('complete failed', res.status, txt);
          // let it try again if user re-enters a terminal step
          sent.current = false;
        } else {
          // optional: log status returned by server
          const json = await res.json().catch(() => undefined);
          console.log('complete ok', json);
        }
      } catch (e) {
        console.error('complete failed (network)', e);
        sent.current = false;
      }
    };

    run();
  }, [step, subId, cancel]);
};
