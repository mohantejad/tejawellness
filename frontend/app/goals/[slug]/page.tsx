import Image from "next/image";
import Link from "next/link";
import { fetchGoalBySlug } from "@/api/goals";
import { Sparkles, ChevronLeft } from "lucide-react";
import GoalSanctuaryClient from "@/components/goals/GoalSanctuaryClient";

export const dynamic = "force-dynamic";

export default async function GoalLandingPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const goal = await fetchGoalBySlug(slug);

    if (!goal) return null;

    const title = goal.name;
    const description = goal.description || "A bespoke ritual curated for your unique wellness journey.";

    return (
        <main className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="relative h-[55vh] w-full overflow-hidden flex items-center justify-center">
                {goal.image_url ? (
                    <Image
                        src={goal.image_url}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-surface-dark/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="absolute top-12 left-12 z-20">
                    <Link href="/goals" className="group flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-mutedForeground hover:text-fg transition-colors">
                        <div className="h-10 w-10 rounded-full border border-fg/20 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ChevronLeft size={16} />
                        </div>
                        Back to Sanctuary
                    </Link>
                </div>

                <div className="max-w-2xl animate-in slide-in-from-bottom-8 duration-700 delay-200">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.5em] mb-4">Goal Identification</p>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-fg leading-[0.9] tracking-tighter mb-8">
                        {goal.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-mutedForeground font-serif italic leading-relaxed">
                        &quot;The botanical synergy of science &amp; ritual.&quot;
                    </p>
                </div>
            </section>

            {/* Dynamic Sanctuary Discovery */}
            <GoalSanctuaryClient goal={goal} />

            {/* Aesthetic Footer/Divider */}
            <section className="py-24 text-center">
                <div className="max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="mt-12 opacity-30">
                    <Sparkles size={40} className="mx-auto text-primary" />
                </div>
            </section>
        </main>
    );
}
