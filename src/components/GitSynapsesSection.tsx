import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Calendar, Info, RefreshCw, Layers, Eye, EyeOff } from 'lucide-react';

interface ContributionDay {
  date: string;
  personal: number;
  work: number;
}

type ContributionYearData = ContributionDay[];

export const GitSynapsesSection: React.FC = () => {
  const [data, setData] = useState<{ [year: string]: ContributionYearData }>({});
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [loading, setLoading] = useState(true);
  const [isColorBlind, setIsColorBlind] = useState<boolean>(false);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  // Fetch contributions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/github-contributions');
        if (!res.ok) throw new Error('API failed');
        const json = await res.json();
        setData(json);
        const years = Object.keys(json);
        if (years.length > 0) {
          const maxYear = Math.max(...years.map(Number)).toString();
          setSelectedYear(maxYear);
        }
      } catch (err) {
        console.error('Failed to load live git contribution data, generating fallback', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Determine contribution block color based on personal & work weights, and color blind mode
  const getCellColor = (day: ContributionDay): string => {
    const p = day.personal || 0;
    const w = day.work || 0;
    
    if (p === 0 && w === 0) return 'rgba(255, 255, 255, 0.03)'; // No commits

    if (isColorBlind) {
      // Color Blind Palette (Yellow for Personal, Blue for Work, Light Gray/White for Mixed)
      // 1. Mixed
      if (p > 0 && w > 0) {
        const sum = p + w;
        if (sum < 3) return '#3f3f46';
        if (sum < 6) return '#71717a';
        if (sum < 10) return '#a1a1aa';
        return '#f4f4f5';
      }
      // 2. Personal Only (Yellow)
      if (p > 0) {
        if (p < 2) return '#453000';
        if (p < 4) return '#715200';
        if (p < 7) return '#ca8a04';
        return '#facc15';
      }
      // 3. Work Only (Blue)
      if (w > 0) {
        if (w < 3) return '#0c2340';
        if (w < 6) return '#1e3a8a';
        if (w < 10) return '#2563eb';
        return '#60a5fa';
      }
    } else {
      // Normal Palette (Pink for Personal, Cyan for Work, Orange for Mixed)
      // 1. Both Personal & Work (Mixed Orange)
      if (p > 0 && w > 0) {
        const sum = p + w;
        if (sum < 3) return '#451a03';
        if (sum < 6) return '#9a3412';
        if (sum < 10) return '#ea580c';
        return '#f97316';
      }
      // 2. Personal Only (Pink)
      if (p > 0) {
        if (p < 2) return '#4d0b2f';
        if (p < 4) return '#861953';
        if (p < 7) return '#c2185b';
        return '#ec4899';
      }
      // 3. Work Only (Cyan)
      if (w > 0) {
        if (w < 3) return '#083344';
        if (w < 6) return '#0e7490';
        if (w < 10) return '#06b6d4';
        return '#22d3ee';
      }
    }

    return 'rgba(255, 255, 255, 0.03)';
  };

  const getTooltipText = (day: ContributionDay): string => {
    const parts = [];
    if (day.personal > 0) parts.push(`${day.personal} personal commits`);
    if (day.work > 0) parts.push(`${day.work} work commits`);
    
    const formattedDate = new Date(day.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (parts.length === 0) return `No contributions on ${formattedDate}`;
    return `${parts.join(' & ')} on ${formattedDate}`;
  };

  // Group year dataset into 53 weeks (columns) of 7 days (rows)
  const renderCalendarGrid = () => {
    const yearDays = data[selectedYear] || [];
    if (yearDays.length === 0) return null;

    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    const firstDayIndex = new Date(yearDays[0].date).getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      currentWeek.push({ date: '', personal: 0, work: 0 }); // Placeholder
    }

    yearDays.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', personal: 0, work: 0 });
      }
      weeks.push(currentWeek);
    }

    return (
      <div className="min-w-[760px] flex gap-[3px] select-none">
        {weeks.map((week, wIdx) => (
          <div key={`w-${wIdx}`} className="flex flex-col gap-[3px]">
            {week.map((day, dIdx) => {
              if (!day.date) {
                return (
                  <div 
                    key={`d-${wIdx}-${dIdx}`} 
                    className="w-[10px] h-[10px] rounded-[1.5px] opacity-0"
                  />
                );
              }
              const color = getCellColor(day);
              return (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="w-[10px] h-[10px] rounded-[1.5px] transition-all hover:scale-125 hover:shadow-[0_0_8px_rgba(255,255,255,0.15)] cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const getYearSummary = (year: string) => {
    const yearDays = data[year] || [];
    let totalPersonal = 0;
    let totalWork = 0;
    
    yearDays.forEach(d => {
      totalPersonal += (d.personal || 0);
      totalWork += (d.work || 0);
    });

    return {
      personal: totalPersonal,
      work: totalWork,
      total: totalPersonal + totalWork
    };
  };

  const currentSummary = getYearSummary(selectedYear);

  return (
    <section id="activity" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
      
      {/* Title & Controls */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
            Developer Synapses <span className="text-neuralPurple">.</span>
          </h2>
          <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
            GitHub Commits Activity Log
          </p>
        </div>

        {/* Controls Container */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Color Blind Toggle */}
          <button
            onClick={() => setIsColorBlind(!isColorBlind)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-grotesk font-bold tracking-wide border transition-all ${
              isColorBlind 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {isColorBlind ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Color Blind Mode</span>
          </button>

          {/* Tab Year Selectors */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/5">
            {['2026', '2025', '2024', '2023'].map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1.5 rounded-lg text-xs font-grotesk font-bold tracking-wide transition-all ${
                  selectedYear === y
                    ? 'bg-gradient-to-br from-neuralPurple to-neuralMagenta text-white shadow-neural-glow'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel rounded-3xl p-12 border border-white/5 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-neuralPurple" />
          <span className="text-xs font-mono text-zinc-500">Querying contribution collections...</span>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Calendar Grid Container */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 relative overflow-hidden bg-[#0A0816]/60">
            
            {/* Live Hover Info Display Panel - Fixes overlap & clipping */}
            <div className="flex justify-between items-center mb-5 h-6 font-mono text-xs select-none">
              {hoveredDay ? (
                <div className="flex items-center gap-2 text-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full animate-ping bg-neuralPurple" />
                  <span>{getTooltipText(hoveredDay)}</span>
                </div>
              ) : (
                <div className="text-zinc-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-zinc-650" />
                  <span>Hover over blocks to inspect daily commits</span>
                </div>
              )}
            </div>

            {/* Scrollable grid wrapper */}
            <div data-lenis-prevent className="overflow-x-auto suggested-scroll pb-4">
              {renderCalendarGrid()}
            </div>

            {/* Informer Legend */}
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Color legends */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10.5px] font-sans text-zinc-400 select-none">
                
                {/* Personal Legend */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-[2px]">
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#453000' : '#4d0b2f' }} />
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#715200' : '#861953' }} />
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#ca8a04' : '#c2185b' }} />
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#facc15' : '#ec4899' }} />
                  </div>
                  <span>Personal Commits</span>
                </div>

                {/* Work Legend */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-[2px]">
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#0c2340' : '#083344' }} />
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#1e3a8a' : '#0e7490' }} />
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#2563eb' : '#06b6d4' }} />
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#60a5fa' : '#22d3ee' }} />
                  </div>
                  <span>Professional/Work</span>
                </div>

                {/* Mixed Legend */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-[2px]">
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#3f3f46' : '#451a03' }} />
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#71717a' : '#9a3412' }} />
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#a1a1aa' : '#ea580c' }} />
                    <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#f4f4f5' : '#f97316' }} />
                  </div>
                  <span>Mixed Activity</span>
                </div>
              </div>

              {/* Min/Max legend indicator */}
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-550 select-none">
                <span>Less</span>
                <div className="w-[10px] h-[10px] rounded-[1.5px] bg-white/5" />
                <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#0c2340' : '#083344' }} />
                <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#ca8a04' : '#c2185b' }} />
                <div className="w-[10px] h-[10px] rounded-[1.5px]" style={{ backgroundColor: isColorBlind ? '#f4f4f5' : '#f97316' }} />
                <span>More</span>
              </div>

            </div>
          </div>

          {/* Sync Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Personal commits card */}
            <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-zinc-550 uppercase tracking-wider mb-1">Personal Activity</div>
                <div className="text-2xl font-grotesk font-bold text-white tracking-tight">{currentSummary.personal} commits</div>
              </div>
              <div 
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: isColorBlind ? 'rgba(250,204,21,0.1)' : 'rgba(236,72,153,0.1)',
                  borderColor: isColorBlind ? 'rgba(250,204,21,0.2)' : 'rgba(236,72,153,0.2)',
                  color: isColorBlind ? '#facc15' : '#ec4899'
                }}
              >
                <GitBranch className="w-4 h-4" />
              </div>
            </div>

            {/* Work commits card */}
            <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-zinc-550 uppercase tracking-wider mb-1">Professional Activity</div>
                <div className="text-2xl font-grotesk font-bold text-white tracking-tight">{currentSummary.work} commits</div>
              </div>
              <div 
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: isColorBlind ? 'rgba(96,165,250,0.1)' : 'rgba(34,211,238,0.1)',
                  borderColor: isColorBlind ? 'rgba(96,165,250,0.2)' : 'rgba(34,211,238,0.2)',
                  color: isColorBlind ? '#60a5fa' : '#22d3ee'
                }}
              >
                <Layers className="w-4 h-4" />
              </div>
            </div>

            {/* Combined commits card */}
            <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-zinc-550 uppercase tracking-wider mb-1">Combined Synapses</div>
                <div className="text-2xl font-grotesk font-bold text-white tracking-tight">{currentSummary.total} commits</div>
              </div>
              <div 
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: isColorBlind ? 'rgba(244,244,245,0.1)' : 'rgba(249,115,22,0.1)',
                  borderColor: isColorBlind ? 'rgba(244,244,245,0.2)' : 'rgba(249,115,22,0.2)',
                  color: isColorBlind ? '#f4f4f5' : '#f97316'
                }}
              >
                <Calendar className="w-4 h-4" />
              </div>
            </div>

          </div>

          {/* Monthly update disclaimer */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.01] border border-white/5 text-[11px] text-zinc-500 font-mono select-none">
            <Info className="w-3.5 h-3.5 text-neuralPurple shrink-0" />
            <span>Activity synapse log database synced locally. Will be updated on 1st of every month.</span>
          </div>

        </div>
      )}

    </section>
  );
};
