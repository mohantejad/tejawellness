import PersonalizedGate from "@/components/home/PersonalizedGate";
import RecommendedRow from "@/components/home/RecommendedRow";
import { fetchGoals } from "@/api/goals";
import type { Goal } from "@/types/goals";
import type { PaginatedResponse } from "@/types/api";
import HeroCarousel from "@/components/home/HeroCarousel";
import GoalsSection from "@/components/home/GoalsSections";

export default async function HomePage() {
  const data: PaginatedResponse<Goal> = await fetchGoals(1);
  const goals = data.results || [];

  return (
    <div className="space-y-12">
      <section>
        <HeroCarousel />
      </section>

      <PersonalizedGate />

      <RecommendedRow />

      <GoalsSection goals={goals} totalCount={data.count || goals.length} initialPage={1} />
    </div>
  );
}
