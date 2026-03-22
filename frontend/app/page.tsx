import PersonalizedGate from "@/components/home/PersonalizedGate";
import RecommendedRow from "@/components/home/RecommendedRow";
import { fetchGoals } from "@/api/goals";
import type { Goal } from "@/types/goals";
import type { PaginatedResponse } from "@/types/api";
import HeroCarousel from "@/components/home/HeroCarousel";
import GoalsSection from "@/components/home/GoalsSections";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const data: PaginatedResponse<Goal> = await fetchGoals(1);
  const goals = data.results || [];

  return (
    <main className="space-y-24 pb-24 animate-in fade-in duration-1000">
      {/* Hero Experience */}
      <section className="relative">
        <HeroCarousel />
      </section>

      {/* Personalized Discovery */}
      <section className="container-page">
        <div className="space-y-8">
          <PersonalizedGate />
          <RecommendedRow />
        </div>
      </section>

      {/* Curated Goals */}
      <section className="container-page">
        <GoalsSection goals={goals} totalCount={data.count || goals.length} initialPage={1} />
      </section>

      {/* Botanical Philosophy / Brand Statement (Optional future addition) */}
      <section className="container-page py-12 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif font-bold text-fg">Modern Rituals. Ancient Wisdom.</h2>
          <p className="text-mutedForeground leading-relaxed italic font-serif">
            "Your journey to radiant skin and healthy hair begins with the science of nourishment. We curate every ritual with intention, blending botanical research with modern wellness."
          </p>
          <div className="flex justify-center">
            <div className="h-0.5 w-12 bg-primary/20 rounded-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
