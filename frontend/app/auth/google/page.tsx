"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { googleLogin } from "@/api/auth";
import { useAppDispatch } from "@/redux/hooks";
import { fetchMe } from "@/redux/slices/authSlice";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

export default function GoogleCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state) return;

    const redirect_uri =
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "http://localhost:3000/auth/google";

    googleLogin({ code, state, redirect_uri })
      .then(async () => {
        await dispatch(fetchMe());
        toast.success("Logged in with Google");
        router.replace("/");
      })
      .catch((e) => {
        setError(e?.message || "Google login failed");
      });
  }, [params, dispatch, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card-soft p-6 max-w-md w-full space-y-2">
        <h1 className="text-2xl font-bold">Google login</h1>
        {!error ? (
          <p className="text-sm text-mutedForeground">Signing you in...</p>
        ) : (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
