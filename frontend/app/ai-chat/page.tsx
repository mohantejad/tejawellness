"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
  references?: { label: string; href: string; badge?: string }[];
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    text: "Hey there! I can help you explore ingredients, recipes, products, and beauty tips from Teja Wellness. Ask me anything!",
  },
];

export default function AiChatPage() {
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
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text }),
      });

      if (!res.ok) {
        throw new Error("Unable to reach the AI guide right now.");
      }

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        text: data.answer,
        references: data.references,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-page space-y-6 pb-10">
      <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div>
          <p className="text-sm text-mutedForeground uppercase tracking-[0.3em]">
            AI Wellness Companion
          </p>
          <h1 className="text-3xl font-semibold">Ask about ingredients, nutrition, skin, or beauty.</h1>
          <p className="text-mutedForeground">
            I tie your question into the latest Teja Wellness content and recommendations.
          </p>
        </div>

        <div className="flex max-h-[420px] flex-col gap-4 overflow-y-auto px-1">
          {messages.map((message, idx) => (
            <div
              key={`${message.role}-${idx}`}
              className={`space-y-2 rounded-2xl p-4 ${
                message.role === "assistant"
                  ? "bg-muted/50 text-mutedForeground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <div className="font-semibold text-xs uppercase tracking-wider">
                {message.role === "assistant" ? "Wellness Oracle" : "You"}
              </div>
              <p>{message.text}</p>
              {message.references?.length ? (
                <div className="space-y-1 text-xs text-mutedForeground">
                  <div className="font-semibold text-[10px] uppercase tracking-[0.3em]">
                    Resources
                  </div>
                  {message.references.map((ref) => (
                    <a
                      key={ref.href}
                      href={ref.href}
                      className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-white/70 px-3 py-2 text-sm text-mutedForeground hover:border-primary hover:text-primary transition"
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

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.4em] text-mutedForeground">
            Ask Teja Wellness
          </label>
          <div className="flex gap-3">
            <input
              className="flex-1 rounded-full border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Eg., Ingredients that help with glowing skin?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              disabled={loading}
              onClick={send}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primaryForeground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Thinking…" : "Send"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
