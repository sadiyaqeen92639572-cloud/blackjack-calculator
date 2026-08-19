'use client';

import { useEffect } from 'react';
import { useBlackjackStore } from '@/store/blackjack-store';

export function HydrationGate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useBlackjackStore.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
