'use client';

import { useState } from 'react';
import { requestUsernameReset } from '@/api/auth';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';

export default function UsernameResetPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await requestUsernameReset({ email });
      toast.success('Username reset email sent!');
    } catch (err: unknown) {
      toast.error('Request failed', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='card-soft p-6 w-full max-w-md space-y-4'>
        <h1 className='text-2xl font-bold'>Reset username</h1>
        <input
          className='w-full rounded-xl border border-border px-4 py-3'
          placeholder='you@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className='w-full rounded-xl bg-primary text-primaryForeground py-3 hover:opacity-90'
          onClick={onSubmit}
          disabled={loading || !email}
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </div>
    </div>
  );
}
