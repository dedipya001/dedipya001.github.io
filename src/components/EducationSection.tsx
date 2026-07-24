import React from 'react';
import { GraduationCap, Award, BookOpen, Scroll } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const courses = [
    "Data Structures & Algorithms",
    "Machine Learning",
    "Computer Vision",
    "Operating Systems",
    "Computer Networks",
    "RAG & LLM Workflows",
    "DevOps Pipelines"
  ];

  const certs = [
    "Salesforce Certified Administrator",
    "AWS Observability & Cloud Practitioner",
    "Terraform Associate (HashiCorp)",
    "Grafana & Prometheus Observability"
  ];

  return (
    <section id="education" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
      
      {/* CSS Floating Books animation locally inside style block */}
      <style>{`
        @keyframes float-book {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .floating-book-icon {
          animation: float-book 4s ease-in-out infinite;
        }
      `}</style>

      <div className="mb-12">
        <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
          Foundations <span className="text-neuralPurple">.</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
          Cognitive Vault Indexing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* College card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-6 right-6 text-neuralPurple/20 floating-book-icon pointer-events-none">
            <BookOpen className="w-16 h-16" />
          </div>

          <div>
            <span className="flex items-center gap-1.5 text-xs text-neuralPurple font-mono mb-2">
              <GraduationCap className="w-4 h-4" />
              Undergraduate Degree
            </span>
            <h3 className="font-grotesk font-bold text-xl text-white">
              B.Tech in Computer Science & Engineering
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              SRM University, AP • CGPA: 8.83/10 (2021 - 2025)
            </p>
            <p className="text-zinc-350 font-sans text-sm mt-4 leading-relaxed">
              Awarded 100% Scholarship based on academic excellence. Specialized in core computing architectures, RAG pipeline engineering, and cloud deployment frameworks.
            </p>
          </div>

          <div className="mt-8">
            <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold font-grotesk mb-3">
              Relevant Coursework
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {courses.map((course, idx) => (
                <span 
                  key={idx} 
                  className="text-xs bg-white/5 border border-white/5 text-zinc-300 px-3 py-1.5 rounded-xl hover:border-neuralPurple/20 hover:text-white transition-all duration-300 cursor-default"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* High School & Certifications card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between">
          <div>
            <span className="flex items-center gap-1.5 text-xs text-neuralMagenta font-mono mb-2">
              <Scroll className="w-4 h-4" />
              Schooling & Credentials
            </span>
            <h3 className="font-grotesk font-bold text-xl text-white">
              Hem Sheela Model School
            </h3>
            <div className="mt-3 space-y-2.5 font-sans text-sm text-zinc-300">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Class 12th (CBSE • 2021)</span>
                <span className="font-mono text-neuralMagenta font-bold">93.8%</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span>Class 10th (CBSE • 2019)</span>
                <span className="font-mono text-neuralMagenta font-bold">94.4%</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold font-grotesk">
              Completed Modules & Tools
            </h4>
            <div className="space-y-2">
              {certs.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-neuralMagenta/25 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-neuralMagenta/10 flex items-center justify-center border border-neuralMagenta/10 text-neuralMagenta">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-sans text-zinc-300 group-hover:text-white transition-colors">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
