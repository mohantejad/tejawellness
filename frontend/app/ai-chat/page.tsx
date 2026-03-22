import ChatWidget from "@/components/ai/ChatWidget";
import { Sparkles, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AiChatPage() {
  return (
    <main className="container-page py-20 animate-in fade-in duration-1000">
      <header className="mb-20 space-y-6 max-w-3xl">
        <div className="flex items-center gap-3 text-primary">
          <MessageSquare size={24} />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em]">Neural Oracle</h2>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-fg tracking-tight leading-none">
          AI Wellness <span className="text-primary italic">Companion</span>
        </h1>
        <p className="text-xl text-mutedForeground font-serif italic">
          Consult our RAG-powered botanical intelligence for personalized wellness protocols and ingredient insights.
        </p>
      </header>
      
      <div className="card-soft p-12 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden bg-white/50 backdrop-blur-md border-none shadow-rose">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
         <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-10 border border-primary/20">
               <Sparkles size={40} className="text-primary animate-pulse" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-fg">Bridge the Gap between Data and Radiance</h3>
            <p className="text-mutedForeground leading-relaxed">
               Our companion is currently available via the widget in the bottom right corner of your screen for a seamless, persistent experience across your journey. 
            </p>
         </div>
      </div>
    </main>
  );
}
