import React from 'react';
import { Mail, Linkedin, Github, Phone, MapPin, Calendar, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const contactLinks = [
    { icon: Mail, label: 'Email', value: 'dedipyagoswami001@gmail.com', href: 'mailto:dedipyagoswami001@gmail.com', color: '#8B5CF6' },
    { icon: Phone, label: 'Phone', value: '+91-9832994010', href: 'tel:+919832994010', color: '#10B981' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/dedipya-goswami001', href: 'https://www.linkedin.com/in/dedipya-goswami001/', color: '#06B6D4' },
    { icon: Github, label: 'GitHub', value: 'github.com/dedipya001', href: 'https://github.com/dedipya001', color: '#EC4899' }
  ];

  return (
    <section id="contact" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative flex flex-col justify-center">
      
      {/* Neural pulse animation stylesheet locally inside section */}
      <style>{`
        @keyframes radar-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .pulse-ring {
          animation: radar-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
      `}</style>

      <div className="mb-12">
        <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
          Initialize Connection <span className="text-neuralPurple">.</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
          Synaptic Handshake
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Availability details */}
        <div className="md:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-neuralMagenta/5 to-transparent pointer-events-none rounded-bl-full" />

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available for Roles</span>
            </div>

            <div>
              <h3 className="font-grotesk font-bold text-lg text-white mb-4">Availability Summary</h3>
              <div className="space-y-3.5 font-sans text-sm text-zinc-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-neuralPurple shrink-0" />
                  <span>Andhra Pradesh, India (Open to Remote / Relocation)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-neuralMagenta shrink-0" />
                  <span>Immediate Availability</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-zinc-500 font-sans">
            Ready to deploy scalable AI & backend infrastructure.
          </div>
        </div>

        {/* Action Connect Buttons */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactLinks.map((link, idx) => {
            const LinkIcon = link.icon;
            
            return (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col justify-between p-6 rounded-3xl glass-panel border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-[#0B1120]/40"
                style={{ '--hover-bg': `${link.color}15`, '--hover-border': `${link.color}50` } as React.CSSProperties}
              >
                {/* Concentric radar pulse ring visible on hover */}
                <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border pulse-ring" style={{ borderColor: link.color }} />
                </div>

                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 bg-white/5 text-zinc-400 group-hover:text-white transition-all z-10 group-hover:border-[var(--hover-border)] group-hover:bg-[var(--hover-bg)]">
                  <LinkIcon className="w-4.5 h-4.5" />
                </div>

                <div className="mt-6 z-10">
                  <span className="text-[10px] text-zinc-500 font-grotesk tracking-widest uppercase font-semibold">
                    {link.label}
                  </span>
                  <p className="font-mono text-xs text-zinc-300 mt-0.5 group-hover:text-white transition-colors">
                    {link.value}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
