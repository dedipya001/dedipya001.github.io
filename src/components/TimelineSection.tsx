import React from 'react';
import { Milestone, Calendar, Flag } from 'lucide-react';

interface Event {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'edu' | 'work' | 'leadership' | 'future';
}

const JOURNEY_EVENTS: Event[] = [
  {
    year: "2025 - Present",
    title: "AI & Backend Developer",
    subtitle: "Selegic Inc",
    description: "Designing advanced vector databases, Broker Layers, MCP servers, and RAG pipelines for article automation and CPQ systems.",
    type: "work"
  },
  {
    year: "2024 - 2025",
    title: "DevOps Engineer Intern",
    subtitle: "Belzabar Software Design",
    description: "Automated CI/CD pipelines and infrastructure provisioning using Terraform, Python, and Bash, accelerating releases by 22%.",
    type: "work"
  },
  {
    year: "2022",
    title: "IndustrialOts Core",
    subtitle: "Tech Club Leadership",
    description: "Coordinated developer outreach meetups, coding labs, and regional hackathons with student teams.",
    type: "leadership"
  },
  {
    year: "2026+",
    title: "Distributed Systems & LLM Agents",
    subtitle: "Future Targets",
    description: "Aims to specialize in low-latency concurrent systems, distributed database sharding, and multi-agent consensus algorithms.",
    type: "future"
  }
];

export const TimelineSection: React.FC = () => {
  return (
    <section id="timeline" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
      <div className="mb-12">
        <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
          Journey Timeline <span className="text-neuralMagenta">.</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
          Synaptic Path Milestones
        </p>
      </div>

      <div className="relative border-l border-white/5 ml-4 pl-8 space-y-12">
        {JOURNEY_EVENTS.map((event, idx) => (
          <div key={idx} className="relative group">
            
            {/* Pulsing indicator */}
            <span className="absolute -left-[41px] top-1.5 flex h-5 w-5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                event.type === 'future' ? 'bg-neuralMagenta' : 'bg-neuralPurple'
              }`} />
              <span className={`relative inline-flex rounded-full h-5 w-5 border border-bgMain items-center justify-center text-[9px] font-bold text-white ${
                event.type === 'future' ? 'bg-neuralMagenta' : 'bg-neuralPurple'
              }`}>
                {event.type === 'future' ? <Flag className="w-2.5 h-2.5" /> : <Milestone className="w-2.5 h-2.5" />}
              </span>
            </span>

            {/* Milestone Card */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
              <span className="flex items-center gap-1.5 text-xs text-neuralMagenta font-mono mb-2">
                <Calendar className="w-3.5 h-3.5" />
                {event.year}
              </span>
              <h3 className="font-grotesk font-bold text-lg text-white">
                {event.title}
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                {event.subtitle}
              </p>
              <p className="text-zinc-300 font-sans text-sm mt-3 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
