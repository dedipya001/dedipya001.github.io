import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Sparkles, RefreshCw, HelpCircle, ArrowRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveBrain } from './InteractiveBrain.tsx';
import { ErrorBoundary } from './ErrorBoundary.tsx';

interface Citation {
  id: string;
  title: string;
  source: string;
  category: string;
  confidence: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  citations?: Citation[];
  loading?: boolean;
  logs?: string[];
}

const SUGGESTED_QUESTIONS = [
  "Tell me about your Backend Developer role at Selegic.",
  "What AI features did you build for the Encye platform?",
  "How did you optimize AWS costs by 15% at Belzabar?",
  "Tell me about your RAG Salesforce CPQ Assistant.",
  "What is One Interview and how does it secure accounts?",
  "Tell me about your IEEE research paper on TrashTrace.",
  "What did you achieve as Deputy Leader of IndustreeOwl?"
];

const formatMarkdown = (text: string) => {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const isNum = /^\d+\.\s/.test(line.trim());
    
    let cleanLine = line;
    if (isBullet) {
      cleanLine = line.trim().replace(/^[-*]\s+/, '');
    } else if (isNum) {
      cleanLine = line.trim().replace(/^\d+\.\s+/, '');
    }
    
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    const parsedElements = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const innerText = part.slice(2, -2);
        return (
          <strong 
            key={partIdx} 
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-neuralPurple via-neuralPurple/90 to-neuralMagenta drop-shadow-[0_0_8px_rgba(139,92,246,0.2)]"
          >
            {innerText}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1.5 pl-2">
          <span className="text-neuralMagenta font-bold shrink-0">•</span>
          <span className="text-zinc-200">{parsedElements}</span>
        </div>
      );
    }
    
    if (isNum) {
      const numMatch = line.match(/^(\d+)\.\s+/);
      const num = numMatch ? numMatch[1] : (lineIdx + 1);
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1.5 pl-2">
          <span className="text-neuralPurple font-mono font-bold shrink-0">{num}.</span>
          <span className="text-zinc-200">{parsedElements}</span>
        </div>
      );
    }
    
    return (
      <p key={lineIdx} className="min-h-[1.2em] my-1 text-zinc-200">
        {parsedElements}
      </p>
    );
  });
};

export const ChatSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSuggestionClick = (question: string) => {
    handleSubmit(null, question);
  };

  const handleLobeScroll = (sectionId: string) => {
    window.dispatchEvent(new CustomEvent('cognitive-navigate', { detail: { sectionId } }));
  };

  const handleSubmit = async (e: React.FormEvent | null, customQuery?: string) => {
    if (e) e.preventDefault();

    const activeQuery = (customQuery || query).trim();
    if (!activeQuery || isTyping) return;

    setQuery('');
    setIsChatOpen(true);

    const userMessage: Message = { role: 'user', content: activeQuery };
    setMessages(prev => [...prev, userMessage]);

    setIsTyping(true);

    const assistantMessagePlaceholder: Message = {
      role: 'assistant',
      content: '',
      loading: true,
      logs: ["Establishing neural pathways..."]
    };

    setMessages(prev => [...prev, assistantMessagePlaceholder]);

    window.dispatchEvent(new CustomEvent('cognitive-search', { detail: { query: activeQuery } }));

    const logTimeouts: any[] = [];
    const pushLog = (logText: string) => {
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.role === 'assistant' && last.loading) {
          last.logs = [...(last.logs || []), logText];
        }
        return copy;
      });
    };

    logTimeouts.push(setTimeout(() => pushLog("Activating memory clusters..."), 250));
    logTimeouts.push(setTimeout(() => pushLog("Traversing synapses..."), 500));
    logTimeouts.push(setTimeout(() => pushLog("Searching cognitive network..."), 750));
    logTimeouts.push(setTimeout(() => pushLog("Connecting related experiences..."), 1000));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: activeQuery,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No body reader');
      }

      const decoder = new TextDecoder('utf-8');
      let resultText = '';

      logTimeouts.forEach(clearTimeout);

      pushLog("✔ 8 related memories activated");
      pushLog("✔ Reconstructing response...");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'content') {
                resultText += data.content;
                setMessages(prev => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === 'assistant') {
                    last.content = resultText;
                  }
                  return copy;
                });
              } else if (data.type === 'done') {
                setMessages(prev => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === 'assistant') {
                    last.loading = false;
                    last.citations = [
                      { id: '1', title: 'Encye RAG integration package', source: 'projects', category: 'Project', confidence: 98 },
                      { id: '2', title: 'AI & Backend Developer - Selegic Inc', source: 'experience', category: 'Experience', confidence: 95 }
                    ];
                    last.confidence = 96;
                  }
                  return copy;
                });
              }
            } catch (err) {
              // Ignore line parse failures
            }
          }
        }
      }

    } catch (error) {
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.role === 'assistant') {
          last.content = "Sorry, I encountered an issue reconstructing memories. Please verify if the database server is online.";
          last.citations = [];
          last.loading = false;
          last.logs = ["⚠ Reconstruct exception detected."];
        }
        return copy;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const renderSearchForm = (inHero: boolean) => (
    <form onSubmit={(e) => handleSubmit(e)} className={`w-full relative ${inHero ? 'max-w-xl' : 'max-w-2xl mx-auto'}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Traverse my memories..."
          disabled={isTyping}
          className="w-full bg-[#0A0816]/80 border border-white/5 rounded-2xl pl-5 pr-14 py-4 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-neuralPurple/40 focus:ring-1 focus:ring-neuralPurple/20 focus:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!query.trim() || isTyping}
          className="absolute right-3.5 p-2 rounded-xl bg-gradient-to-br from-neuralPurple to-neuralMagenta text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:hover:scale-100"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested questions */}
      {inHero && (
        <div className="mt-6">
          <h3 className="text-zinc-500 text-xs font-grotesk tracking-widest uppercase mb-3 flex items-center gap-1.5 font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            Activate connected memories
          </h3>
          <div 
            data-lenis-prevent 
            className="flex flex-wrap gap-2 max-h-[130px] overflow-y-auto pr-1.5 suggested-scroll"
          >
            {SUGGESTED_QUESTIONS.map((question, qIdx) => {
              const suggestedRegions = ['experience', 'projects', 'experience', 'projects', 'projects', 'achievements', 'experience'];
              const targetRegion = suggestedRegions[qIdx] || 'projects';
              return (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => handleSuggestionClick(question)}
                  onMouseEnter={() => window.dispatchEvent(new CustomEvent('cognitive-hover', { detail: { regionId: targetRegion } }))}
                  onMouseLeave={() => window.dispatchEvent(new CustomEvent('cognitive-hover', { detail: { regionId: null } }))}
                  className="text-[11px] text-zinc-300 bg-white/[0.02] border border-white/5 rounded-xl px-3.5 py-1.5 hover:bg-neuralPurple/10 hover:border-neuralPurple/30 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.22)] hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 text-left flex items-center gap-2 shrink-0"
                >
                  <span>{question}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-550 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );

  return (
    <section id="chat" className="min-h-screen py-16 flex flex-col justify-center relative px-4 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto z-10">
      <style>{`
        .suggested-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .suggested-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .suggested-scroll::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }
        .suggested-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.6);
        }
      `}</style>

      {/* 3-Column Landing centerpiece grid */}
      <div className="w-full flex flex-col items-center">
        {/* 1. Hero Title / Branding */}
        <div className="text-center mb-10 max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="font-grotesk font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4 tracking-tight leading-[1.15]">
            Welcome to <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-neuralPurple via-neuralMagenta to-warmLavender">My Cognitive Vault</span>
          </h1>
          <p className="text-zinc-400 text-sm font-sans max-w-2xl leading-relaxed">
            Every project, experience, skill, and lesson exists here as interconnected memories. Ask a question or click a region on the centerpiece connectome brain to explore my engineering mind.
          </p>
        </div>

        {/* 2. 3-Column Layout: Left Content | Center Brain | Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full mb-10 relative">

          {/* Left Column: About Me & Current Mission */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-center">
            <div
              onClick={() => handleLobeScroll('about')}
              className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-neuralPurple/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2 font-semibold">Center Core</div>
              <h3 className="font-grotesk font-bold text-base text-white group-hover:text-neuralPurple transition-colors">About Me</h3>
              <p className="text-zinc-400 text-xs font-sans mt-2.5 leading-relaxed">
                AI & Backend Software Engineer specializing in scalable microservices, LangChain vector pipelines, and database optimization.
              </p>
            </div>

            <div
              onClick={() => handleLobeScroll('mission')}
              className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-[#EC4899]/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.1)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2 font-semibold">Right Hemisphere</div>
              <h3 className="font-grotesk font-bold text-base text-white group-hover:text-[#EC4899] transition-colors">Current Mission</h3>
              <p className="text-zinc-400 text-xs font-sans mt-2.5 leading-relaxed">
                Leading CPQ quote orchestration integration, designing secure API payload broker validation layers, and tuning cache keys.
              </p>
            </div>
          </div>

          {/* Center Column: Interactive Connectome Brain Centerpiece */}
          <div className="lg:col-span-6 flex justify-center items-center relative w-full h-[480px] overflow-visible">
            <ErrorBoundary>
              <InteractiveBrain />
            </ErrorBoundary>
          </div>

          {/* Right Column: Featured Projects & Core Skills */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-center">
            <div
              onClick={() => handleLobeScroll('projects')}
              className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-[#EC4899]/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.1)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2 font-semibold">Left Hemisphere</div>
              <h3 className="font-grotesk font-bold text-base text-white group-hover:text-[#EC4899] transition-colors">Featured Projects</h3>
              <p className="text-zinc-400 text-xs font-sans mt-2.5 leading-relaxed">
                Encye RAG integration (pip package, 40% document review latency reduction) and Selegic Inc CPQ assistant.
              </p>
            </div>

            <div
              onClick={() => handleLobeScroll('skills')}
              className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-neuralPurple/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2 font-semibold">Left Hemisphere</div>
              <h3 className="font-grotesk font-bold text-base text-white group-hover:text-neuralPurple transition-colors">Core Skills</h3>
              <p className="text-zinc-400 text-xs font-sans mt-2.5 leading-relaxed">
                Python (FastAPI, PyTest), Node.js (Express, Jest), MongoDB Atlas Vector search, Redis caching, Docker, and AWS.
              </p>
            </div>
          </div>

        </div>

        {/* 3. Search Bar directly below the brain */}
        <div className="w-full max-w-2xl mt-4 z-20">
          {renderSearchForm(true)}
        </div>
      </div>

      {/* Slide-out overlay chat drawer for responses */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Dark backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-[#050816]/75 z-40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              data-lenis-prevent
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#050816]/95 border-l border-white/5 backdrop-blur-xl z-50 p-6 flex flex-col justify-between shadow-2xl select-none"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neuralMagenta animate-pulse" />
                  <span className="font-grotesk font-bold text-xs uppercase tracking-widest text-zinc-400">Cognitive Search Output</span>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 mb-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] rounded-2xl px-4 py-3.5 font-sans text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-neuralPurple to-neuralPurple/70 text-white rounded-br-none'
                        : 'glass-panel text-zinc-150 rounded-bl-none border border-white/5'
                      }`}>
                      {msg.role === 'assistant' && msg.logs && msg.logs.length > 0 && (
                        <div className="font-mono text-[10px] text-zinc-500 space-y-1 mb-3 select-none">
                          <div className="flex items-center gap-1.5">
                            {msg.loading ? (
                              <RefreshCw className="w-3 h-3 animate-spin text-neuralPurple" />
                            ) : (
                              <span className="w-1 h-1 rounded-full bg-neuralMagenta shadow-[0_0_8px_#EC4899]"></span>
                            )}
                            <span className="text-zinc-450 font-bold uppercase tracking-wider text-[8.5px]">Connected Memories</span>
                          </div>
                          <div className="pl-2.5 border-l border-white/10 space-y-1 mt-1.5">
                            {msg.logs.map((log, lIdx) => {
                              const isComplete = log.includes('activated') || log.includes('response') || log.includes('✔');
                              return (
                                <div key={lIdx} className={isComplete ? "text-zinc-300" : "text-zinc-550"}>
                                  {log}
                                </div>
                              );
                            })}

                            {!msg.loading && msg.citations && msg.citations.length > 0 && (
                              <div className="mt-2.5 pt-2.5 border-t border-white/5 space-y-1 font-mono text-[10px]">
                                <div className="text-zinc-500 font-bold uppercase tracking-wider text-[8px] mb-1">Activated Lobe Nodes:</div>
                                {msg.citations.map((cite, cIdx) => (
                                  <div key={cIdx} className="flex items-center gap-1 text-zinc-450">
                                    <span className="text-neuralMagenta">✔</span>
                                    <span>{cite.title}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {msg.loading && (!msg.logs || msg.logs.length === 0) ? (
                        <div className="flex items-center gap-2.5 text-zinc-450 font-mono text-xs">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-neuralPurple" />
                          <span>Activating brain synapses...</span>
                        </div>
                      ) : (
                        msg.content && <div className="space-y-1 text-zinc-200 text-[13.5px] leading-relaxed">{formatMarkdown(msg.content)}</div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                  <div className="flex items-center gap-2.5 text-zinc-500 text-xs px-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-neuralPurple" />
                    <span>Reconstructing responses...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <form onSubmit={handleSubmit} className="relative flex items-center pt-3 border-t border-white/5">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Query my brain memories..."
                  disabled={isTyping}
                  className="w-full bg-[#0A0816] border border-white/5 rounded-xl pl-4 pr-12 py-3.5 text-white text-sm placeholder-zinc-650 focus:outline-none focus:border-neuralPurple/40 focus:ring-1 focus:ring-neuralPurple/20 transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isTyping}
                  className="absolute right-2.5 p-2 rounded-lg bg-gradient-to-br from-neuralPurple to-neuralMagenta text-white transition-all disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
