'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAbVariant } from '@/store/cancelFlowSlice';

const LOCK = 'mm:ab:assign:lock';

export const useAssignVariant = () => {
    const dispatch = useAppDispatch();
    const ab = useAppSelector((s) => s.cancelFlow.abVariant);

    useEffect(() => {
        if (ab) return;
        if (sessionStorage.getItem(LOCK) === '1') return;
        sessionStorage.setItem(LOCK, '1');

        let qs = '';
        if (process.env.NODE_ENV !== 'production') {
            const url = new URL(window.location.href);
            const force = url.searchParams.get('ab')?.toUpperCase();
            if (force === 'A' || force === 'B') qs = `?force=${force}`;
        }

        fetch(`/api/cancel/assign${qs}`, { method: 'POST' })
            .then((r) => r.json())
            .then(({ variant }) => dispatch(setAbVariant(variant)))
            .finally(() => sessionStorage.removeItem(LOCK));
    }, [ab, dispatch]);
};
