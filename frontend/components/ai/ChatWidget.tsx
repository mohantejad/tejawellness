"use client";

import { useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { API_BASE } from "@/api/base";

type Reference = {
  label: string;
  href: string;
  badge?: string;
};

type Message = {
  role: "user" | "assistant";
  text: string;
  references?: Reference[];
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    text: "Hi! Ask me about ingredients, recipes, products, beauty tips, or anything wellness-related. I pull from Teja Wellness content to help.",
  },
];

export default function ChatWidget() {
  const { user } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/rag-chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question: userMessage.text }),
      });

      if (!res.ok) throw new Error("Unable to reach assistant");

      const payload = await res.json();
      const wantsLinks = /link|recommend|suggest|show|list/i.test(userMessage.text);
      const references: Reference[] =
        wantsLinks && Array.isArray(payload?.recommendations)
          ? payload.recommendations.map((rec: { type: string; id: number; title?: string }) => ({
              label: rec.title
                ? `${rec.title} (${rec.type.replace("_", " ")})`
                : `${rec.type.replace("_", " ")} #${rec.id}`,
              href:
                rec.type === "meal_plan"
                  ? `/meal-plans/${rec.id}`
                  : `/${rec.type}s/${rec.id}`,
              badge: "Recommended",
            }))
          : payload?.references ?? [];

      const assistantMessage: Message = {
        role: "assistant",
        text: payload.answer || "I couldn’t find a good match. Try asking in a different way.",
        references,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const latestReferences = useMemo(() => {
    const latest = [...messages].reverse().find((msg) => msg.references?.length);
    return latest?.references ?? [];
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="w-[320px] max-w-full rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between rounded-t-3xl bg-muted/80 px-4 py-3 text-sm font-semibold">
            <span>AI Wellness Companion</span>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-full border border-border px-3 py-1 text-xs text-mutedForeground"
            >
              Close
            </button>
          </div>
          {!user ? (
            <div className="px-4 py-6 text-sm text-mutedForeground space-y-3">
              <div>Login to access your personalized AI wellness guide.</div>
              <Link href="/auth/login" className="inline-block rounded-full bg-primary px-4 py-2 text-primaryForeground">
                Login
              </Link>
            </div>
          ) : (
          <>
          <div className="flex h-[320px] flex-col gap-3 overflow-y-auto px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-3 py-2 text-sm ${
                  message.role === "assistant"
                    ? "bg-muted/60 text-mutedForeground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <p className="font-semibold uppercase tracking-[0.3em] text-[10px]">
                  {message.role === "assistant" ? "Wellness Oracle" : "You"}
                </p>
                <p>{message.text}</p>
                {message.references?.length ? (
                  <div className="mt-2 space-y-2 text-xs text-mutedForeground">
                    {message.references.map((ref) => (
                      <a
                        key={ref.href}
                        href={ref.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-white/80 px-3 py-2 text-xs text-mutedForeground hover:border-primary hover:text-primary transition"
                      >
                        <span>{ref.label}</span>
                        {ref.badge && (
                          <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
                            {ref.badge}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {latestReferences.length ? (
            <div className="space-y-2 border-t border-border/70 px-4 py-3 text-xs text-mutedForeground">
              <div className="font-semibold uppercase tracking-[0.3em]">Latest references</div>
              {latestReferences.map((ref) => (
                <a
                  key={`ref-${ref.href}`}
                  href={ref.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-border/50 bg-white/70 px-3 py-2 hover:border-primary hover:text-primary transition"
                >
                  {ref.label}
                </a>
              ))}
            </div>
          ) : null}
          <div className="space-y-2 px-4 pb-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about fitness, beauty, recipes..."
              className="w-full rounded-full border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <button
              onClick={send}
              disabled={loading}
              className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primaryForeground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
          </>
          )}
        </div>
      ) : (
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primaryForeground shadow-2xl"
          onClick={() => setOpen(true)}
          aria-label="Open AI chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M4 6h16M4 6c-1.104 0-2 .896-2 2v8c0 1.104.896 2 2 2h4l4 4 4-4h4c1.104 0 2-.896 2-2V8c0-1.104-.896-2-2-2H4z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
