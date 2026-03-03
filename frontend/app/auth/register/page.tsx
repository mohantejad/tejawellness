'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAppDispatch } from '@/redux/hooks';
import { register as registerAction } from '@/redux/slices/authSlice';
import { getErrorMessage } from '@/utils/errors';
import { getGoogleAuthUrl } from '@/api/auth';

const registerSchema = z
  .object({
    email: z.email({ message: 'Invalid email' }),
    first_name: z.string().min(1, { message: 'First name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    re_password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    accept_terms: z.boolean().refine((v) => v === true, {
      message: 'You must accept the terms',
    }),
  })
  .refine((data) => data.password === data.re_password, {
    message: 'Passwords do not match',
    path: ['re_password'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError('');
    try {
      await dispatch(registerAction(data)).unwrap();
      toast.success('Account created!');
      router.push('/auth/login');
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Signup failed');
      setServerError(msg);
      toast.error('Signup failed', { description: msg });
    }
  };

  const onGoogle = async () => {
    const redirect_uri =
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/auth/google';
    const data = await getGoogleAuthUrl(redirect_uri);
    if (data?.authorization_url) {
      window.location.href = data.authorization_url;
    }
  };

  return (
    <div className='min-h-[70vh] flex items-center justify-center'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-md card-soft p-6 space-y-4'
      >
        <h1 className='text-3xl font-bold'>Create account</h1>
        <p className='text-sm text-mutedForeground'>
          Start building your personalized nutrition plan.
        </p>

        <button
          type='button'
          onClick={onGoogle}
          className='w-full rounded-xl border border-border py-3 hover:bg-muted transition'
        >
          Continue with Google
        </button>

        <div className='flex items-center gap-3 text-xs text-mutedForeground'>
          <span className='h-px w-full bg-border' />
          <span>or</span>
          <span className='h-px w-full bg-border' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label className='text-sm text-mutedForeground'>First name</label>
            <input
              className='mt-1 w-full rounded-xl border border-border px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='First name'
              {...register('first_name')}
            />
            {errors.first_name && <p className='text-red-600'>{errors.first_name.message}</p>}
          </div>
          <div>
            <label className='text-sm text-mutedForeground'>Last name</label>
            <input
              className='mt-1 w-full rounded-xl border border-border px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='Last name'
              {...register('last_name')}
            />
            {errors.last_name && <p className='text-red-600'>{errors.last_name.message}</p>}
          </div>
        </div>

        <div>
          <label className='text-sm text-mutedForeground'>Email</label>
          <input
            className='mt-1 w-full rounded-xl border border-border px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='you@example.com'
            {...register('email')}
          />
          {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
        </div>

        <div>
          <label className='text-sm text-mutedForeground'>Password</label>
          <input
            className='mt-1 w-full rounded-xl border border-border px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary'
            type='password'
            placeholder='••••••••'
            {...register('password')}
          />
          {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
        </div>

        <div>
          <label className='text-sm text-mutedForeground'>Confirm Password</label>
          <input
            className='mt-1 w-full rounded-xl border border-border px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary'
            type='password'
            placeholder='••••••••'
            {...register('re_password')}
          />
          {errors.re_password && <p className='text-red-600'>{errors.re_password.message}</p>}
        </div>

        {serverError && <p className='text-red-600'>{serverError}</p>}

        <div className='flex items-start gap-2'>
          <input
            type='checkbox'
            className='mt-1 cursor-pointer'
            {...register('accept_terms')}
          />
          <label className='text-sm text-mutedForeground'>
            I agree to the Terms and Privacy Policy.
          </label>
        </div>
        {errors.accept_terms && (
          <p className='text-red-600'>{errors.accept_terms.message}</p>
        )}

        <button
          className='w-full rounded-xl bg-primary text-primaryForeground py-3 hover:opacity-90 transition'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>

        <div className='w-full text-sm items-center justify-center flex text-mutedForeground'>
          Already have an account?
          <Link href='/auth/login' className='ml-1 group text-mutedForeground transition duration-300 hover:text-primary'>
            Login
            <span className='block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary hover:text-primary decoration-2 decoration-primary'></span>
          </Link>
        </div>
      </form>
    </div>
  );
}
