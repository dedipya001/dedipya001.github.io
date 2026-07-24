import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, ChevronDown, Award, ShieldAlert, TrendingUp, Cpu } from 'lucide-react';

interface Job {
  id: string;
  role: string;
  company: string;
  period: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  problemSolved: string;
  impact: string;
  architecture: string;
}

const JOBS_DATA: Job[] = [
  {
    id: "selegic-dev",
    role: "Backend Developer",
    company: "Selegic India Pvt. Ltd.",
    period: "Oct 2025 – Present",
    summary: "Developing backend services and AI-driven capabilities for Encye, a SaaS knowledge sharing platform, and building Model Context Protocol (MCP) servers and RAG CPQ systems.",
    responsibilities: [
      "Developing backend services and AI-driven capabilities for Encye, a SaaS platform enabling professionals to connect, collaborate, and share knowledge across organizations.",
      "Built and deployed Model Context Protocol (MCP) servers and integrated LLM-based workflows to enable AI-assisted content creation with specialized SME persona tools simulating domain experts.",
      "Designed and implemented AI-powered Salesforce CPQ Assistant (a RAG + LLM chatbot) retrieving configurations from Salesforce, generating complex rules, pricing logic, and actions.",
      "Developed RAG pipelines by scraping and structuring Salesforce CPQ metadata to feed LLMs for configuration query resolution.",
      "Architecting scalable backend systems using the MEAN stack (MongoDB, Express.js, Angular, Node.js) along with Python-based AI services."
    ],
    technologies: ["Python", "JavaScript", "TypeScript", "Angular", "Node.js", "Express.js", "MongoDB", "Redis", "AWS", "MCP", "RAG", "LLM"],
    problemSolved: "Complex manual configuration rules and pricing logic management for enterprise Salesforce CPQ setups.",
    impact: "Automated admin workflows enabling instant rule generation from natural language prompts, simplifying configurations.",
    architecture: "Salesforce CPQ Metadata -> Scraper/Parser -> MongoDB Vector Index -> LLM Assistant -> Admin Actions"
  },
  {
    id: "belzabar-devops",
    role: "DevOps Engineer Intern",
    company: "Belzabar Software Design Pvt. Ltd.",
    period: "Sept 2024 – Jun 2025",
    summary: "Automated CI/CD pipelines, deployed RAG-based DevOps automation assistants for config discovery, and optimized AWS cloud observability.",
    responsibilities: [
      "Automated CI/CD pipelines and infrastructure provisioning using Terraform, Python, and Bash, reducing manual deployment effort and accelerating release cycles by 22%.",
      "Built an AI-powered DevOps automation assistant that leverages RAG + LLMs to automate complex DevOps workflows including environment deployments and troubleshooting.",
      "Implemented a RAG system that extracts configuration metadata from JAR files and infrastructure artifacts for environment querying across multiple QA environments.",
      "Developed database migration and synchronization automation tools across QA environments orchestrated through AI-assisted workflows.",
      "Optimized AWS infrastructure (EC2, S3, CloudWatch) to reduce operational costs by 15% and improved observability using Prometheus, Grafana, and AWS CloudWatch, decreasing incident response time by 33%."
    ],
    technologies: ["Terraform", "Python", "Bash", "AWS", "RAG", "LLMs", "Prometheus", "Grafana", "CloudWatch", "CI/CD", "EC2", "S3"],
    problemSolved: "High manual overhead in troubleshooting environments and querying configuration metadata spread across QA infrastructures.",
    impact: "Reduced manual deployment effort by accelerating releases by 22%, cut AWS costs by 15%, and reduced incident response times by 33%.",
    architecture: "JAR Files & Configs -> Metadata Extractor -> RAG Vector Database -> LLM DevOps Assistant -> Devs CLI"
  },
  {
    id: "dotsphere-intern",
    role: "Full Stack Web Developer Intern",
    company: "Dot Sphere",
    period: "Feb 2024 – Aug 2024",
    summary: "Built interactive features, optimized SEO web traffic, and collaborated with cross-functional teams to ensure responsive UI delivery.",
    responsibilities: [
      "Built and extended the official Dot Sphere website, integrating interactive features that increased user engagement by 35%.",
      "Implemented SEO optimization strategies that boosted organic traffic by 50% and improved search visibility.",
      "Collaborated with design and backend teams to deliver a responsive, accessible UI, improving cross-device compatibility by 25%."
    ],
    technologies: ["React.js", "Node.js", "Express.js", "JavaScript", "SEO", "Responsive UI", "CSS", "Git"],
    problemSolved: "Poor cross-device UI compatibility and low organic traffic discoverability on the official web platform.",
    impact: "Increased user engagement by 35%, boosted organic web traffic by 50%, and improved cross-device UI compatibility by 25%.",
    architecture: "Responsive UI (React.js) -> Node.js/Express Backend -> SEO rendering -> User Analytics"
  }
];

export const ExperienceSection: React.FC = () => {
  const [expandedJob, setExpandedJob] = useState<string | null>("sellegic-dev");

  return (
    <section id="experience" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
      <div className="mb-12">
        <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
          Work Experience <span className="text-neuralPurple">.</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
          Career Synapses & Achievements
        </p>
      </div>

      <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
        {JOBS_DATA.map((job) => {
          const isExpanded = expandedJob === job.id;

          return (
            <div key={job.id} className="relative pl-12 group">
              
              {/* Timeline marker */}
              <div 
                onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                className={`absolute left-3.5 top-2.5 w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${
                  isExpanded 
                    ? 'bg-neuralPurple border-neuralPurple text-white shadow-neural-glow scale-110' 
                    : 'bg-bgMain border-white/10 text-zinc-500 group-hover:border-white/20 group-hover:text-zinc-300'
                }`}
              >
                <Briefcase className="w-3 h-3" />
              </div>

              {/* Job Card */}
              <div className={`glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 transition-all duration-300 ${
                isExpanded ? 'bg-bgSec/70 ring-1 ring-neuralPurple/20 shadow-xl' : 'hover:border-white/10 hover:bg-white/[0.01]'
              }`}>
                {/* Header */}
                <div 
                  onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div>
                    <h3 className="font-grotesk font-bold text-lg text-white group-hover:text-neuralPurple transition-colors">
                      {job.role}
                    </h3>
                    <p className="text-sm text-zinc-400 font-sans mt-0.5">
                      {job.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {job.period}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-neuralPurple' : ''
                    }`} />
                  </div>
                </div>

                <p className="text-zinc-400 text-sm font-sans mt-4 leading-relaxed">
                  {job.summary}
                </p>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.technologies.map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] font-mono bg-white/5 border border-white/5 text-zinc-300 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden mt-6 pt-6 border-t border-white/5 space-y-6"
                    >
                      {/* Responsibilities */}
                      <div>
                        <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold font-grotesk mb-3">
                          Core Responsibilities
                        </h4>
                        <ul className="space-y-2.5 font-sans text-sm text-zinc-300 list-disc list-inside pl-1">
                          {job.responsibilities.map((resp, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Problems & Impact Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <h4 className="text-xs text-neuralPurple uppercase tracking-widest font-semibold font-grotesk mb-2 flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Problem Solved
                          </h4>
                          <p className="text-zinc-300 font-sans text-sm leading-relaxed">
                            {job.problemSolved}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <h4 className="text-xs text-green-400 uppercase tracking-widest font-semibold font-grotesk mb-2 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Measured Impact
                          </h4>
                          <p className="text-zinc-300 font-sans text-sm leading-relaxed">
                            {job.impact}
                          </p>
                        </div>
                      </div>

                      {/* Architecture Path */}
                      {job.architecture && (
                        <div className="p-4 rounded-2xl bg-[#050816]/60 border border-white/5">
                          <h4 className="text-xs text-neuralMagenta uppercase tracking-widest font-semibold font-grotesk mb-2 flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5" />
                            Contribution Architecture Flow
                          </h4>
                          <p className="font-mono text-xs text-zinc-400">
                            {job.architecture}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
