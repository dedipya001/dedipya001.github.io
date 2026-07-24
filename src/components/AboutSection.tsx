import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Target, Shield, Zap, Sparkles, Brain, Award } from 'lucide-react';

interface NeuronFacet {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: string;
  connections: string[]; // connects to other facet IDs
  gridPos: string; // Tailwind grid position classes
}

const NEURON_FACETS: NeuronFacet[] = [
  {
    id: "whoami",
    title: "Who Am I",
    icon: User,
    gridPos: "md:col-start-1 md:row-start-2",
    connections: ["mission", "values"],
    content: "An AI & Backend Software Engineer dedicated to constructing robust data systems and intelligent applications. I thrive at the intersection of logical backend architecture and artificial intelligence."
  },
  {
    id: "mission",
    title: "My Mission",
    icon: Target,
    gridPos: "md:col-start-2 md:row-start-1",
    connections: ["whoami", "philosophy", "motivation"],
    content: "To build system synapses that are invisible, resilient, and blazing fast. I aim to unlock real-world value by connecting deep semantic models with production-grade backend infrastructures."
  },
  {
    id: "developer",
    title: "Why Developer?",
    icon: Brain,
    gridPos: "md:col-start-3 md:row-start-2",
    connections: ["motivation", "solving"],
    content: "I became a developer because I love solving complex puzzles. Code is a medium where first-principles thinking can instantly materialize into scalable solutions that solve real-world problems."
  },
  {
    id: "motivation",
    title: "What Motivates Me",
    icon: Zap,
    gridPos: "md:col-start-2 md:row-start-3",
    connections: ["mission", "developer", "solving"],
    content: "High-throughput APIs, sub-millisecond query optimization, and the magic of seeing an agent accurately extract insights from millions of unstructured text chunks. Optimization is my fuel."
  },
  {
    id: "solving",
    title: "Problem Solving",
    icon: Sparkles,
    gridPos: "md:col-start-3 md:row-start-4",
    connections: ["developer", "motivation", "philosophy"],
    content: "I approach problems systematically: first I isolate constraints and trace data flows, then I build robust prototypes, and finally I scale under loaded testing. Telemetry is key."
  },
  {
    id: "values",
    title: "Core Values",
    icon: Shield,
    gridPos: "md:col-start-1 md:row-start-4",
    connections: ["whoami", "philosophy"],
    content: "High integrity, clean self-documenting code, exhaustive unit testing, and design systems that prioritize security. Privacy and reliable data auditing are non-negotiable."
  },
  {
    id: "philosophy",
    title: "My Philosophy",
    icon: Award,
    gridPos: "md:col-start-2 md:row-start-5",
    connections: ["mission", "values", "solving"],
    content: "'Every line of code is a neuron in a larger intelligence.' Software should not just compile; it should adapt, communicate smoothly, and have a clear reason to exist."
  }
];

export const AboutSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>("whoami");
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set up local neural connections inside section canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    
    const handleResize = () => {
      if (sectionRef.current) {
        canvas.width = sectionRef.current.clientWidth;
        canvas.height = sectionRef.current.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Small particles representing memory impulses inside about section
    const particles: { x: number; y: number; tx: number; ty: number; speed: number; progress: number }[] = [];
    
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 8, 22, 0.08)'; // Clear with trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn impulses
      if (Math.random() < 0.04 && particles.length < 12) {
        // Spawn an impulse between random coordinates
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          tx: Math.random() * canvas.width,
          ty: Math.random() * canvas.height,
          speed: Math.random() * 0.01 + 0.005,
          progress: 0
        });
      }

      // Draw and update impulses
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const currX = p.x + (p.tx - p.x) * p.progress;
        const currY = p.y + (p.ty - p.y) * p.progress;

        ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.beginPath();
        ctx.arc(currX, currY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const activeFacet = NEURON_FACETS.find(f => f.id === activeNode);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="min-h-screen py-24 relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 flex flex-col justify-center overflow-hidden"
    >
      {/* Local Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-40" 
      />

      <div className="relative z-10 mb-12">
        <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
          About Me <span className="text-neuralPurple">.</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
          Personality Synapse Network
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center relative z-10">
        
        {/* Personality Nodes Map */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          
          {/* Connector lines SVG (only visible on large screens) */}
          <svg className="hidden sm:block absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
            {/* Draw connections */}
            {NEURON_FACETS.map(facet => {
              return facet.connections.map(connId => {
                const connectedFacet = NEURON_FACETS.find(f => f.id === connId);
                if (!connectedFacet) return null;
                
                // SVG lines will connect between coordinates. To keep this simple yet responsive, 
                // we can draw glowing connections when hovering nodes.
                return null;
              });
            })}
          </svg>

          {NEURON_FACETS.map((facet) => {
            const Icon = facet.icon;
            const isActive = activeNode === facet.id;
            const isConnectedToActive = activeFacet?.connections.includes(facet.id);

            return (
              <button
                key={facet.id}
                onClick={() => setActiveNode(facet.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl glass-panel text-center relative transition-all duration-300 z-10 group cursor-pointer ${
                  isActive 
                    ? 'border-neuralPurple/40 bg-neuralPurple/10 scale-105 shadow-[0_0_25px_rgba(139, 92, 246, 0.15)]' 
                    : isConnectedToActive 
                      ? 'border-neuralMagenta/20 bg-neuralMagenta/5 scale-100 shadow-[0_0_15px_rgba(236,72,153,0.05)]' 
                      : 'hover:border-white/10 hover:bg-white/[0.02]'
                }`}
              >
                {/* Glow ring */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                  isActive 
                    ? 'bg-neuralPurple text-white shadow-neural-glow' 
                    : isConnectedToActive 
                      ? 'bg-neuralMagenta/20 text-neuralMagenta' 
                      : 'bg-white/5 text-zinc-400 group-hover:text-zinc-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className={`font-grotesk text-sm font-bold tracking-wide transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-300'
                }`}>
                  {facet.title}
                </h3>
                
                {/* Micro pulse indicator */}
                {isActive && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neuralPurple opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neuralPurple"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Facet Card */}
        <div className="md:col-span-2 min-h-[280px] flex flex-col justify-between p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Brain className="w-40 h-40 text-neuralPurple" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-neuralMagenta uppercase tracking-widest font-grotesk font-semibold">
                  Activated Facet Node
                </span>
                <h3 className="font-grotesk font-bold text-2xl text-white mt-1 mb-4 flex items-center gap-2.5">
                  {activeFacet && React.createElement(activeFacet.icon, { className: "w-6 h-6 text-neuralPurple" })}
                  {activeFacet?.title}
                </h3>
                <p className="text-zinc-300 font-sans text-[15px] leading-relaxed">
                  {activeFacet?.content}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 font-sans">
                <span>Status: Connected</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-neuralMagenta animate-pulse"></span>
                  Online
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
