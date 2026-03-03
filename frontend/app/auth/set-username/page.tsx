'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { setUsername } from '@/api/auth';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';
import AuthRequired from '@/components/auth/AuthRequired';

const schema = z.object({
  current_password: z.string().min(6, { message: 'Required' }),
  new_username: z.string().min(3, { message: 'Username too short' }),
});

type Form = z.infer<typeof schema>;

export default function SetUsernamePage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      await setUsername(data);
      toast.success('Username updated!');
    } catch (err: unknown) {
      toast.error('Update failed', { description: getErrorMessage(err) });
    }
  };

  return (
    <AuthRequired>
      <div className='min-h-[60vh] flex items-center justify-center'>
        <form onSubmit={handleSubmit(onSubmit)} className='card-soft p-6 w-full max-w-md space-y-4'>
          <h1 className='text-2xl font-bold'>Change username</h1>
          <input className='w-full rounded-xl border border-border px-4 py-3' type='password' placeholder='Current password' {...register('current_password')} />
          {errors.current_password && <p className='text-red-600'>{errors.current_password.message}</p>}
          <input className='w-full rounded-xl border border-border px-4 py-3' placeholder='New username' {...register('new_username')} />
          {errors.new_username && <p className='text-red-600'>{errors.new_username.message}</p>}
          <button className='w-full rounded-xl bg-primary text-primaryForeground py-3 hover:opacity-90' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </AuthRequired>
  );
}
