'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestPasswordReset } from '@/api/auth';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});

type Form = z.infer<typeof schema>;

export default function PasswordResetPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      await requestPasswordReset({ email: data.email });
      toast.success('Password reset email sent!');
    } catch (err: unknown) {
      toast.error('Request failed', { description: getErrorMessage(err) });
    }
  };

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='card-soft p-6 w-full max-w-md space-y-4'>
        <h1 className='text-2xl font-bold'>Reset password</h1>
        <input className='w-full rounded-xl border border-border px-4 py-3' placeholder='you@example.com' {...register('email')} />
        {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
        <button className='w-full rounded-xl bg-primary text-primaryForeground py-3 hover:opacity-90' disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </div>
  );
}
