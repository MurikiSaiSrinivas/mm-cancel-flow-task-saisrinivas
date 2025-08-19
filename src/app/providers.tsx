// app/providers.tsx
'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store'; // your store/index.ts

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {/* PersistGate must be client-side */}
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
