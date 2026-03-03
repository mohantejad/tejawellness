"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

export default function PersonalizedGate() {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);

  const handleLockedClick = () => {
    toast.error("Please login to get it");
    router.push("/auth/login");
  };

  if (!user) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={handleLockedClick} className="card-soft p-5 text-left">
          <div className="text-sm text-mutedForeground">Personalized wellness</div>
          <div className="text-2xl font-semibold mt-2">Built for your goals</div>
        </button>
        <button onClick={handleLockedClick} className="card-soft p-5 text-left">
          <div className="text-sm text-mutedForeground">Expert‑backed</div>
          <div className="text-2xl font-semibold mt-2">Nutrition + lifestyle</div>
        </button>
        <button onClick={handleLockedClick} className="card-soft p-5 text-left">
          <div className="text-sm text-mutedForeground">Guided plans</div>
          <div className="text-2xl font-semibold mt-2">Simple to follow</div>
        </button>
      </section>
    );
  }

  // Placeholder for real personalized items when logged in
  return (
    <section className="card-soft p-5">
      <div className="text-sm text-mutedForeground">For you</div>
      <div className="text-2xl font-semibold mt-2">
        Personalized picks coming next
      </div>
    </section>
  );
}
