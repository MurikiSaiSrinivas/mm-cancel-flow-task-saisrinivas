/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef } from 'react';
import { TERMINAL_STEPS, buildReasonFromState } from '../lib';
import type { CancelFlowState } from '@/store/cancelFlowSlice';

export const useCompleteOnTerminalStep = (step: string, subId: string | undefined, cancel: CancelFlowState) => {
  const sent = useRef(false);

  useEffect(() => {
    if (!TERMINAL_STEPS.has(step as any)) return;
    if (!subId) return;
    if (sent.current) return;
    sent.current = true;

    const payload = {
      subscription_id: subId,
      accepted_downsell: !!cancel.offerAccepted,
      downsell_variant: (cancel.abVariant ?? 'A') as 'A' | 'B',
      reason: buildReasonFromState(cancel),
    };

    fetch('/api/cancel/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((e) => console.error('complete failed', e));
  }, [step, subId, cancel]);
};
