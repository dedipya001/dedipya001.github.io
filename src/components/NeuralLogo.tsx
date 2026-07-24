import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NeuralLogoProps {
  size?: number;
  showText?: boolean;
  compact?: boolean;
}

// Neural nodes that form the letter "D"
// Positioned on a 0-100 viewBox to trace a recognizable "D" shape
const NODES = [
  // Vertical spine of D (left side)
  { id: 0, cx: 22, cy: 12 },
  { id: 1, cx: 20, cy: 32 },
  { id: 2, cx: 18, cy: 52 },
  { id: 3, cx: 20, cy: 72 },
  { id: 4, cx: 22, cy: 90 },
  // Curved belly of D (right side arc)
  { id: 5, cx: 48, cy: 16 },
  { id: 6, cx: 70, cy: 30 },
  { id: 7, cx: 78, cy: 50 },
  { id: 8, cx: 70, cy: 70 },
  { id: 9, cx: 48, cy: 84 },
  // Internal cross-connections (dendrite bridges)
  { id: 10, cx: 42, cy: 42 },
  { id: 11, cx: 50, cy: 55 },
];

// Synaptic connections between the nodes — curved paths
const SYNAPSES = [
  // Spine
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Top arc
  [0, 5], [5, 6], [6, 7],
  // Bottom arc
  [7, 8], [8, 9], [9, 4],
  // Internal dendrites
  [1, 10], [10, 6],
  [2, 11], [11, 7],
  [3, 11], [10, 5],
  [10, 11],
];

const generateCurvePath = (x1: number, y1: number, x2: number, y2: number): string => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  // Add slight curve offset perpendicular to the line
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const offset = len * 0.15;
  const cpX = midX + (dy / len) * offset;
  const cpY = midY - (dx / len) * offset;
  return `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`;
};

export const NeuralLogo: React.FC<NeuralLogoProps> = ({ size = 36, showText = false, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-3 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="overflow-visible"
        >
          <defs>
            {/* Glow filter for nodes */}
            <filter id="neural-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Stronger glow for hover pulse */}
            <filter id="neural-glow-strong" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient for synapses */}
            <linearGradient id="synapse-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.6" />
            </linearGradient>

            {/* Radial gradient for nodes */}
            <radialGradient id="node-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#C084FC" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
            </radialGradient>
          </defs>

          {/* Synaptic connections */}
          {SYNAPSES.map(([fromIdx, toIdx], i) => {
            const from = NODES[fromIdx];
            const to = NODES[toIdx];
            const path = generateCurvePath(from.cx, from.cy, to.cx, to.cy);

            return (
              <g key={`synapse-${i}`}>
                {/* Base synapse line */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke="url(#synapse-gradient)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isHovered ? 0.9 : 0.5 }}
                  transition={{
                    pathLength: { duration: 1.2, delay: i * 0.06, ease: 'easeInOut' },
                    opacity: { duration: 0.4 },
                  }}
                />

                {/* Traveling electrical pulse on hover */}
                {isHovered && (
                  <motion.circle
                    r="1.8"
                    fill="#ffffff"
                    filter="url(#neural-glow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.08,
                      repeat: Infinity,
                      repeatDelay: 0.8,
                    }}
                  >
                    <animateMotion
                      dur={`${1.0 + i * 0.05}s`}
                      repeatCount="indefinite"
                      path={path}
                    />
                  </motion.circle>
                )}
              </g>
            );
          })}

          {/* Neural nodes */}
          {NODES.map((node, i) => {
            const isSpine = i <= 4;
            const baseRadius = isSpine ? 3.8 : (i >= 10 ? 2.5 : 3.2);

            return (
              <g key={`node-${node.id}`}>
                {/* Outer glow halo */}
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={baseRadius * 2.5}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="0.3"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isHovered ? [0.15, 0.35, 0.15] : [0.05, 0.15, 0.05],
                    scale: 1,
                  }}
                  transition={{
                    opacity: { duration: 2.5, repeat: Infinity, delay: i * 0.15 },
                    scale: { duration: 0.6, delay: 0.8 + i * 0.05 },
                  }}
                />

                {/* Core glowing node */}
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  fill="url(#node-gradient)"
                  filter={isHovered ? 'url(#neural-glow-strong)' : 'url(#neural-glow)'}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{
                    r: isHovered ? baseRadius * 1.15 : baseRadius,
                    opacity: 1,
                  }}
                  transition={{
                    r: {
                      type: 'spring',
                      stiffness: 200,
                      damping: 12,
                      delay: 0.8 + i * 0.06,
                    },
                    opacity: { duration: 0.4, delay: 0.8 + i * 0.06 },
                  }}
                />

                {/* White highlight dot */}
                <motion.circle
                  cx={node.cx - baseRadius * 0.25}
                  cy={node.cy - baseRadius * 0.25}
                  r={baseRadius * 0.3}
                  fill="#ffffff"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Subtle ambient breathing glow behind the logo */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Text label */}
      {showText && (
        <div className={compact ? '' : ''}>
          <h1 className={`font-grotesk font-bold tracking-wider text-white leading-tight ${compact ? 'text-[10px]' : 'text-xs'}`}>
            COGNITIVE VAULT
          </h1>
          <p className={`text-zinc-500 font-sans tracking-wide uppercase ${compact ? 'text-[8px]' : 'text-[9px]'}`}>
            Living Knowledge Network
          </p>
        </div>
      )}
    </div>
  );
};
