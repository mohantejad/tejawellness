'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { activateAccount } from '@/api/auth';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';
import Link from 'next/link';

function ActivateContent() {
  const params = useSearchParams();
  const router = useRouter();
  const uid = params.get('uid') || '';
  const token = params.get('token') || '';
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onActivate = async () => {
    setLoading(true);
    try {
      await activateAccount({ uid, token });
      toast.success('Account activated!');
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch (err: unknown) {
      toast.error('Activation failed', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='card-soft p-6 w-full max-w-md space-y-4'>
      <h1 className='text-2xl font-bold'>Activate account</h1>

      {done ? (
        <div className='text-sm'>
          Your account is active.{' '}
          <Link href='/login' className='text-primary'>Login</Link>
        </div>
      ) : (
        <>
          <p className='text-sm text-mutedForeground'>
            Click the button to activate your account.
          </p>
          <button
            className='w-full rounded-xl bg-primary text-primaryForeground py-3 hover:opacity-90'
            onClick={onActivate}
            disabled={loading || !uid || !token}
          >
            {loading ? 'Activating...' : 'Activate'}
          </button>
        </>
      )}
    </div>
  );
}

export default function ActivatePage() {
  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <ActivateContent />
      </Suspense>
    </div>
  );
}
