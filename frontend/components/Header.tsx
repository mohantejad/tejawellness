'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { globalSearch } from '@/api/search';

type SearchResult = {
  ingredients: { id: number; name: string; image?: string | null }[];
  recipes: { id: number; title: string; image?: string | null }[];
  meal_plans: { id: number; title: string; image?: string | null }[];
  products: { id: number; name: string; image?: string | null; price?: string | number }[];
};

const NAV_ITEMS = [
  { label: 'Ingredients', href: '/ingredients' },
  { label: 'Recipes', href: '/recipes' },
  { label: 'Meal Plans', href: '/meal-plans' },
  { label: 'Products', href: '/products' },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
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
    <header className='sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-border px-4'>
      <div className='container-header h-20 flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-3'>
          <div className='h-12 w-12 rounded-full bg-primary text-primaryForeground flex items-center justify-center font-bold shadow-soft'>
            TW
          </div>
        </Link>

        <nav className='hidden lg:flex items-center gap-6 text-sm text-mutedForeground'>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className='group transition duration-300'>
              {item.label}
              <span className='block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-mutedForeground hover:text-primary decoration-2 decoration-mutedForeground'></span>
            </Link>
          ))}
        </nav>

        <div className='relative hidden md:block' ref={searchRef}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search keyword...'
            className='w-95 px-4 py-2 rounded-full bg-muted text-mutedForeground border border-primary focus:outline-none focus:ring-2 focus:ring-primary'
          />

          {openSearch && (results || loading) && (
            <div className='absolute mt-2 w-full rounded-xl border border-border bg-card shadow-soft p-3 z-50'>
              {loading && <div className='text-sm text-mutedForeground'>Searching…</div>}

              {!loading && results && (
                <div className='space-y-3'>
                  {results.ingredients.length > 0 && (
                    <div>
                      <div className='text-xs font-semibold text-mutedForeground mb-1'>Ingredients</div>
                      {results.ingredients.map((i) => (
                        <Link key={i.id} href={`/ingredients/${i.id}`} className='block text-sm hover:text-primary'>
                          {i.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {results.recipes.length > 0 && (
                    <div>
                      <div className='text-xs font-semibold text-mutedForeground mb-1'>Recipes</div>
                      {results.recipes.map((r) => (
                        <Link key={r.id} href={`/recipes/${r.id}`} className='block text-sm hover:text-primary'>
                          {r.title}
                        </Link>
                      ))}
                    </div>
                  )}

                  {results.products.length > 0 && (
                    <div>
                      <div className='text-xs font-semibold text-mutedForeground mb-1'>Products</div>
                      {results.products.map((p) => (
                        <Link key={p.id} href={`/products/${p.id}`} className='block text-sm hover:text-primary'>
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {results.meal_plans.length > 0 && (
                    <div>
                      <div className='text-xs font-semibold text-mutedForeground mb-1'>Meal Plans</div>
                      {results.meal_plans.map((m) => (
                        <Link key={m.id} href={`/meal-plans/${m.id}`} className='block text-sm hover:text-primary'>
                          {m.title}
                        </Link>
                      ))}
                    </div>
                  )}

                  {!results.ingredients.length &&
                    !results.recipes.length &&
                    !results.products.length &&
                    !results.meal_plans.length && (
                      <div className='text-sm text-mutedForeground'>No results.</div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className='flex items-center gap-3' ref={mobileRef}>
          {!user ? (
            <>
              <Link href='/auth/login' className='hidden lg:inline-flex px-4 py-2 rounded-full border border-border hover:bg-muted transition'>
                Login
              </Link>
              <Link href='/auth/register' className='hidden lg:inline-flex px-4 py-2 rounded-full bg-primary text-primaryForeground hover:opacity-90 transition'>
                Sign up
              </Link>
            </>
          ) : (
            <div className='relative' ref={menuRef}>
              <button
                onClick={() => setOpenMenu((v) => !v)}
                className='h-10 w-10 rounded-full bg-primary text-primaryForeground flex items-center justify-center font-semibold'
                aria-label='Open profile menu'
              >
                {user.email?.[0]?.toUpperCase() || 'U'}
              </button>

              {openMenu && (
                <div className='absolute right-0 mt-3 w-48 rounded-xl border border-border bg-card shadow-soft p-2 z-50'>
                  <Link href='/account' className='block px-3 py-2 rounded-lg hover:bg-muted transition'>
                    Account
                  </Link>
                  <Link href='/settings' className='block px-3 py-2 rounded-lg hover:bg-muted transition'>
                    Settings
                  </Link>
                  <button
                    onClick={onLogout}
                    className='w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <div className='flex lg:hidden'>
            <button
              onClick={() => setOpenMobile((v) => !v)}
              className='h-10 w-10 rounded-full border border-border flex items-center justify-center'
              aria-label='Open menu'
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>

            {openMobile && (
              <div className='absolute right-4 top-20 w-56 rounded-xl border border-border bg-card shadow-soft p-3 z-50'>
                <div className='space-y-2'>
                  {NAV_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} className='block text-sm hover:text-primary'>
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className='mt-3 border-t border-border pt-3 space-y-2'>
                  {!user ? (
                    <>
                      <Link href='/auth/login' className='block text-sm hover:text-primary'>
                        Login
                      </Link>
                      <Link href='/auth/register' className='block text-sm hover:text-primary'>
                        Sign up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href='/account' className='block text-sm hover:text-primary'>
                        Account
                      </Link>
                      <Link href='/settings' className='block text-sm hover:text-primary'>
                        Settings
                      </Link>
                      <button
                        onClick={onLogout}
                        className='w-full text-left text-sm hover:text-primary'
                      >
                        Logout
                      </button>
                    </>
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
