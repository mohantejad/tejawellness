'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

export default function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isInitialized, isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return <div className='min-h-[60vh] flex items-center justify-center text-mutedForeground'>Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
