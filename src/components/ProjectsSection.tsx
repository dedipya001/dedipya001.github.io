import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ArrowUpRight, Github, GitFork, ArrowLeftRight, HelpCircle, Lightbulb, Compass } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  architecture: string[];
  challenges: string;
  lessons: string;
  timeline: string;
  demoUrl?: string;
  githubUrl?: string;
  flowSteps?: string[]; // to render a dynamic SVG flow diagram
}

const PROJECTS_DATA: Project[] = [
  {
    id: "encye-rag",
    title: "Encye RAG Integration",
    category: "AI / Backend",
    tags: ["AI", "Backend", "Python", "LangChain", "MongoDB Atlas", "Vector Search", "Google SDK", "Research"],
    description: "An enterprise-grade Retrieval-Augmented Generation (RAG) library delivered as a Python pip package to automate article drafting, corporate Q&A, and semantic indexing.",
    timeline: "Oct 2025 - Present",
    architecture: [
      "Ingestion: Google SDK workspace connector pulls raw document feeds.",
      "Chunking: Dynamic sliding-window text chunker splits content into overlaps.",
      "Vector Storage: MongoDB Atlas Vector Search stores computed sentence embeddings.",
      "Retrieval: LangChain pipelines retrieve top semantic chunks using cosine similarity.",
      "LLM Synthesis: Context-augmented payloads are securely compiled and routed."
    ],
    challenges: "Handling rate-limits and token constraints when processing huge Workspace dumps, along with managing hallucination thresholds during Q&A.",
    lessons: "Implementing a custom local sliding-window caching system for common questions cut third-party model cost by 28% and reduced latency.",
    demoUrl: "#",
    githubUrl: "https://github.com/dedipya/encye-rag",
    flowSteps: ["Google SDK", "Sliding Chunking", "Mongo Vector DB", "LangChain Routing", "Client Delivery"]
  },
  {
    id: "sellegic-cpq",
    title: "Salesforce CPQ AI Assistant",
    category: "AI / Backend",
    tags: ["AI", "Backend", "Python", "FastAPI", "NLP", "Salesforce CPQ"],
    description: "An NLP microservice that translates natural-language queries from sales teams into structurally validated JSON configurations for Salesforce CPQ rule generation.",
    timeline: "Oct 2025 - Present",
    architecture: [
      "Ingestion: FastAPI server consumes raw sales team pricing or rule prompts.",
      "Parsing: Regex-boosted NLP pipelines match quote entities and configuration actions.",
      "Payload Compilation: Validates output structure against Salesforce CPQ schemas.",
      "System Sync: Pushes validated quote configurations directly to Salesforce Admin rules."
    ],
    challenges: "Validating complex product dependencies and discount constraints that vary dynamically based on company rules.",
    lessons: "Decoupling validation from parsing using a rule-engine design allowed business administrators to update quoting criteria without altering core code.",
    demoUrl: "#",
    githubUrl: "https://github.com/dedipya/sellegic-cpq-ai",
    flowSteps: ["Sales Voice Input", "FastAPI Parser", "NLP Entity Matcher", "JSON Validation", "Salesforce CPQ"]
  },
  {
    id: "one-interview",
    title: "One Interview - Prep Platform",
    category: "Full Stack",
    tags: ["Full Stack", "React", "Node.js", "Express.js", "SQL", "2FA"],
    description: "An interview preparation platform assisting SRM University students with 2FA secure authentication, company-tagged questions, and interview experiences shared by seniors.",
    timeline: "Feb 2024 - Aug 2024",
    architecture: [
      "UI Layer: React dashboard renders categorized preparation modules and filters.",
      "Security: Express.js authentication router handles 2-Factor Authentication (2FA).",
      "Database: Structured SQL/Postgres repository organizes question metadata and tags.",
      "Search: Index matching enables quick lookup across companies, difficulty, and popularity."
    ],
    challenges: "Securing student login profiles while organizing a massive repository of tags and custom company questions.",
    lessons: "Implementing metadata indexing for tags reduced student query latency by 50% when navigating preparation materials.",
    demoUrl: "#",
    githubUrl: "https://github.com/dedipya001/one-interview",
    flowSteps: ["React UI", "2FA Security", "Express Backend", "Postgres SQL", "Dashboard Output"]
  },
  {
    id: "trashtrace",
    title: "TrashTrace: Garbage Monitoring",
    category: "Backend / ML",
    tags: ["Backend", "Python", "FastAPI", "Computer Vision", "Machine Learning", "alerting"],
    description: "A city-wide garbage monitoring system backend analyzing images from 100+ surveillance cameras using a custom formula-based detection model with 88% accuracy.",
    timeline: "Sept 2024 - Jun 2025",
    architecture: [
      "Ingestion: FastAPI streams incoming video frames from 100+ IP surveillance cameras.",
      "Detection: Custom formula-based computer vision model processes frames for garbage levels.",
      "Alerts: Alerting pipeline dispatches real-time SMTP emails upon threshold breaches.",
      "Research: Co-authored and presented a research paper on model training at IEEE."
    ],
    challenges: "Running frame-by-frame model analysis on 100+ camera inputs simultaneously without overloading server capacity.",
    lessons: "Wrapping threshold checks into asynchronous worker pools prevented API execution blockages and lowered CPU utilization.",
    demoUrl: "#",
    githubUrl: "https://github.com/dedipya001/trashtrace",
    flowSteps: ["IP Camera Feeds", "FastAPI Ingestion", "CV ML Model", "Alert Thresholds", "SMTP Alert Email"]
  }
];

const FILTER_TAGS = ["All", "AI", "Backend", "Frontend", "MERN", "Python", "TypeScript", "Research"];

export const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filteredProjects = PROJECTS_DATA.filter(proj => {
    if (activeFilter === "All") return true;
    return proj.tags.includes(activeFilter);
  });

  return (
    <section id="projects" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
            Engineering Memories <span className="text-neuralMagenta">.</span>
          </h2>
          <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
            Architectures & Code Repositories
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 max-w-lg">
          {FILTER_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setActiveFilter(tag);
                setExpandedProject(null); // Collapse when filtering
              }}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeFilter === tag 
                  ? 'bg-neuralMagenta/10 border border-neuralMagenta/35 text-neuralMagenta shadow-plasma-glow' 
                  : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => {
            const isExpanded = expandedProject === project.id;
            
            return (
              <motion.div
                key={project.id}
                layout="position"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 relative overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'ring-1 ring-neuralMagenta/25' : 'hover:border-white/10'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] text-neuralMagenta uppercase tracking-widest font-semibold font-grotesk">
                      {project.category} • {project.timeline}
                    </span>
                    <h3 className="font-grotesk font-bold text-2xl text-white mt-0.5">
                      {project.title}
                    </h3>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2.5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-grotesk font-semibold border transition-all cursor-pointer ${
                        isExpanded 
                          ? 'bg-white text-bgMain border-white' 
                          : 'bg-neuralMagenta/10 text-neuralMagenta border-neuralMagenta/20 hover:bg-neuralMagenta/20'
                      }`}
                    >
                      {isExpanded ? 'Hide Details' : 'Explore Node'}
                    </button>
                  </div>
                </div>

                <p className="text-zinc-300 font-sans text-[15px] leading-relaxed max-w-3xl mb-6">
                  {project.description}
                </p>

                {/* Tag list */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {project.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] bg-white/5 text-zinc-400 px-2.5 py-1 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Expandable Architecture and Flow Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden mt-6 pt-6 border-t border-white/5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Architecture list */}
                        <div>
                          <h4 className="text-xs text-neutralCyan uppercase tracking-widest font-semibold font-grotesk mb-4 flex items-center gap-1.5">
                            <Code2 className="w-4 h-4" />
                            System Architecture
                          </h4>
                          <ul className="space-y-3 font-sans text-sm text-zinc-300">
                            {project.architecture.map((step, idx) => (
                              <li key={idx} className="flex gap-2.5">
                                <span className="text-neuralPurple font-mono font-bold">{idx + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Challenges & Lessons */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-xs text-neuralPurple uppercase tracking-widest font-semibold font-grotesk mb-3 flex items-center gap-1.5">
                              <Compass className="w-4 h-4" />
                              Engineering Challenges
                            </h4>
                            <p className="text-zinc-300 font-sans text-sm leading-relaxed">
                              {project.challenges}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs text-green-400 uppercase tracking-widest font-semibold font-grotesk mb-3 flex items-center gap-1.5">
                              <Lightbulb className="w-4 h-4" />
                              Lessons Learned
                            </h4>
                            <p className="text-zinc-300 font-sans text-sm leading-relaxed">
                              {project.lessons}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Visual Flowchart steps */}
                      {project.flowSteps && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                          <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold font-grotesk mb-4 text-center sm:text-left">
                            Data Flow Diagram
                          </h4>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                            {project.flowSteps.map((step, sIdx) => (
                              <React.Fragment key={sIdx}>
                                <div className="bg-[#0B1120] border border-white/5 px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-300 shadow-sm">
                                  {step}
                                </div>
                                {sIdx < (project.flowSteps?.length || 0) - 1 && (
                                  <ArrowLeftRight className="w-4 h-4 text-zinc-600 hidden sm:block" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};
