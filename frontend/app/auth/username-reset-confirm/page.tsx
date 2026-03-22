'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmUsernameReset } from '@/api/auth';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';

function UsernameResetConfirmContent() {
  const params = useSearchParams();
  const uid = params.get('uid') || '';
  const token = params.get('token') || '';
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await confirmUsernameReset({ uid, token, new_username: newUsername });
      toast.success('Username updated!');
    } catch (err: unknown) {
      toast.error('Update failed', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='card-soft p-6 w-full max-w-md space-y-4'>
      <h1 className='text-2xl font-bold'>Set new username</h1>
      <input
        className='w-full rounded-xl border border-border px-4 py-3'
        placeholder='New username'
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <button
        className='w-full rounded-xl bg-primary text-primaryForeground py-3 hover:opacity-90'
        onClick={onSubmit}
        disabled={loading || !uid || !token}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

export default function UsernameResetConfirmPage() {
  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <UsernameResetConfirmContent />
      </Suspense>
    </div>
  );
}
