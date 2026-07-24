import React, { useEffect, useState } from 'react';
import { Trophy, Users, Code, Award, Target, MessageSquare } from 'lucide-react';

interface MetricCardProps {
  icon: React.ComponentType<any>;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, value, suffix, label, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const increment = Math.ceil(value / (duration / 16));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/5 flex items-center gap-5 group hover:border-white/10 transition-all duration-300">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" 
           style={{ backgroundColor: `${color}10`, borderColor: `${color}25`, color }}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="font-orbitron font-bold text-3xl text-white tracking-tight">
          {count}{suffix}
        </div>
        <div className="text-xs text-zinc-400 font-sans mt-0.5 tracking-wide uppercase font-semibold">
          {label}
        </div>
      </div>
    </div>
  );
};

export const AchievementsSection: React.FC = () => {
  const items = [
    { icon: Trophy, title: "Secured Top 5 at HackSRM 5.0", desc: "Our project 'Camera Doodler' was selected as one of the top 5 projects out of 70 competing teams at the HackSRM 5.0 national-level hackathon." },
    { icon: Award, title: "100% Merit Academic Scholarship", desc: "Received a full 100% tuition scholarship from SRM University AP based on academic excellence, CGPA, and attendance." },
    { icon: Users, title: "IndustreeOwl Core Leadership", desc: "Deputy Leader and Core Team Member at SRM Directorate of Leadership & Innovation, leading 3 teams to organize hackathons and workshops." },
    { icon: Code, title: "IEEE Research Co-Author (2025)", desc: "Co-authored and presented a research paper on model training and computer vision garbage detection at a formal IEEE conference." }
  ];

  return (
    <section id="achievements" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
      <div className="mb-12">
        <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
          Achievements <span className="text-neuralMagenta">.</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
          Key Performance & Awards
        </p>
      </div>

      {/* Grid of counter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={Code} value={12} suffix="+" label="Projects Completed" color="#8B5CF6" />
        <MetricCard icon={Award} value={15} suffix="+" label="Stack Technologies" color="#EC4899" />
        <MetricCard icon={Users} value={5} suffix="+" label="Teams & Events" color="#8B5CF6" />
        <MetricCard icon={Trophy} value={3} suffix="" label="Hackathons & Papers" color="#EC4899" />
      </div>

      {/* Detailed achievements list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const CardIcon = item.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl glass-panel border border-white/5 hover:border-white/10 transition-all duration-300 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 text-zinc-400">
                <CardIcon className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-grotesk font-bold text-sm text-zinc-100">{item.title}</h3>
                <p className="text-zinc-400 font-sans text-xs mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
