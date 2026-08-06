import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  BookOpen, ExternalLink, ThumbsUp, MessageSquare, Search, 
  Clock, Calendar, X, Sparkles, RefreshCw, Rss, ArrowUpRight, Check,
  Share2, Eye, Sparkle
} from 'lucide-react';

export interface MediumArticle {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail: string;
  description: string;
  categories: string[];
  readTime: string;
  claps: number;
  responses: number;
  content: string;
}

export const BlogSection: React.FC = () => {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<MediumArticle | null>(null);
  const [activeTab, setActiveTab] = useState<'reader' | 'medium'>('reader');
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Local claps state management synced with user clicks
  const [localClaps, setLocalClaps] = useState<{ [key: string]: { count: number; clapped: boolean } }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/medium-blogs');
        if (!res.ok) throw new Error('Failed to fetch medium articles');
        const json = await res.json();
        
        if (json.articles && Array.isArray(json.articles)) {
          setArticles(json.articles);
          
          // Initialize local claps map
          const initialClaps: { [key: string]: { count: number; clapped: boolean } } = {};
          json.articles.forEach((art: MediumArticle) => {
            initialClaps[art.id] = { count: art.claps || 120, clapped: false };
          });
          setLocalClaps(initialClaps);
        }
      } catch (err) {
        console.error('Error fetching Medium blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter categories dynamically from loaded articles
  const allCategories = ['All', ...Array.from(new Set(articles.flatMap(a => a.categories)))];

  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.categories.includes(selectedCategory);
    const matchesSearch = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleClap = (e: React.MouseEvent, article: MediumArticle) => {
    e.stopPropagation();
    
    // Trigger confetti celebration!
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981']
      });
    } catch (err) {}

    setLocalClaps(prev => {
      const current = prev[article.id] || { count: article.claps, clapped: false };
      const newClapped = !current.clapped;
      const newCount = newClapped ? current.count + 1 : current.count - 1;
      return {
        ...prev,
        [article.id]: { count: newCount, clapped: newClapped }
      };
    });

    // Also open Medium link in a new window to clap directly on Medium account
    window.open(article.link, '_blank');
  };

  const handleComment = (e: React.MouseEvent, article: MediumArticle) => {
    e.stopPropagation();
    // Open medium article with #responses anchor to comment directly on Medium account
    window.open(`${article.link}#responses`, '_blank');
  };

  const handleShare = (article: MediumArticle) => {
    navigator.clipboard.writeText(article.link);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight > clientHeight) {
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }
  };

  return (
    <section id="blogs" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
      
      {/* Header & Medium Sync Indicator */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              Synced with Medium @dedipyagoswami001
            </span>
          </div>
          <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Medium Synapses <span className="text-neuralPurple">.</span>
          </h2>
          <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold mt-1">
            Articles & Publications on Medium
          </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles & topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-neuralPurple transition-all"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-grotesk font-bold tracking-wide transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-neuralPurple to-neuralMagenta text-white border-transparent shadow-neural-glow'
                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="glass-panel rounded-3xl p-12 border border-white/5 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-neuralPurple" />
          <span className="text-xs font-mono text-zinc-500">Retrieving articles from Medium feed...</span>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center text-zinc-500 font-mono text-xs">
          No articles matching your search query.
        </div>
      ) : (
        /* Blog Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => {
            const clapInfo = localClaps[article.id] || { count: article.claps, clapped: false };

            return (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  setSelectedArticle(article);
                  setActiveTab('reader');
                  setScrollProgress(0);
                }}
                className="group glass-panel rounded-3xl overflow-hidden border border-white/5 hover:border-neuralPurple/40 transition-all duration-300 flex flex-col justify-between cursor-pointer bg-[#0A0816]/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]"
              >
                {/* Thumbnail Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0816] via-[#0A0816]/40 to-transparent" />
                  
                  {/* Top Read Time & Medium Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
                      <Clock className="w-3 h-3 text-neuralPurple" />
                      {article.readTime}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-pink-400">
                      <Rss className="w-3 h-3" />
                      Medium
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {article.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[10px] font-mono text-zinc-400"
                        >
                          #{cat}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="font-grotesk font-bold text-lg text-white group-hover:text-neuralPurple transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{article.pubDate}</span>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Clap Button */}
                      <button
                        onClick={(e) => handleClap(e, article)}
                        title="Clap on Medium"
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
                          clapInfo.clapped
                            ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                            : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{clapInfo.count}</span>
                      </button>

                      {/* Comment Button */}
                      <button
                        onClick={(e) => handleComment(e, article)}
                        title="Comment on Medium account @dedipyagoswami001"
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-xs font-mono"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{article.responses}</span>
                      </button>

                      {/* Read button */}
                      <span className="p-1 text-neuralPurple group-hover:translate-x-1 transition-transform">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Medium Account Relationship Banner */}
      <div className="mt-12 glass-panel rounded-3xl p-6 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-neuralPurple/10 via-[#0A0816] to-neuralMagenta/10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neuralPurple to-neuralMagenta flex items-center justify-center text-white shrink-0 shadow-neural-glow">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-grotesk font-bold text-sm text-white">Follow Dedipya Goswami on Medium</h4>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Read in-depth software engineering insights, system architecture patterns, and DevOps guides.
            </p>
          </div>
        </div>

        <a
          href="https://medium.com/@dedipyagoswami001"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-grotesk font-bold text-xs hover:bg-zinc-200 transition-all shrink-0 shadow-lg"
        >
          <span>Visit Medium Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Full Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto select-none"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl glass-panel rounded-3xl border border-white/10 overflow-hidden bg-[#060814] max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(139,92,246,0.18)]"
            >
              {/* Top Reading Progress Bar */}
              <div className="w-full h-1 bg-white/5 relative shrink-0">
                <div 
                  className="h-full bg-gradient-to-r from-neuralPurple via-pink-500 to-neuralMagenta transition-all duration-150 shadow-[0_0_10px_#EC4899]"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              {/* Modal Header Bar */}
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#090C1F]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#EC4899]" />
                  <span className="font-mono text-xs font-semibold text-zinc-300 uppercase tracking-widest">
                    Neural Blog Reader
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Tab Selector */}
                  <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                    <button
                      onClick={() => setActiveTab('reader')}
                      className={`px-3 py-1 rounded-lg font-grotesk font-semibold transition-all ${
                        activeTab === 'reader'
                          ? 'bg-gradient-to-r from-neuralPurple to-purple-600 text-white shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Article Reader
                    </button>
                    <button
                      onClick={() => setActiveTab('medium')}
                      className={`px-3 py-1 rounded-lg font-grotesk font-semibold transition-all ${
                        activeTab === 'medium'
                          ? 'bg-gradient-to-r from-pink-500 to-neuralMagenta text-white shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Medium Account Sync
                    </button>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reader Body Content */}
              <div 
                data-lenis-prevent 
                onScroll={handleReaderScroll}
                className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 select-text"
              >
                {activeTab === 'reader' ? (
                  <>
                    {/* Header Info */}
                    <div className="space-y-4">
                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-2">
                        {selectedArticle.categories.map((c, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg bg-neuralPurple/10 border border-neuralPurple/30 text-xs font-mono font-medium text-pink-400 shadow-sm"
                          >
                            #{c}
                          </span>
                        ))}
                      </div>

                      {/* Main Title */}
                      <h1 className="font-grotesk font-extrabold text-2xl sm:text-4xl text-white leading-snug tracking-tight">
                        {selectedArticle.title}
                      </h1>

                      {/* Author & Meta Row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-b border-white/10 pb-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neuralPurple via-pink-500 to-neuralMagenta p-[1.5px] shadow-sm">
                            <div className="w-full h-full rounded-full bg-[#090C1F] flex items-center justify-center text-white font-bold text-[11px]">
                              DG
                            </div>
                          </div>
                          <span className="text-zinc-200 font-semibold">{selectedArticle.author}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{selectedArticle.pubDate}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-neuralPurple" />
                          <span>{selectedArticle.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hero Thumbnail with dark gradient border frame */}
                    <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 w-full bg-zinc-950 border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.12)]">
                      <img
                        src={selectedArticle.thumbnail}
                        alt={selectedArticle.title}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060814] via-transparent to-black/30 pointer-events-none" />
                    </div>

                    {/* HTML Article Content using neural-article-body styling */}
                    <div 
                      className="neural-article-body"
                      dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                    />
                  </>
                ) : (
                  /* Medium Account Sync View */
                  <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-pink-950/20 via-[#090C1F] to-purple-950/20 text-center space-y-4 shadow-xl">
                      <Rss className="w-10 h-10 text-pink-400 mx-auto animate-bounce" />
                      <h3 className="font-grotesk font-bold text-xl text-white">Direct Relationship with Medium Account</h3>
                      <p className="font-sans text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
                        This article is published on Medium by <strong className="text-white">@dedipyagoswami001</strong>. 
                        Your applause (claps) and comments directly engage with Dedipya's official Medium profile!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Action Box 1: Clap on Medium */}
                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between gap-6 hover:border-pink-500/40 transition-all">
                        <div>
                          <ThumbsUp className="w-7 h-7 text-pink-400 mb-3" />
                          <h4 className="font-grotesk font-bold text-base text-white">Clap on Medium Profile</h4>
                          <p className="font-sans text-xs text-zinc-400 mt-1.5 leading-relaxed">
                            Show support directly on Medium to boost post visibility and reach.
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleClap(e, selectedArticle)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-grotesk font-bold text-xs hover:shadow-[0_0_20px_#EC4899] transition-all flex items-center justify-center gap-2"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Clap on Medium</span>
                        </button>
                      </div>

                      {/* Action Box 2: Comment on Medium */}
                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between gap-6 hover:border-neuralPurple/40 transition-all">
                        <div>
                          <MessageSquare className="w-7 h-7 text-neuralPurple mb-3" />
                          <h4 className="font-grotesk font-bold text-base text-white">Leave a Response / Comment</h4>
                          <p className="font-sans text-xs text-zinc-400 mt-1.5 leading-relaxed">
                            Join the discussion directly under Dedipya's Medium post.
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleComment(e, selectedArticle)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-neuralPurple to-purple-600 text-white font-grotesk font-bold text-xs hover:shadow-[0_0_20px_#8B5CF6] transition-all flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Comment on Medium</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-6 border-t border-white/10 bg-[#090C1F]/95 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                  {/* Clap button */}
                  <button
                    onClick={(e) => handleClap(e, selectedArticle)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:scale-105 transition-all font-semibold"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{localClaps[selectedArticle.id]?.count || selectedArticle.claps} Claps</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(selectedArticle)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all font-medium"
                  >
                    {copiedId === selectedArticle.id ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-neuralPurple" />
                        <span>Share Article</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Medium Link */}
                <a
                  href={selectedArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-grotesk font-bold text-xs transition-all shadow-lg hover:shadow-neural-glow"
                >
                  <span>Open Full Medium Post</span>
                  <ExternalLink className="w-4 h-4 text-pink-400" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

