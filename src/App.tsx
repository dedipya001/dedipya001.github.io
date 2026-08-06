import React, { useState, useEffect } from 'react';
import { NeuralBackground } from './components/NeuralBackground.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { Navigation } from './components/Navigation.tsx';
import { ChatSection } from './components/ChatSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ProjectsSection } from './components/ProjectsSection.tsx';
import { MissionSection } from './components/MissionSection.tsx';
import { ExperienceSection } from './components/ExperienceSection.tsx';
import { SkillsSection } from './components/SkillsSection.tsx';
import { KnowledgeGraphSection } from './components/KnowledgeGraphSection.tsx';
import { GitSynapsesSection } from './components/GitSynapsesSection.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { ResearchSection } from './components/ResearchSection.tsx';
import { ResumeSection } from './components/ResumeSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { AdminSection } from './components/AdminSection.tsx';

import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('chat');
  const [loadingPhase, setLoadingPhase] = useState<'black' | 'neurons' | 'title' | 'ready'>('black');

  // Route routing logic
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setIsAdmin(true);
    }
  }, []);

  // Landing experience sequence
  useEffect(() => {
    if (isAdmin) {
      setLoadingPhase('ready');
      return;
    }

    // Step 1: Black screen initially, then trigger neurons
    const timer1 = setTimeout(() => {
      setLoadingPhase('neurons');
    }, 800);

    // Step 2: Connections appear, brain network builds, then show title
    const timer2 = setTimeout(() => {
      setLoadingPhase('title');
    }, 2200);

    // Step 3: Show full site
    const timer3 = setTimeout(() => {
      setLoadingPhase('ready');
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isAdmin]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (isAdmin || loadingPhase !== 'ready') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isAdmin, loadingPhase]);

  // Synchronize navigation links with scroll position using Intersection Observer
  useEffect(() => {
    if (isAdmin || loadingPhase !== 'ready') return;

    const sections = [
      'chat', 'about', 'projects', 'mission', 'experience', 
      'skills', 'graph', 'activity', 'blogs', 'research', 'resume', 'contact'
    ];

    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        });
      }, {
        rootMargin: '-30% 0px -40% 0px' // Trigger when section occupies the main center screen
      });

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(obs => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [isAdmin, loadingPhase]);

  // Admin View
  if (isAdmin) {
    return <AdminSection />;
  }

  // Loading Sequence View
  if (loadingPhase !== 'ready') {
    return (
      <div className="fixed inset-0 bg-[#050816] flex flex-col items-center justify-center z-50 p-6 select-none overflow-hidden">
        {/* Render NeuralBackground in loading phases */}
        {loadingPhase !== 'black' && <NeuralBackground />}

        <AnimatePresence mode="wait">
          {loadingPhase === 'neurons' && (
            <motion.div
              key="neurons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-zinc-500 font-mono text-xs"
            >
              <Brain className="w-10 h-10 text-neuralPurple animate-pulse" />
              <span>Activating neural pathways...</span>
            </motion.div>
          )}

          {loadingPhase === 'title' && (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center space-y-4"
            >
              <h1 className="font-orbitron font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neuralPurple to-neuralMagenta">
                COGNITIVE VAULT
              </h1>
              <div className="space-y-1">
                <h2 className="font-grotesk text-3xl font-bold text-[#FFFFFF]">Dedipya Goswami</h2>
                <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">
                  A living representation of my engineering mind.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full Website View
  return (
    <div className="bg-[#050816] text-white min-h-screen relative">
      {/* Living background */}
      <NeuralBackground />
      
      {/* Cursor */}
      <CustomCursor />

      {/* Persistent left sidebar on desktop, bottom bar on mobile */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Area */}
      <div className="lg:pl-64 min-h-screen flex flex-col pb-20 lg:pb-0">
        <main className="flex-1">
          <ChatSection />
          <AboutSection />
          <ProjectsSection />
          <MissionSection />
          <ExperienceSection />
          <SkillsSection />
          <KnowledgeGraphSection />
          <GitSynapsesSection />
          <BlogSection />
          <ResearchSection />
          <ResumeSection />
          <ContactSection />
        </main>
      </div>
    </div>
  );
}
