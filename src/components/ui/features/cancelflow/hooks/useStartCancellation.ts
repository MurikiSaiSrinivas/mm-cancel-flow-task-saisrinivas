'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setPlanCents } from '@/store/cancelFlowSlice';

export const useStartCancellation = () => {
    const dispatch = useAppDispatch();
    const [subId, setSubId] = useState<string>();

    useEffect(() => {
        fetch('/api/cancel/start', { method: 'POST' })
            .then((r) => r.json())
            .then((json) => {
                if (json?.price_cents) dispatch(setPlanCents(json.price_cents));
                if (json?.subscription_id) setSubId(json.subscription_id);
            });
    }, [dispatch]);

    return subId;
};
