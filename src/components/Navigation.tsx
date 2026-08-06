import React, { useState } from 'react';
import { 
  MessageSquare, User, Code2, Target, Briefcase, Cpu, 
  Network, Milestone, GraduationCap, Trophy, BookOpen, 
  FileText, Mail, Menu, X, Github, Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralLogo } from './NeuralLogo.tsx';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export const navItems: NavItem[] = [
  { id: 'chat', label: 'Explore', icon: MessageSquare },
  { id: 'about', label: 'About Me', icon: User },
  { id: 'projects', label: 'Engineering Memories', icon: Code2 },
  { id: 'mission', label: 'Current Mission', icon: Target },
  { id: 'experience', label: 'Professional Cortex', icon: Briefcase },
  { id: 'skills', label: 'Neural Connections', icon: Cpu },
  { id: 'graph', label: 'Cognitive Network', icon: Network },
  { id: 'activity', label: 'Git Synapses', icon: Github },
  { id: 'blogs', label: 'Medium Synapses', icon: Newspaper },
  { id: 'research', label: 'Research & Learning', icon: BookOpen },
  { id: 'resume', label: 'Knowledge Snapshot', icon: FileText },
  { id: 'contact', label: 'Connect', icon: Mail },
];

interface NavigationProps {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    
    // Dispatch brain zoom transition for sub-sections, otherwise scroll directly
    if (id !== 'chat') {
      window.dispatchEvent(new CustomEvent('cognitive-navigate', { detail: { sectionId: id } }));
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside data-lenis-prevent className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-[#050816]/80 backdrop-blur-md z-40 p-6 justify-between select-none">
        <div>
          {/* Logo */}
          <div className="mb-8 cursor-pointer" onClick={() => handleNavClick('chat')}>
            <NeuralLogo size={36} showText={true} />
          </div>

          {/* Navigation Links with neural synapses pathway */}
          <nav className="relative pl-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 select-none">
            {/* Trunk Synapse Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-white/5 pointer-events-none">
              {/* Flowing energy pulse */}
              <div className="absolute left-0 w-[1px] h-12 bg-gradient-to-b from-transparent via-neuralMagenta to-transparent animate-synapse-flow" />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-all relative ${
                    isActive 
                      ? 'text-white font-medium' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Horizontal synaptic connection tick from vertical trunk line to item */}
                  <div className={`absolute left-[-15px] top-1/2 -translate-y-1/2 w-[15px] h-[1px] pointer-events-none transition-colors duration-300 ${
                    isActive 
                      ? 'bg-neuralMagenta shadow-[0_0_8px_#EC4899]' 
                      : 'bg-white/5 group-hover:bg-neuralPurple/40'
                  }`} />

                  {/* Synaptic junction node (junction dot right on the trunk line) */}
                  <div className={`absolute left-[-17.5px] top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full border pointer-events-none transition-all duration-300 ${
                    isActive 
                      ? 'bg-neuralMagenta border-[#EC4899] scale-125 shadow-[0_0_10px_#EC4899]' 
                      : 'bg-zinc-950 border-white/10 group-hover:border-neuralPurple/50 group-hover:scale-110'
                  }`} />

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-neuralPurple/10 to-neuralMagenta/5 border-l-2 border-neuralPurple rounded-lg"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 z-10 transition-colors ${isActive ? 'text-neuralPurple' : 'group-hover:text-zinc-250'}`} />
                  <span className="z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Brain Activity Panel */}
        <div className="text-[10px] text-zinc-500 border-t border-white/5 pt-4 font-mono space-y-1.5">
          <div className="flex justify-between items-center text-zinc-400 font-semibold mb-1">
            <span>BRAIN ACTIVITY</span>
            <span className="flex items-center gap-1 text-[9px] text-pink-400 font-semibold bg-pink-950/20 border border-pink-900/30 px-1.5 py-0.25 rounded">
              <span className="w-1 h-1 rounded-full bg-pink-400 animate-pulse"></span>
              ACTIVE
            </span>
          </div>
          <div className="flex justify-between">
            <span>Indexed Memories:</span>
            <span className="text-zinc-300">247</span>
          </div>
          <div className="flex justify-between">
            <span>Memory Connections:</span>
            <span className="text-zinc-300">1,894</span>
          </div>
          <div className="flex justify-between">
            <span>Active Synapses:</span>
            <span className="text-zinc-300">412</span>
          </div>
          <div className="flex justify-between">
            <span>Knowledge Clusters:</span>
            <span className="text-zinc-300">63</span>
          </div>
          <div className="flex justify-between">
            <span>Response Latency:</span>
            <span className="text-zinc-300">148 ms</span>
          </div>
          <div className="flex justify-between">
            <span>Last Memory Added:</span>
            <span className="text-zinc-300">2d ago</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#050816]/90 border-t border-white/5 backdrop-blur-lg z-40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NeuralLogo size={28} showText={false} />
          <span className="font-grotesk font-semibold text-xs tracking-wider">COGNITIVE VAULT</span>
        </div>

        {/* Action icons on mobile bar */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleNavClick('chat')} 
            className={`p-2 rounded ${activeSection === 'chat' ? 'text-neuralPurple' : 'text-zinc-400'}`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleNavClick('graph')} 
            className={`p-2 rounded ${activeSection === 'graph' ? 'text-neuralMagenta' : 'text-zinc-400'}`}
          >
            <Network className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="p-2 rounded text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Side Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-[#050816] z-50 p-6 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <NeuralLogo size={36} showText={true} compact={true} />
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-base font-sans transition-all border ${
                        isActive 
                          ? 'bg-white/[0.03] border-neuralPurple/30 text-white font-medium shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                          : 'border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-neuralPurple' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-zinc-650 border-t border-white/5 pt-4">
              <p>© 2026 Dedipya Goswami • Cognitive Vault</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
