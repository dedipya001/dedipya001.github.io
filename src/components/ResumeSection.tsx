import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  FileText, Download, Sparkles, Brain, Award, Star, Briefcase, 
  GraduationCap, Cpu, Code2, Users, CheckCircle2, Mail, Phone, 
  Linkedin, Github, ExternalLink, Terminal, ShieldCheck
} from 'lucide-react';

export const ResumeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'projects' | 'education'>('experience');

  const handleExport = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981']
      });
    } catch (err) {}

    // Open print preview for saving clean PDF snapshot
    window.print();
  };

  return (
    <section id="resume" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
      
      {/* Section Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-pink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              Verified Engineering Resume
            </span>
          </div>
          <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Knowledge Snapshot <span className="text-neuralMagenta">.</span>
          </h2>
          <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold mt-1">
            Official Curriculum Vitae & Memory Synthesis
          </p>
        </div>

        {/* Quick Export Button */}
        <button 
          onClick={handleExport}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neuralPurple via-pink-500 to-neuralMagenta text-white text-xs font-grotesk font-bold tracking-wide shadow-neural-glow hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Knowledge Snapshot (.pdf)</span>
        </button>
      </div>

      {/* Main Grid: Left Synthesis & Quick Metrics | Right Interactive Document */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (4 cols): Profile Abstract & Key Metrics */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Executive Summary Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 bg-gradient-to-br from-neuralPurple/15 via-[#0A0816] to-neuralMagenta/10 relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-neuralPurple/20 border border-neuralPurple/40 flex items-center justify-center text-neuralPurple">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-grotesk font-bold text-xs uppercase tracking-widest text-white">Memory Synthesis</h3>
                <span className="text-[10px] font-mono text-zinc-400">Dedipya Goswami</span>
              </div>
            </div>

            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              Specialized <strong className="text-white font-semibold">AI & Backend Software Engineer</strong> skilled in building Retrieval-Augmented Generation (RAG) pipelines, Model Context Protocol (MCP) servers, and scalable API architectures. Experienced in building enterprise SaaS backend platforms, automating CI/CD pipelines with Terraform, and tuning vector databases.
            </p>

            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] font-mono text-pink-400">RAG Architectures</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] font-mono text-purple-400">MCP Protocol</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] font-mono text-cyan-400">FastAPI & Node.js</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] font-mono text-green-400">Terraform & AWS</span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="glass-panel rounded-2xl p-4 border border-white/5 bg-white/[0.01]">
              <div className="text-xl font-grotesk font-bold text-white tracking-tight">8.83 <span className="text-xs text-zinc-400">/ 10</span></div>
              <div className="text-[10px] font-mono text-pink-400 uppercase tracking-wider mt-0.5">SRM AP CGPA</div>
              <div className="text-[9px] font-sans text-zinc-500 mt-1">100% Scholarship</div>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/5 bg-white/[0.01]">
              <div className="text-xl font-grotesk font-bold text-white tracking-tight">22%</div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mt-0.5">CI/CD Speedup</div>
              <div className="text-[9px] font-sans text-zinc-500 mt-1">Terraform & IaC</div>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/5 bg-white/[0.01]">
              <div className="text-xl font-grotesk font-bold text-white tracking-tight">15%</div>
              <div className="text-[10px] font-mono text-green-400 uppercase tracking-wider mt-0.5">AWS Savings</div>
              <div className="text-[9px] font-sans text-zinc-500 mt-1">Cloud Optimization</div>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/5 bg-white/[0.01]">
              <div className="text-xl font-grotesk font-bold text-white tracking-tight">Top 5</div>
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider mt-0.5">HackSRM 5.0</div>
              <div className="text-[9px] font-sans text-zinc-500 mt-1">Camera Doodler</div>
            </div>
          </div>

          {/* Quick Contact Badge */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-2.5 font-mono text-xs">
            <a href="mailto:dedipyagoswami001@gmail.com" className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-neuralPurple shrink-0" />
              <span className="truncate">dedipyagoswami001@gmail.com</span>
            </a>
            <a href="tel:+919832994010" className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-green-400 shrink-0" />
              <span>+91-9832994010</span>
            </a>
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
              <a href="https://github.com/dedipya001" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
                <Github className="w-3.5 h-3.5" />
                <span>dedipya001</span>
              </a>
              <a href="https://www.linkedin.com/in/dedipya-goswami001/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
                <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                <span>dedipya-goswami001</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Column (8 cols): Interactive CV Document Console */}
        <div className="lg:col-span-8 glass-panel rounded-3xl border border-white/10 overflow-hidden bg-[#070919] flex flex-col shadow-2xl">
          
          {/* Console Header Bar */}
          <div className="p-5 border-b border-white/10 bg-[#0A0D24] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono text-xs text-zinc-400 pl-2 border-l border-white/10">
                dedipya_goswami_cv.json
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-grotesk font-semibold">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'experience'
                    ? 'bg-gradient-to-r from-neuralPurple to-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Experience</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'skills'
                    ? 'bg-gradient-to-r from-pink-500 to-neuralMagenta text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Skills</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'projects'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Projects</span>
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'education'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education</span>
              </button>
            </div>
          </div>

          {/* Console Content Display Area */}
          <div data-lenis-prevent className="p-6 sm:p-8 overflow-y-auto max-h-[520px] space-y-6">
            
            <AnimatePresence mode="wait">
              {activeTab === 'experience' && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Job 1: Selegic India */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-3">
                      <div>
                        <h3 className="font-grotesk font-bold text-lg text-white">Backend Developer</h3>
                        <div className="text-xs text-neuralPurple font-mono font-semibold">Selegic India Pvt. Ltd.</div>
                      </div>
                      <span className="text-xs font-mono text-zinc-400 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5 shrink-0 self-start sm:self-auto">
                        Oct 2025 – Present
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs font-sans text-zinc-300 list-disc pl-4 leading-relaxed">
                      <li>Developing backend services and AI-driven capabilities for <strong className="text-white">Encye</strong>, a SaaS platform enabling professionals to connect, collaborate, and share knowledge across organizations.</li>
                      <li>Built and deployed <strong className="text-white">Model Context Protocol (MCP)</strong> servers and integrated LLM-based workflows to enable AI-assisted content creation with specialized <strong className="text-white">SME persona tools</strong> that simulate domain experts.</li>
                      <li>Designed and implemented AI-powered <strong className="text-white">Salesforce CPQ Assistant</strong>, a <strong className="text-pink-400 font-mono">RAG + LLM chatbot</strong> that retrieves configuration data from Salesforce, enabling admins to automatically generate complex CPQ rules, pricing logic, and configuration actions.</li>
                      <li>Developed RAG pipelines by scraping and structuring Salesforce CPQ metadata, feeding contextual data to LLMs to answer advanced configuration queries and automate rule generation.</li>
                      <li>Architecting scalable backend systems using the <strong className="text-white">MEAN stack</strong> (MongoDB, Express.js, Angular, Node.js) along with Python-based AI services.</li>
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {["Python", "TypeScript", "Angular", "Node.js", "Express.js", "MongoDB", "Redis", "AWS", "MCP", "RAG", "LLM"].map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-[10px] font-mono text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Job 2: Belzabar Software Design */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-3">
                      <div>
                        <h3 className="font-grotesk font-bold text-lg text-white">DevOps Engineer Intern</h3>
                        <div className="text-xs text-neuralMagenta font-mono font-semibold">Belzabar Software Design Pvt. Ltd., New Delhi (Remote)</div>
                      </div>
                      <span className="text-xs font-mono text-zinc-400 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5 shrink-0 self-start sm:self-auto">
                        Sept 2024 – Jun 2025
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs font-sans text-zinc-300 list-disc pl-4 leading-relaxed">
                      <li>Automated CI/CD pipelines and infrastructure provisioning using <strong className="text-white">Terraform, Python, and Bash</strong>, reducing manual deployment effort and accelerating release cycles by <strong className="text-green-400 font-mono">22%</strong>.</li>
                      <li>Built an <strong className="text-white">AI-powered DevOps automation assistant</strong> that leverages RAG + LLMs to automate complex DevOps workflows including environment deployments, configuration discovery, and infrastructure troubleshooting.</li>
                      <li>Implemented a RAG system that extracts configuration metadata from <strong className="text-white">JAR files and infrastructure artifacts</strong>, enabling LLMs to answer queries across QA environments.</li>
                      <li>Developed automation tools for database migration and synchronization across QA environments, orchestrated through AI-assisted workflows.</li>
                      <li>Optimized AWS infrastructure (EC2, S3, CloudWatch) to reduce operational costs by <strong className="text-green-400 font-mono">15%</strong> and improved system observability using <strong className="text-white">Prometheus, Grafana, and AWS CloudWatch</strong>, decreasing incident response time by <strong className="text-green-400 font-mono">33%</strong>.</li>
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {["Terraform", "Python", "Bash", "AWS", "RAG", "LLMs", "Prometheus", "Grafana", "CloudWatch", "CI/CD"].map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-[10px] font-mono text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Job 3: Dot Sphere */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-3">
                      <div>
                        <h3 className="font-grotesk font-bold text-lg text-white">Full Stack Web Developer Intern</h3>
                        <div className="text-xs text-cyan-400 font-mono font-semibold">Dot Sphere, New Delhi (Remote)</div>
                      </div>
                      <span className="text-xs font-mono text-zinc-400 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5 shrink-0 self-start sm:self-auto">
                        Feb 2024 – Aug 2024
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs font-sans text-zinc-300 list-disc pl-4 leading-relaxed">
                      <li>Built and extended the official Dot Sphere website, integrating interactive features that increased user engagement by <strong className="text-cyan-400 font-mono">35%</strong>.</li>
                      <li>Implemented SEO optimization strategies that boosted organic traffic by <strong className="text-cyan-400 font-mono">50%</strong> and improved search visibility.</li>
                      <li>Collaborated with design and backend teams to deliver a responsive, accessible UI, improving cross-device compatibility by <strong className="text-cyan-400 font-mono">25%</strong>.</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="font-grotesk font-bold text-xs uppercase tracking-widest text-purple-400 mb-3">Programming Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {["C", "C++", "Python", "JavaScript", "TypeScript", "Bash"].map((s, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-grotesk font-bold text-xs uppercase tracking-widest text-pink-400 mb-3">Core Engineering Concepts</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Data Structures & Algorithms", "Machine Learning", "Computer Vision", "Operating Systems", "Computer Networks", "Retrieval-Augmented Generation (RAG)", "LLMs", "DevOps"].map((s, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-xs font-mono text-pink-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-grotesk font-bold text-xs uppercase tracking-widest text-cyan-400 mb-3">Technologies & Tooling</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Node.js", "Express.js", "React.js", "SQL", "Postgres", "MongoDB", "AWS", "Terraform", "Grafana", "Git / GitHub", "Salesforce Admin", "Codex", "n8n"].map((s, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Project 1 */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-grotesk font-bold text-base text-white">One Interview - Prep Platform</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">Full Stack & 2FA</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      Platform specifically designed to assist SRM University students in preparing for interviews with 2-Factor Authentication (2FA), company/tag filter question repositories, search lookups, and personalized senior interview experiences.
                    </p>
                  </div>

                  {/* Project 2 */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-grotesk font-bold text-base text-white">TrashTrace: City Garbage Monitoring System</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-pink-400">CV Model • 88% Accuracy</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      Backend services for city-wide garbage monitoring analyzing feeds from 100+ surveillance cameras with a custom detection model (88% accuracy), HTTP real-time email dispatching, and co-authored IEEE research paper (2025).
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'education' && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Academic Foundation */}
                  <div className="space-y-4">
                    <h4 className="font-grotesk font-bold text-xs uppercase tracking-widest text-green-400">Academic Degrees & Honors</h4>
                    
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                      <div className="flex justify-between text-xs font-sans">
                        <strong className="text-white text-sm">B.Tech in Computer Science Engineering</strong>
                        <span className="text-zinc-400 font-mono">2021 – 2025</span>
                      </div>
                      <div className="text-xs text-green-400 font-mono font-semibold">SRM University, AP</div>
                      <div className="text-xs text-zinc-300 font-sans mt-1">
                        Cumulative CGPA: <strong className="text-white">8.83 / 10</strong> • Awarded <strong className="text-green-400">100% Academic Performance Scholarship</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-xs font-grotesk font-bold text-white">Class 12th, CBSE</div>
                        <div className="text-[11px] font-mono text-zinc-400">Hem Sheela Model School (2021)</div>
                        <div className="text-xs font-mono text-pink-400 mt-1 font-semibold">Percentage: 93.8%</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-xs font-grotesk font-bold text-white">Class 10th, CBSE</div>
                        <div className="text-[11px] font-mono text-zinc-400">Hem Sheela Model School (2019)</div>
                        <div className="text-xs font-mono text-purple-400 mt-1 font-semibold">Percentage: 94.4%</div>
                      </div>
                    </div>
                  </div>

                  {/* Leadership & Achievements */}
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <h4 className="font-grotesk font-bold text-xs uppercase tracking-widest text-neuralPurple">Leadership & Key Achievements</h4>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-grotesk font-bold text-sm text-white">Deputy Leader & Core Team Member</div>
                        <span className="text-[10px] font-mono text-zinc-400">Jan 2023 – Dec 2024</span>
                      </div>
                      <div className="text-xs text-pink-400 font-mono">IndustreeOwl • SRMUAP</div>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                        Led 3 dedicated teams overseeing organization and execution of hackathons, skill workshops, and community tech events.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="font-grotesk font-bold text-sm text-white">Top 5 Position at HackSRM 5.0</div>
                        <span className="text-[10px] font-mono text-yellow-400 font-semibold">National Hackathon</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                        Project "Camera Doodler" selected in top 5 projects out of 70 competing teams at HackSRM 5.0 national hackathon.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Console Footer Status Bar */}
          <div className="p-4 border-t border-white/10 bg-[#0A0D24] flex items-center justify-between text-xs text-zinc-500 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Resume Index Validated</span>
            </div>
            <span>Status: 200 OK</span>
          </div>

        </div>

      </div>
    </section>
  );
};
