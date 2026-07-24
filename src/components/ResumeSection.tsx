import React from 'react';
import { FileText, Download, Sparkles, Brain, Award, Star } from 'lucide-react';

export const ResumeSection: React.FC = () => {
  return (
    <section id="resume" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
      <div className="mb-12">
        <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
          Knowledge Snapshot <span className="text-neuralMagenta">.</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
          Memory Index & Snapshot
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Summary & Actions */}
        <div className="space-y-6">
          
          {/* Resume Abstract */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-neuralPurple/10 to-transparent relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-neuralPurple animate-pulse" />
              <h3 className="font-grotesk font-bold text-xs uppercase tracking-widest text-white">Memory Synthesis</h3>
            </div>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              Dedipya Goswami is a specialized **AI & Backend Software Engineer** with a solid foundation in Retrieval-Augmented Generation (RAG), Model Context Protocol (MCP) servers, and low-latency API architectures. Highly experienced in building secure LLM interfaces, automating CI/CD pipelines, and designing FastAPI and MEAN stack microservices.
            </p>
          </div>

          {/* Download Button */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 text-center">
            <FileText className="w-10 h-10 text-neuralMagenta mx-auto mb-4" />
            <h3 className="font-grotesk font-bold text-sm text-white mb-1">Standard CV Profile</h3>
            <p className="text-zinc-500 font-sans text-xs mb-6">PDF format • 142 KB</p>
            
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Exporting Dedipya Goswami Knowledge Snapshot (.pdf)...'); }}
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-br from-neuralPurple to-neuralMagenta text-white text-xs font-grotesk font-bold tracking-wide shadow-neural-glow hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Knowledge Snapshot (.pdf)
            </a>
          </div>
        </div>

        {/* Right Side: Interactive Resume Preview */}
        <div className="md:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 relative bg-[#0A0816]/60 overflow-y-auto max-h-[500px]">
          <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6">
            <div>
              <h3 className="font-grotesk font-bold text-xl text-white">Dedipya Goswami</h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">AI & Backend Software Engineer • AP, India</p>
            </div>
            <span className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] px-2.5 py-1 rounded-full font-mono">
              <Star className="w-3 h-3 text-green-400" />
              Open to Roles
            </span>
          </div>

          {/* Experience in Resume Preview */}
          <div className="space-y-6">
            <div>
              <h4 className="font-grotesk font-bold text-xs uppercase tracking-widest text-zinc-500 mb-3">Professional Experience</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-sans">
                    <strong className="text-white">Backend Developer</strong>
                    <span className="text-zinc-400 font-mono text-xs">Oct 2025 - Present</span>
                  </div>
                  <span className="text-xs text-neuralPurple font-semibold">Selegic India Pvt. Ltd.</span>
                  <p className="text-zinc-400 text-xs font-sans mt-1.5 leading-relaxed">
                    Developing backend services and AI capabilities for Encye SaaS platform, building Model Context Protocol (MCP) servers, and deploying RAG Salesforce CPQ Assistants.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-sans">
                    <strong className="text-white">DevOps Engineer Intern</strong>
                    <span className="text-zinc-400 font-mono text-xs">Sept 2024 - Jun 2025</span>
                  </div>
                  <span className="text-xs text-neuralMagenta font-semibold">Belzabar Software Design Pvt. Ltd.</span>
                  <p className="text-zinc-400 text-xs font-sans mt-1.5 leading-relaxed">
                    Automated CI/CD pipelines using Terraform and Bash. Built AI DevOps assistants leveraging RAG to retrieve environment metadata from infrastructure.
                  </p>
                </div>
              </div>
            </div>

            {/* Education in Resume Preview */}
            <div className="border-t border-white/5 pt-6">
              <h4 className="font-grotesk font-bold text-xs uppercase tracking-widest text-zinc-500 mb-3">Academic Foundation</h4>
              <div className="flex justify-between text-sm font-sans">
                <strong className="text-white">B.Tech in Computer Science & Engineering</strong>
                <span className="text-zinc-400 font-mono text-xs">2021 - 2025</span>
              </div>
              <span className="text-xs text-neuralMagenta font-semibold">SRM University AP</span>
              <p className="text-zinc-400 text-xs font-sans mt-1">Cumulative CGPA: 8.83/10 (100% Scholarship)</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
