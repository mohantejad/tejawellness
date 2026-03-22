"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { Sparkles, Heart, Zap } from "lucide-react";

export default function PersonalizedGate() {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);

  const handleLockedClick = () => {
    toast.info("Login to unlock your personalized beauty & wellness routine.");
    router.push("/auth/login");
  };

  if (!user) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <button
          onClick={handleLockedClick}
          className="card-soft p-10 text-left group hover:bg-surface transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
            <Sparkles size={22} />
          </div>
          <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Bespoke Radiance</div>
          <div className="text-2xl font-serif font-bold text-fg mt-3 leading-tight">Tailored to your unique biology</div>
        </button>

        <button
          onClick={handleLockedClick}
          className="card-soft p-10 text-left group hover:bg-surface transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
        >
          <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
            <Zap size={22} />
          </div>
          <div className="text-[10px] font-bold text-accent uppercase tracking-[0.3em]">Expert Rituals</div>
          <div className="text-2xl font-serif font-bold text-fg mt-3 leading-tight">Clinical science meets botanical wisdom</div>
        </button>

        <button
          onClick={handleLockedClick}
          className="card-soft p-10 text-left group hover:bg-surface transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
            <Heart size={22} />
          </div>
          <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Curated Habits</div>
          <div className="text-2xl font-serif font-bold text-fg mt-3 leading-tight">Elevating your daily self-care journey</div>
        </button>
      </section>
    );
  }

  const firstName = user.email?.split('@')[0] || 'Seeker';

  return (
    <section className="card-soft p-12 bg-gradient-hero border-none shadow-rose-lg overflow-hidden relative group animate-in fade-in duration-1000">
      <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 transition-transform duration-1000 group-hover:rotate-45">
        <Sparkles size={120} />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">The Radiance Protocol</div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-fg leading-tight">
            Welcome back, <span className="text-primary italic">{firstName}</span>. Your bespoke selections are being curated.
          </h2>
          <p className="text-mutedForeground mt-4 text-lg font-serif italic max-w-lg">
            &quot;Every ritual we design is a step towards your most vibrant self. We&apos;re currently tailoring your journey based on your latest preferences.&quot;
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 w-16 rounded-full border-4 border-white bg-surface-dark/5 shadow-soft flex items-center justify-center animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <Sparkles size={16} className="text-primary/10" />
              </div>
            ))}
          </div>
          <div className="h-12 w-12 rounded-full bg-white/50 backdrop-blur-sm border border-border flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer">
            <Zap size={18} />
          </div>
        </div>
      </div>
    </section>
  );
}
