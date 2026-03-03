import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card/70 pt-4">
      <div className="container-page py-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary text-primaryForeground flex items-center justify-center font-bold shadow-soft">
              TW
            </div>
            <div className="font-semibold">Teja Wellness</div>
          </div>
          <p className="text-sm text-mutedForeground">
            Wellness, beauty, fitness, and nutrition guidance in one place.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="font-semibold">Explore</div>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/explore">Explore</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/recipes">Recipes</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/beauty">Beauty</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/fitness">Fitness</Link>
        </div>

        <div className="space-y-2 text-sm  pb-8">
          <div className="font-semibold">Resources</div>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/password-reset">Reset Password</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/set-password">Account Settings</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/resend-activation">Resend Activation</Link>
        </div>

        <div className="space-y-2 text-sm ">
          <div className="font-semibold">Company</div>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/about">About</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/contact">Contact</Link>
          <Link className="block text-mutedForeground hover:text-primary transition" href="/shop">Shop</Link>
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
