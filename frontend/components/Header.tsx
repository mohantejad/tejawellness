"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { globalSearch } from '@/api/search';
import { ChevronDown, Search, User, Menu, X, Sparkles, ShoppingBag, BookOpen } from 'lucide-react';

type SearchResult = {
  ingredients: { id: number; name: string; image?: string | null }[];
  recipes: { id: number; title: string; image?: string | null }[];
  meal_plans: { id: number; title: string; image?: string | null }[];
  products: { id: number; name: string; image?: string | null; price?: string | number }[];
};

const NAV_ITEMS = [
  { label: 'Skin Care', href: '/goals/skin-care', icon: <Sparkles size={14} className="text-primary/60" /> },
  { label: 'Hair Care', href: '/goals/hair-care', icon: <Sparkles size={14} className="text-accent/60" /> },
  { label: 'Ingredients', href: '/ingredients', icon: <BookOpen size={14} className="text-fg/60" /> },
];

const MORE_ITEMS = [
  { label: 'Healthy Recipes', href: '/recipes', description: 'Nourishing daily rituals' },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const [openMobile, setOpenMobile] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setOpenMore(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpenSearch(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setOpenMobile(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await globalSearch(query.trim());
        setResults(data);
        setOpenSearch(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  const onLogout = async () => {
    await dispatch(logout());
  };

  return (
    <header className='sticky top-0 z-50 bg-bg/85 backdrop-blur-xl border-b border-border px-4 transition-all duration-300'>
      <div className='container-header h-20 flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-3 group shrink-0'>
          <div className='h-11 w-11 rounded-full bg-primary flex items-center justify-center shadow-rose transition-all duration-500 group-hover:scale-105 group-hover:shadow-rose-lg'>
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M12 2C10 5 7 6 5 9c-2 3-1 7 2 9s7 2 9-1c1.5-1.5 2-3.5 1.5-5.5' stroke='white' strokeWidth='1.6' strokeLinecap='round' />
              <path d='M12 2c2 3 5 4 7 7 1 2 .5 4-1 5.5' stroke='white' strokeWidth='1.6' strokeLinecap='round' />
              <circle cx='12' cy='13' r='2.5' fill='white' opacity='0.85' />
              <path d='M12 15.5v4' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
          </div>
          <div className='hidden sm:block'>
            <h1 className='font-serif font-bold text-lg leading-tight text-fg tracking-tight'>Teja Wellness</h1>
            <p className='text-[10px] text-primary font-bold tracking-[0.2em] uppercase opacity-80'>Curated Rituals</p>
          </div>
        </Link>

        <nav className='hidden lg:flex items-center gap-12 text-[13px] font-bold uppercase tracking-widest text-mutedForeground'>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='group relative py-2 flex items-center gap-2 transition-colors duration-300 hover:text-fg'
            >
              {item.icon}
              {item.label}
              <span className='absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-full' />
            </Link>
          ))}

          <div className='relative' ref={moreRef}>
            <button
              onClick={() => setOpenMore(!openMore)}
              onMouseEnter={() => setOpenMore(true)}
              className={`flex items-center gap-1.5 py-2 transition-colors duration-300 hover:text-fg ${openMore ? 'text-fg' : ''}`}
            >
              More <ChevronDown size={14} className={`transition-transform duration-300 ${openMore ? 'rotate-180' : ''}`} />
            </button>

            {openMore && (
              <div
                onMouseLeave={() => setOpenMore(false)}
                className='absolute left-0 mt-2 w-64 rounded-[1.5rem] border border-border bg-white shadow-rose-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300'
              >
                {MORE_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className='flex flex-col gap-0.5 px-4 py-3 rounded-2xl hover:bg-surface transition-colors group'
                  >
                    <span className='text-xs font-bold text-fg group-hover:text-primary transition-colors'>{item.label}</span>
                    <span className='text-[10px] text-mutedForeground lowercase tracking-normal italic'>{item.description}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className='flex items-center gap-6'>
          <div className='relative hidden md:flex items-center' ref={searchRef}>
            <div className={`flex items-center transition-all duration-500 ease-out h-10 rounded-full bg-muted/30 border border-border/60 focus-within:bg-white focus-within:border-primary/20 focus-within:ring-4 focus-within:ring-primary/5 ${query || openSearch ? 'w-80' : 'w-10 hover:w-64 group'}`}>
              <div className="absolute left-3 text-mutedForeground pointer-events-none">
                <Search size={16} />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpenSearch(true)}
                placeholder='Search rituals...'
                className={`w-full h-full pl-10 pr-4 bg-transparent text-fg text-xs focus:outline-none transition-opacity duration-300 ${query || openSearch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              />
            </div>

            {openSearch && (results || loading) && (
              <div className='absolute right-0 top-full mt-3 w-80 rounded-[1.5rem] border border-border bg-white shadow-rose-lg p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300'>
                {loading && (
                  <div className='flex items-center gap-2 text-xs font-bold text-mutedForeground uppercase tracking-widest p-2'>
                    <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    Searching…
                  </div>
                )}

                {!loading && results && (
                  <div className='space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar'>
                    {results.ingredients.length > 0 && (
                      <div className="space-y-2">
                        <div className='text-[10px] font-bold text-primary uppercase tracking-[0.2em] px-2'>Ingredients</div>
                        {results.ingredients.map((i) => (
                          <Link key={i.id} href={`/ingredients/${i.id}`} className='flex items-center gap-3 p-2 rounded-xl hover:bg-surface transition-colors'>
                            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            <span className="text-xs font-medium text-fg">{i.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {results.recipes.length > 0 && (
                      <div className="space-y-2">
                        <div className='text-[10px] font-bold text-primary uppercase tracking-[0.2em] px-2'>Recipes</div>
                        {results.recipes.map((r) => (
                          <Link key={r.id} href={`/recipes/${r.id}`} className='flex items-center gap-3 p-2 rounded-xl hover:bg-surface transition-colors'>
                            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            <span className="text-xs font-medium text-fg">{r.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {!results.ingredients.length && !results.recipes.length && !results.products.length && !results.meal_plans.length && (
                      <div className='text-xs font-bold text-mutedForeground uppercase tracking-widest text-center py-4'>No results found.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='flex items-center gap-2' ref={mobileRef}>
            {!user ? (
              <div className='hidden sm:flex items-center gap-3'>
                <Link href='/auth/login' className='btn-outline text-xs font-bold uppercase tracking-widest text-mutedForeground hover:text-fg hover:bg-surface border border-border/60 rounded-full px-4 py-2 transition-all duration-300'>
                  Login
                </Link>
                <Link href='/auth/register' className='btn-primary text-[10px] uppercase tracking-[0.2em] py-2.5 px-6 shadow-rose'>
                  Register
                </Link>
              </div>
            ) : (
              <div className='relative' ref={menuRef}>
                <button
                  onClick={() => setOpenMenu((v) => !v)}
                  className='h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95'
                >
                  <User size={18} />
                </button>

                {openMenu && (
                  <div className='absolute right-0 mt-3 w-56 rounded-[1.5rem] border border-border bg-white shadow-rose-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300'>
                    <div className="px-4 py-3 border-b border-border/50 mb-1">
                      <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest">Signed in as</div>
                      <div className="text-xs font-bold text-fg truncate">{user.email}</div>
                    </div>
                    <Link href='/account' className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface text-xs font-bold text-fg transition-colors'>
                      Account
                    </Link>
                    <Link href='/settings' className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface text-xs font-bold text-fg transition-colors'>
                      Settings
                    </Link>
                    <button
                      onClick={onLogout}
                      className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-xs font-bold text-red-500 transition-colors'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setOpenMobile((v) => !v)}
              className='lg:hidden h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors'
            >
              {openMobile ? <X size={18} /> : <Menu size={18} />}
            </button>

            {openMobile && (
              <div className='fixed inset-x-4 top-24 rounded-[2rem] border border-border bg-white shadow-rose-2xl p-6 z-[100] animate-in fade-in zoom-in-95 duration-300 lg:hidden'>
                <div className='grid grid-cols-2 gap-4 pb-6 border-b border-border/50'>
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenMobile(false)}
                      className='flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface border border-transparent hover:border-primary/20 transition-all'
                    >
                      {item.icon}
                      <span className='text-[10px] font-bold uppercase tracking-widest'>{item.label}</span>
                    </Link>
                  ))}
                </div>

                <div className='py-6 space-y-4'>
                  <div className="text-[10px] font-bold text-mutedForeground uppercase tracking-widest px-2">Discovery</div>
                  <div className="grid grid-cols-1 gap-2">
                    {MORE_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                        className='flex items-center gap-4 p-3 rounded-xl hover:bg-surface transition-all'
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                          <BookOpen size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className='text-xs font-bold text-fg'>{item.label}</span>
                          <span className='text-[10px] text-mutedForeground lowercase tracking-normal'>{item.description}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className='pt-6 border-t border-border/50'>
                  {!user ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Link href='/auth/login' onClick={() => setOpenMobile(false)} className='text-center text-xs font-bold uppercase tracking-widest p-3 rounded-xl border border-border hover:bg-muted'>
                        Login
                      </Link>
                      <Link href='/auth/register' onClick={() => setOpenMobile(false)} className='btn-primary text-[10px] uppercase tracking-widest p-3 shadow-rose'>
                        Register
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href='/account' onClick={() => setOpenMobile(false)} className='block p-3 rounded-xl hover:bg-surface text-xs font-bold text-fg'>Account</Link>
                      <button onClick={() => { onLogout(); setOpenMobile(false); }} className='w-full text-left p-3 rounded-xl hover:bg-red-50 text-xs font-bold text-red-500'>Logout</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
