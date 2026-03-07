import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-primary/10 bg-surface/70">
      {/* Subtle rose gradient line at top */}
      {/* <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, hsl(340 45% 42% / 0.3), hsl(36 80% 58% / 0.3), transparent)' }} /> */}

      <div className="container-page py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shadow-rose flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C10 5 7 6 5 9c-2 3-1 7 2 9s7 2 9-1c1.5-1.5 2-3.5 1.5-5.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M12 2c2 3 5 4 7 7 1 2 .5 4-1 5.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="12" cy="13" r="2.5" fill="white" opacity="0.85" />
                <path d="M12 15.5v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="font-serif font-bold text-fg">Teja Wellness</div>
          </div>
          <p className="text-sm text-mutedForeground leading-relaxed">
            Science-backed nutrition for radiant skin and healthy hair.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="font-semibold text-fg">Explore</div>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/ingredients">Ingredients</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/recipes">Recipes</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/products">Products</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/goals">Goals</Link>
        </div>

        <div className="space-y-2 text-sm">
          <div className="font-semibold text-fg">Account</div>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/auth/login">Login</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/auth/register">Sign Up</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/auth/password-reset">Reset Password</Link>
        </div>

        <div className="space-y-2 text-sm">
          <div className="font-semibold text-fg">Company</div>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/about">About</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/contact">Contact</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/ai-chat">AI Beauty Guide</Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page py-4 text-xs text-mutedForeground flex flex-col md:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Teja Wellness. All rights reserved.</div>
          <div className="flex gap-4">
            <Link className="hover:text-primary transition" href="/privacy">Privacy</Link>
            <Link className="hover:text-primary transition" href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

