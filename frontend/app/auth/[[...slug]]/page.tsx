'use client';

import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import GuestOnly from '@/components/auth/GuestOnly';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login, register as registerAction, clearAuthError, fetchMe } from '@/redux/slices/authSlice';
import { getErrorMessage } from '@/utils/errors';
import { getGoogleAuthUrl, activateAccount, googleLogin } from '@/api/auth';

// --- SCHEMAS ---
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  remember_me: z.boolean().optional(),
});

const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  re_password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  accept_terms: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
}).refine((data) => data.password === data.re_password, {
  message: 'Passwords do not match',
  path: ['re_password'],
});

// --- COMPONENTS ---

function LoginPage() {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((s) => s.auth);

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setServerError('');
    try {
      await dispatch(login({ email: data.email, password: data.password, remember_me: Boolean(data.remember_me) })).unwrap();
      toast.success('Welcome back!');
      router.push('/');
    } catch (err) {
      setServerError(getErrorMessage(err, 'Login failed'));
    }
  };

  const onGoogle = async () => {
     const data = await getGoogleAuthUrl(window.location.origin + '/auth/google');
     if (data?.authorization_url) window.location.href = data.authorization_url;
  };

  return (
    <GuestOnly>
      <div className='min-h-[70vh] flex items-center justify-center p-4'>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-md card-soft p-8 space-y-6 bg-white/80 backdrop-blur-lg border-none shadow-rose-lg'>
          <div className="space-y-2">
            <h1 className='text-4xl font-serif font-bold text-fg tracking-tight'>Welcome back</h1>
            <p className='text-sm text-mutedForeground font-serif italic'>Continue your wellness journey.</p>
          </div>

          <button type='button' onClick={onGoogle} className='w-full rounded-2xl border border-border/60 py-4 hover:bg-surface transition flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest'>
            Continue with Google
          </button>

          <div className='flex items-center gap-3 text-[10px] font-bold text-mutedForeground uppercase tracking-widest'>
            <span className='h-px w-full bg-border/40' />
            <span>or</span>
            <span className='h-px w-full bg-border/40' />
          </div>

          <div className="space-y-4">
            <div>
              <label className='text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1'>Email</label>
              <input className='mt-1.5 w-full rounded-2xl border border-border/50 px-5 py-4 bg-white/50 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all' placeholder='you@example.com' {...register('email')} />
              {errors.email && <p className='mt-1 text-xs text-red-500 ml-1 font-medium'>{errors.email.message}</p>}
            </div>

            <div>
              <label className='text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1'>Password</label>
              <input className='mt-1.5 w-full rounded-2xl border border-border/50 px-5 py-4 bg-white/50 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all' type='password' placeholder='••••••••' {...register('password')} />
              {errors.password && <p className='mt-1 text-xs text-red-500 ml-1 font-medium'>{errors.password.message}</p>}
            </div>
          </div>

          {(serverError || error) && <p className='text-xs text-red-500 font-bold bg-red-50 p-3 rounded-xl border border-red-100'>{serverError || error}</p>}

          <div className='flex items-center justify-between text-xs font-bold'>
            <div className='flex items-center gap-2'>
              <input type='checkbox' {...register('remember_me')} className="rounded border-border text-primary focus:ring-primary" />
              <label className='text-mutedForeground uppercase tracking-widest text-[9px]'>Remember me</label>
            </div>
            <Link href='/auth/password-reset-request' className='text-primary hover:opacity-70 transition'>Forgot password?</Link>
          </div>

          <button className='w-full rounded-2xl bg-primary text-white py-4 shadow-rose hover:shadow-rose-lg hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-50' disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </button>

          <div className='w-full text-xs font-bold items-center justify-center flex gap-2 text-mutedForeground uppercase tracking-widest'>
            New to Teja Wellness?
            <Link href='/auth/register' className='text-primary hover:opacity-70 transition'>Register</Link>
          </div>
        </form>
      </div>
    </GuestOnly>
  );
}

function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      await dispatch(registerAction(data)).unwrap();
      toast.success('Account created! Please check your email to activate.');
      router.push('/auth/login');
    } catch (err) {
      setServerError(getErrorMessage(err, 'Signup failed'));
    }
  };

  return (
    <div className='min-h-[70vh] flex items-center justify-center p-4'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-md card-soft p-8 space-y-6 bg-white/80 backdrop-blur-lg border-none shadow-rose-lg'>
        <div className="space-y-2">
            <h1 className='text-4xl font-serif font-bold text-fg tracking-tight'>Create account</h1>
            <p className='text-sm text-mutedForeground font-serif italic'>Begin your bespoke wellness path.</p>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1'>First name</label>
            <input className='mt-1.5 w-full rounded-2xl border border-border/50 px-5 py-4 bg-white/50 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all' placeholder='First' {...register('first_name')} />
            {errors.first_name && <p className='mt-1 text-xs text-red-500 ml-1 font-medium'>{errors.first_name.message}</p>}
          </div>
          <div>
            <label className='text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1'>Last name</label>
            <input className='mt-1.5 w-full rounded-2xl border border-border/50 px-5 py-4 bg-white/50 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all' placeholder='Last' {...register('last_name')} />
            {errors.last_name && <p className='mt-1 text-xs text-red-500 ml-1 font-medium'>{errors.last_name.message}</p>}
          </div>
        </div>

        <div>
          <label className='text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1'>Email</label>
          <input className='mt-1.5 w-full rounded-2xl border border-border/50 px-5 py-4 bg-white/50 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all' placeholder='you@example.com' {...register('email')} />
          {errors.email && <p className='mt-1 text-xs text-red-500 ml-1 font-medium'>{errors.email.message}</p>}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1'>Password</label>
            <input className='mt-1.5 w-full rounded-2xl border border-border/50 px-5 py-4 bg-white/50 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all' type='password' placeholder='••••••••' {...register('password')} />
          </div>
          <div>
            <label className='text-[10px] font-bold text-mutedForeground uppercase tracking-widest ml-1'>Confirm</label>
            <input className='mt-1.5 w-full rounded-2xl border border-border/50 px-5 py-4 bg-white/50 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all' type='password' placeholder='••••••••' {...register('re_password')} />
          </div>
        </div>
        {(errors.password || errors.re_password) && <p className='text-xs text-red-500 font-medium ml-1'>{errors.password?.message || errors.re_password?.message}</p>}
        {serverError && <p className='text-xs text-red-500 font-bold bg-red-50 p-3 rounded-xl border border-red-100'>{serverError}</p>}

        <div className='flex items-start gap-3 p-1'>
          <input type='checkbox' {...register('accept_terms')} className="mt-1 rounded border-border text-primary focus:ring-primary" />
          <label className='text-[10px] font-bold text-mutedForeground uppercase tracking-[0.1em] leading-relaxed'>I agree to the Terms of Service and botanical privacy protocols.</label>
        </div>
        {errors.accept_terms && <p className='text-xs text-red-500 font-medium ml-1'>{errors.accept_terms.message}</p>}

        <button className='w-full rounded-2xl bg-primary text-white py-4 shadow-rose hover:shadow-rose-lg hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-50' disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Register'}
        </button>

        <div className='w-full text-xs font-bold items-center justify-center flex gap-2 text-mutedForeground uppercase tracking-widest'>
          Already have an account?
          <Link href='/auth/login' className='text-primary hover:opacity-70 transition'>Login</Link>
        </div>
      </form>
    </div>
  );
}

function ActivatePage() {
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
    } catch (err) {
      toast.error('Activation failed', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4 font-serif'>
      <div className='card-soft p-10 max-w-md w-full space-y-6 text-center shadow-rose'>
        <h1 className='text-3xl font-bold text-fg'>Activate Ritual</h1>
        {done ? (
          <p className='text-mutedForeground italic'>Your account is active. Redirecting to login...</p>
        ) : (
          <>
            <p className='text-mutedForeground italic'>Complete your initiation into our botanical wellness community.</p>
            <button className='w-full rounded-2xl bg-primary text-white py-4 shadow-rose hover:shadow-rose-lg transition-all text-xs font-bold uppercase tracking-widest' onClick={onActivate} disabled={loading || !uid || !token}>
              {loading ? 'Activating...' : 'Activate Account'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function GoogleCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state) return;

    googleLogin({ code, state, redirect_uri: window.location.origin + '/auth/google' })
      .then(async () => {
        await dispatch(fetchMe());
        toast.success("Logged in with Google");
        router.replace("/");
      })
      .catch((e) => setError(e?.message || "Google login failed"));
  }, [params, dispatch, router]);

  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4 font-serif'>
      <div className='card-soft p-10 max-w-md w-full text-center space-y-4 shadow-rose'>
        <h1 className='text-3xl font-bold text-fg'>Google Synchronization</h1>
        {!error ? (
          <div className="flex flex-col items-center gap-4">
             <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
             <p className='text-mutedForeground italic'>Aligning your botanical identity...</p>
          </div>
        ) : (
          <p className='text-red-500 font-bold'>{error}</p>
        )}
      </div>
    </div>
  );
}

// --- MAIN WRAPPER ---
export default function AuthCatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const [slug, setSlug] = useState<string[]>([]);

  useEffect(() => {
    params.then(p => setSlug(p.slug || []));
  }, [params]);

  const type = slug[0] || 'login';

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary font-serif">Teja Wellness...</div></div>}>
      {type === 'login' && <LoginPage />}
      {type === 'register' && <RegisterPage />}
      {type === 'activate' && <ActivatePage />}
      {type === 'google' && <GoogleCallbackPage />}
    </Suspense>
  );
}
