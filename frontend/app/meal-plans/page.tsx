import { fetchMealPlans } from "@/api/meal-plans";
import { Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE } from "@/api/base";

export const dynamic = "force-dynamic";

export default async function MealPlansPage() {
  const plans = await fetchMealPlans();

  return (
    <main className="container-page py-20 animate-in fade-in duration-1000">
      <header className="mb-20 space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Calendar size={24} />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em]">Structured Rituals</h2>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-fg tracking-tight leading-none">
          Guided <span className="text-primary italic">Journeys</span>
        </h1>
        <p className="text-xl text-mutedForeground max-w-2xl font-serif italic">
          Multi-day protocols designed to reset your biology and elevate your daily wellness routine.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {plans.map((plan: any) => {
          const image = plan.primary_image ? (plan.primary_image.startsWith('http') ? plan.primary_image : `${API_BASE}${plan.primary_image}`) : undefined;
          return (
            <Link key={plan.id} href={`/meal-plans/${plan.id}`} className="card-soft group overflow-hidden border-none shadow-rose">
              <div className="relative h-64 overflow-hidden">
                {image && <Image src={image} alt={plan.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-8">
                  <h3 className="text-3xl font-serif font-bold text-white mb-2">{plan.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="badge-pill bg-white/20 backdrop-blur-md text-white border-none uppercase text-[8px] tracking-widest">{plan.days_count} Days protocol</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
