import React from 'react';
import { BookOpen, Compass, Lightbulb, FileText, CheckCircle2 } from 'lucide-react';

export const ResearchSection: React.FC = () => {
  const currentLearning = [
    { area: "Distributed Consensus", details: "Studying Raft and Paxos consensus structures to understand multi-node database replica agreements." },
    { area: "Chunking Optimizations", details: "Experimenting with semantic layout parser chunking instead of raw sentence dividers for RAG." },
    { area: "Rust Backend Microservices", details: "Evaluating Rust (Actix-web) performance improvements over Python (FastAPI) for simple auth routers." }
  ];

  return (
    <section id="research" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
      <div className="mb-12">
        <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
          Research & Learning <span className="text-neuralPurple">.</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
          Active Engineering Logbook
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Logbook Card */}
        <div className="md:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 relative bg-gradient-to-b from-[#0B1120] to-[#050816]">
          {/* Notebook line style helper */}
          <div className="absolute left-6 top-6 bottom-6 w-[1.5px] bg-red-900/25 pointer-events-none" />

          <div className="pl-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <BookOpen className="w-5 h-5 text-neuralPurple" />
              <h3 className="font-mono text-sm font-bold text-zinc-100">ENGINEERING_NOTES_LOG.md</h3>
            </div>

            <div className="space-y-6 font-sans text-sm text-zinc-300">
              <div>
                <span className="font-mono text-xs text-zinc-500">// ENTRY DATE: JULY 2026</span>
                <h4 className="font-grotesk font-bold text-base text-white mt-1 mb-2">Subject: Cosine Vector Overlaps & Cache Routing</h4>
                <p className="leading-relaxed">
                  Caching LLM prompts is critical when scaling. When a user queries our server, we extract keywords, run a quick dot-product overlap matrix on local nodes, and route the request to previous prompt logs if cosine similarity exceeds 0.94. This reduces external API calls significantly.
                </p>
              </div>

              <div>
                <span className="font-mono text-xs text-zinc-500">// STUDY LOG: SYSTEMS ENGINE</span>
                <h4 className="font-grotesk font-bold text-base text-white mt-1 mb-2">Subject: Designing compound indexing strategies</h4>
                <p className="leading-relaxed">
                  Profiling Selegic Inc MongoDB databases showed single indexes are insufficient for query pipelines filtering both category and timestamps. Added compound indexes, resulting in a 30% reduction in query wait time and overall API response speeds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Roads sidebar */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <h3 className="font-grotesk font-bold text-base text-white mb-4 flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-neuralMagenta" />
              Active Research Areas
            </h3>

            <div className="space-y-4">
              {currentLearning.map((item, idx) => (
                <div key={idx} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <h4 className="font-grotesk font-bold text-xs text-white">{item.area}</h4>
                  <p className="font-sans text-xs text-zinc-400 mt-1 leading-relaxed">{item.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <h3 className="font-grotesk font-bold text-base text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-4.5 h-4.5 text-green-400" />
              Completed Studies
            </h3>

            <div className="space-y-2.5 font-sans text-xs text-zinc-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>LangChain Prompt Optimization</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>Docker multi-stage compilation profiles</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>AJV middleware integration schemas</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
