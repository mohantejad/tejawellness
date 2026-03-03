'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { setPassword } from '@/api/auth';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';
import AuthRequired from '@/components/auth/AuthRequired';

const schema = z.object({
  current_password: z.string().min(6, { message: 'Required' }),
  new_password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  re_new_password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((d) => d.new_password === d.re_new_password, {
  path: ['re_new_password'],
  message: 'Passwords do not match',
});

type Form = z.infer<typeof schema>;

export default function SetPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      await setPassword(data);
      toast.success('Password updated!');
    } catch (err: unknown) {
      toast.error('Update failed', { description: getErrorMessage(err) });
    }
  };

  return (
    <AuthRequired>
      <div className='min-h-[60vh] flex items-center justify-center'>
        <form onSubmit={handleSubmit(onSubmit)} className='card-soft p-6 w-full max-w-md space-y-4'>
          <h1 className='text-2xl font-bold'>Change password</h1>
          <input className='w-full rounded-xl border border-border px-4 py-3' type='password' placeholder='Current password' {...register('current_password')} />
          {errors.current_password && <p className='text-red-600'>{errors.current_password.message}</p>}
          <input className='w-full rounded-xl border border-border px-4 py-3' type='password' placeholder='New password' {...register('new_password')} />
          {errors.new_password && <p className='text-red-600'>{errors.new_password.message}</p>}
          <input className='w-full rounded-xl border border-border px-4 py-3' type='password' placeholder='Confirm new password' {...register('re_new_password')} />
          {errors.re_new_password && <p className='text-red-600'>{errors.re_new_password.message}</p>}
          <button className='w-full rounded-xl bg-primary text-primaryForeground py-3 hover:opacity-90' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </AuthRequired>
  );
}
