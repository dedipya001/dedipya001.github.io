import React, { useEffect, useState } from 'react';
import { Terminal, Target, Book, Beaker, Lightbulb, Activity, RefreshCw } from 'lucide-react';

interface TerminalLog {
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN';
  message: string;
}

export const MissionSection: React.FC = () => {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [indexingProgress, setIndexingProgress] = useState(87);

  // Generate mock terminal logs to look like an active AI lab
  useEffect(() => {
    const initialLogs: TerminalLog[] = [
      { timestamp: "16:03:04", level: "INFO", message: "Initializing local RAG database connection..." },
      { timestamp: "16:03:05", level: "SUCCESS", message: "Indexed 12 core knowledge vectors successfully." },
      { timestamp: "16:03:08", level: "INFO", message: "Listening to socket stream at http://localhost:5000..." },
      { timestamp: "16:03:12", level: "SUCCESS", message: "Compiled semantic similarity matrix [12x12] in 2.1ms." }
    ];
    setLogs(initialLogs);

    const logMessages = [
      "Vector index sync: No changes detected in about_me.txt",
      "Cosine overlap audit: query 'Encye' triggered project indexing (relevance: 0.985)",
      "Garbage collection executed on local session state.",
      "Optimized compound database indexes on Sellegic production replica.",
      "Ingesting new blog node chunk #04: 'Understanding sliding-window embeddings'",
      "Incoming chat payload validated by Broker Layer (status: APPROVED)"
    ];

    const interval = setInterval(() => {
      const date = new Date();
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      const levels: ('INFO' | 'SUCCESS' | 'WARN')[] = ["INFO", "SUCCESS", "WARN"];
      
      const newLog: TerminalLog = {
        timestamp: timeStr,
        level: levels[Math.floor(Math.random() * levels.length)],
        message: logMessages[Math.floor(Math.random() * logMessages.length)]
      };

      setLogs(prev => [...prev.slice(-5), newLog]); // keep last 6 logs
      
      // Randomly fluctuation progress
      setIndexingProgress(prev => {
        if (prev >= 100) return 90;
        return prev + Math.floor(Math.random() * 3);
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="mission" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
      <div className="mb-12">
        <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
          Current Mission <span className="text-neuralPurple">.</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
          Active AI Research Laboratory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Work Board */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Mission Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-neuralPurple/10 to-transparent pointer-events-none rounded-bl-full" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-neuralPurple/10 flex items-center justify-center border border-neuralPurple/20">
                <Target className="w-5 h-5 text-neuralPurple" />
              </div>
              <div>
                <h3 className="font-grotesk font-bold text-xl text-white">Focus: Scale RAG Architectures</h3>
                <p className="text-xs text-zinc-500 font-sans">Current active deployment</p>
              </div>
            </div>

            <p className="text-zinc-300 font-sans text-sm leading-relaxed mb-6">
              Currently engineering advanced client-side semantic routing methods and experimenting with hybrid sparse/dense vector matching. Building and updating this **Cognitive Vault** portfolio to serve as a demonstrative model for instant knowledge graph traversals.
            </p>

            {/* Ingestion progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-neuralMagenta" />
                  Self-Indexing Nodes Matrix
                </span>
                <span>{indexingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neuralPurple to-neuralMagenta transition-all duration-1000 ease-out"
                  style={{ width: `${indexingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Terminal Logs (Active Server Telemetry) */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-[#050816]/75 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 text-zinc-400">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neuralMagenta" />
                <span>local_telemetry_broker.log</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>Live Feed</span>
              </span>
            </div>

            <div className="space-y-2.5 overflow-hidden max-h-[160px]">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-3 leading-normal">
                  <span className="text-zinc-600">[{log.timestamp}]</span>
                  <span className={`font-bold ${
                    log.level === 'SUCCESS' ? 'text-green-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-blue-400'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-zinc-300 flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Roadmap (Books, Lab experiments, upcoming) */}
        <div className="space-y-6">
          
          {/* Learning Roadmap Card */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <h3 className="font-grotesk font-bold text-base text-white mb-5 flex items-center gap-2">
              <Book className="w-4.5 h-4.5 text-neuralMagenta" />
              Roadmap & Books
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-neuralMagenta mt-2 shrink-0" />
                <div>
                  <h4 className="font-sans text-xs text-zinc-400">Reading Now</h4>
                  <p className="font-sans font-medium text-sm text-white leading-tight">Designing Data-Intensive Applications</p>
                  <span className="text-[10px] text-zinc-500">by Martin Kleppmann</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                <div>
                  <h4 className="font-sans text-xs text-zinc-400">Next Up</h4>
                  <p className="font-sans font-medium text-sm text-zinc-300 leading-tight">Speech and Language Processing</p>
                  <span className="text-[10px] text-zinc-500">by Daniel Jurafsky</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Experiments & Ideas */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <h3 className="font-grotesk font-bold text-base text-white mb-5 flex items-center gap-2">
              <Beaker className="w-4.5 h-4.5 text-neuralPurple" />
              Active Lab Experiments
            </h3>

            <div className="space-y-4 font-sans text-sm">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-zinc-200">Local TFJS Embeddings</span>
                  <span className="text-[10px] bg-neuralPurple/20 text-neuralPurple px-2 py-0.5 rounded font-mono">STABLE</span>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Moving text vector calculation into a client Web Worker to achieve offline operations.
                </p>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-zinc-200">Semantic Node Router</span>
                  <span className="text-[10px] bg-neuralMagenta/20 text-neuralMagenta px-2 py-0.5 rounded font-mono">WIP</span>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Using keyword density arrays to decide context shifts between resume page sections.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
