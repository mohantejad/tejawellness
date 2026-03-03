'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import GuestOnly from '@/components/auth/GuestOnly';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login, clearAuthError } from '@/redux/slices/authSlice';
import { getErrorMessage } from '@/utils/errors';
import { getGoogleAuthUrl } from '@/api/auth';

const loginSchema = z.object({
  email: z.email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  remember_me: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setServerError('');
    try {
      await dispatch(
        login({
          email: data.email,
          password: data.password,
          remember_me: Boolean(data.remember_me),
        })
      ).unwrap();

      toast.success('Welcome back!');
      router.push('/');
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Login failed');
      setServerError(msg);
      toast.error('Login failed', { description: msg });
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
    <GuestOnly>
      <div className='min-h-[70vh] flex items-center justify-center'>
        <form onSubmit={handleSubmit(onSubmit)} className='w-110 max-w-md card-soft p-6 space-y-4'>
          <h1 className='text-3xl font-bold'>Welcome back</h1>
          <p className='text-sm text-mutedForeground'>Sign in to continue tracking your nutrition.</p>

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

          <div>
            <label className='text-sm text-mutedForeground'>Email</label>
            <input className='mt-1 w-full rounded-xl border border-border px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary' placeholder='you@example.com' {...register('email')} />
            {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
          </div>

          <div>
            <label className='text-sm text-mutedForeground'>Password</label>
            <input className='mt-1 w-full rounded-xl border border-border px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary' type='password' placeholder='••••••••' {...register('password')} />
            {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
          </div>

          {(serverError || error) && <p className='text-red-600'>{serverError || error}</p>}

          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2'>
              <input type='checkbox' {...register('remember_me')} />
              <label className='text-sm text-mutedForeground'>remember me</label>
            </div>
            <Link href='/auth/password-reset-request' className='group text-mutedForeground transition duration-300 hover:text-primary'>
              Forgot password?
              <span className='block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary'></span>
            </Link>
          </div>

          <button className='w-full rounded-xl bg-primary text-primaryForeground py-3 hover:opacity-90 transition' disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <div className='w-full text-sm items-center justify-center flex text-mutedForeground'>
            New to Teja Wellness?
            <Link href='/auth/register' className='ml-1 group text-mutedForeground transition duration-300 hover:text-primary'>
              Register
              <span className='block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary'></span>
            </Link>
          </div>
        </form>
      </div>
    </GuestOnly>
  );
}
