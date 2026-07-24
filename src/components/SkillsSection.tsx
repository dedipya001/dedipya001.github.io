import React, { useState } from 'react';
import { Cpu, Server, Layout, Database, Cloud, Code } from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  cluster: 'ai' | 'backend' | 'frontend' | 'database' | 'cloud' | 'language';
  // Positions in percentage of coordinate space (0-100)
  x: number;
  y: number;
  connections: string[];
}

const SKILL_CLUSTERS = {
  ai: { label: 'AI & Machine Learning', color: '#8B5CF6', icon: Cpu },
  backend: { label: 'Backend Engineering', color: '#06B6D4', icon: Server },
  frontend: { label: 'Frontend Development', color: '#EC4899', icon: Layout },
  database: { label: 'Databases', color: '#3B82F6', icon: Database },
  cloud: { label: 'Cloud & DevOps', color: '#F59E0B', icon: Cloud },
  language: { label: 'Languages', color: '#10B981', icon: Code },
};

const SKILL_NODES: SkillNode[] = [
  // Languages Cluster
  { id: 'python', name: 'Python', cluster: 'language', x: 25, y: 30, connections: ['fastapi', 'rag', 'ml', 'cv'] },
  { id: 'js', name: 'JavaScript', cluster: 'language', x: 75, y: 35, connections: ['typescript', 'nodejs', 'react'] },
  { id: 'typescript', name: 'TypeScript', cluster: 'language', x: 85, y: 25, connections: ['js', 'nodejs', 'react'] },
  { id: 'cpp', name: 'C/C++', cluster: 'language', x: 15, y: 40, connections: ['dsa'] },
  { id: 'bash', name: 'Bash', cluster: 'language', x: 10, y: 60, connections: ['devops', 'terraform'] },

  // AI & Concepts Cluster
  { id: 'rag', name: 'RAG', cluster: 'ai', x: 42, y: 15, connections: ['python', 'llm', 'mongodb', 'fastapi'] },
  { id: 'llm', name: 'LLMs', cluster: 'ai', x: 30, y: 12, connections: ['python', 'rag'] },
  { id: 'ml', name: 'Machine Learning', cluster: 'ai', x: 15, y: 22, connections: ['python', 'cv'] },
  { id: 'cv', name: 'Computer Vision', cluster: 'ai', x: 10, y: 12, connections: ['python', 'ml'] },
  { id: 'dsa', name: 'DSA', cluster: 'ai', x: 25, y: 55, connections: ['cpp', 'python'] },
  { id: 'os_net', name: 'OS & Networks', cluster: 'ai', x: 15, y: 80, connections: ['bash', 'devops'] },

  // Backend Cluster
  { id: 'nodejs', name: 'Node.js', cluster: 'backend', x: 62, y: 65, connections: ['express', 'mongodb', 'js', 'react'] },
  { id: 'express', name: 'Express.js', cluster: 'backend', x: 52, y: 80, connections: ['nodejs', 'mongodb'] },
  { id: 'fastapi', name: 'FastAPI', cluster: 'backend', x: 40, y: 45, connections: ['python', 'rag', 'mongodb'] },
  
  // Database Cluster
  { id: 'mongodb', name: 'MongoDB', cluster: 'database', x: 50, y: 30, connections: ['nodejs', 'express', 'fastapi', 'rag', 'sql'] },
  { id: 'sql', name: 'SQL / Postgres', cluster: 'database', x: 65, y: 25, connections: ['mongodb', 'nodejs'] },

  // Cloud & DevOps
  { id: 'devops', name: 'DevOps', cluster: 'cloud', x: 80, y: 50, connections: ['aws', 'terraform', 'docker'] },
  { id: 'terraform', name: 'Terraform', cluster: 'cloud', x: 88, y: 65, connections: ['devops', 'aws'] },
  { id: 'aws', name: 'AWS Cloud', cluster: 'cloud', x: 92, y: 45, connections: ['devops', 'terraform'] },
  { id: 'docker', name: 'Docker', cluster: 'cloud', x: 74, y: 78, connections: ['devops', 'nodejs'] },
  { id: 'grafana', name: 'Grafana / Prometheus', cluster: 'cloud', x: 94, y: 82, connections: ['aws', 'devops'] },
  { id: 'n8n', name: 'n8n & Codex', cluster: 'cloud', x: 92, y: 12, connections: ['typescript'] },

  // Frontend Cluster
  { id: 'react', name: 'React.js', cluster: 'frontend', x: 74, y: 92, connections: ['nodejs', 'js', 'typescript'] }
];

export const SkillsSection: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getLineOpacity = (n1: SkillNode, n2: SkillNode) => {
    if (!hoveredNode) return 0.15;
    if (hoveredNode === n1.id || hoveredNode === n2.id) {
      // If the line connects to the hovered node, light it up
      const isConnected = n1.connections.includes(n2.id) || n2.connections.includes(n1.id);
      return isConnected ? 0.75 : 0.05;
    }
    return 0.05;
  };

  const getLineColor = (n1: SkillNode, n2: SkillNode) => {
    if (hoveredNode === n1.id || hoveredNode === n2.id) {
      const activeNode = SKILL_NODES.find(n => n.id === hoveredNode);
      if (activeNode) {
        return SKILL_CLUSTERS[activeNode.cluster].color;
      }
    }
    return 'rgba(255, 255, 255, 0.1)';
  };

  const isNodeDimmed = (node: SkillNode) => {
    if (!hoveredNode) return false;
    if (hoveredNode === node.id) return false;
    
    // Node is not dimmed if it connects to the hovered node
    const hoveredObj = SKILL_NODES.find(n => n.id === hoveredNode);
    const isConnected = hoveredObj?.connections.includes(node.id) || node.connections.includes(hoveredNode);
    return !isConnected;
  };

  return (
    <section id="skills" className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
            Skill Network <span className="text-neuralPurple">.</span>
          </h2>
          <p className="text-zinc-500 font-sans text-sm uppercase tracking-widest font-semibold">
            Interactive Synaptic Map
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {Object.entries(SKILL_CLUSTERS).map(([key, cluster]) => {
            const ClusterIcon = cluster.icon;
            return (
              <span key={key} className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cluster.color }} />
                <ClusterIcon className="w-3.5 h-3.5" style={{ color: cluster.color }} />
                <span>{cluster.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Network Container */}
      <div className="glass-panel rounded-3xl p-4 sm:p-8 border border-white/5 relative min-h-[480px] md:min-h-[580px] select-none overflow-hidden">
        
        {/* Connection Synapses Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {SKILL_NODES.map((n1) => {
            return n1.connections.map((connId) => {
              const n2 = SKILL_NODES.find(n => n.id === connId);
              if (!n2 || n1.id > n2.id) return null; // Avoid duplicate lines

              const x1 = `${n1.x}%`;
              const y1 = `${n1.y}%`;
              const x2 = `${n2.x}%`;
              const y2 = `${n2.y}%`;

              const opacity = getLineOpacity(n1, n2);
              const color = getLineColor(n1, n2);
              const isHoveredConnection = hoveredNode === n1.id || hoveredNode === n2.id;

              return (
                <line
                  key={`${n1.id}-${n2.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={isHoveredConnection ? 1.5 : 0.8}
                  strokeOpacity={opacity}
                  className="transition-all duration-300"
                />
              );
            });
          })}
        </svg>

        {/* Interactive Nodes Layer */}
        {SKILL_NODES.map((node) => {
          const clusterInfo = SKILL_CLUSTERS[node.cluster];
          const isDimmed = isNodeDimmed(node);
          const isHovered = hoveredNode === node.id;
          
          return (
            <div
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 interactive-node"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                opacity: isDimmed ? 0.35 : 1,
                transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`,
              }}
            >
              {/* Glowing Node Button */}
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#050816] border transition-all"
                style={{ 
                  borderColor: isHovered ? clusterInfo.color : 'rgba(255,255,255,0.08)',
                  boxShadow: isHovered ? `0 0 18px ${clusterInfo.color}40` : 'none'
                }}
              >
                {/* Cluster dot indicator */}
                <span 
                  className="w-1.5 h-1.5 rounded-full shrink-0" 
                  style={{ 
                    backgroundColor: clusterInfo.color,
                    boxShadow: isHovered ? `0 0 8px ${clusterInfo.color}` : 'none'
                  }}
                />
                <span className="font-grotesk text-xs font-semibold text-zinc-100 whitespace-nowrap">
                  {node.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Desktop Helper Text */}
        <div className="absolute bottom-4 left-6 text-[10px] text-zinc-500 font-sans tracking-wide pointer-events-none hidden md:block">
          Hover over nodes to illuminate their semantic relationships and dependencies.
        </div>
      </div>
    </section>
  );
};
