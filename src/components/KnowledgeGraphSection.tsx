import React, { useEffect, useRef, useState } from 'react';
import { Network, Search, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'project' | 'tech' | 'experience' | 'education' | 'achievement';
  details: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  radius?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

const NODES_DATA: GraphNode[] = [
  // Projects
  { id: 'p1', label: 'Encye RAG', type: 'project', details: 'Python package leveraging MongoDB Atlas Vector Search and LangChain. Achieved 40% document review speedup.' },
  { id: 'p2', label: 'CPQ AI Assistant', type: 'project', details: 'FastAPI service matching quoting entities from conversational logs, creating formatted JSON payloads.' },
  { id: 'p3', label: 'AI Portfolio', type: 'project', details: 'Full-stack React app utilizing a local vector-space indexing search engine and Canvas background.' },
  { id: 'p4', label: 'URL Shortener', type: 'project', details: 'Microservice-style URL redirector with phishing checks and sub-15ms redirection caching.' },
  
  // Technologies
  { id: 't1', label: 'Python', type: 'tech', details: 'Primary language for AI agent pipelines, FastAPI services, data processing, and scripting.' },
  { id: 't2', label: 'LangChain', type: 'tech', details: 'Framework for assembling prompt chains, chunking texts, and routing RAG vector parameters.' },
  { id: 't3', label: 'FastAPI', type: 'tech', details: 'High-performance python framework for serving REST APIs and system validation layers.' },
  { id: 't4', label: 'MongoDB', type: 'tech', details: 'NoSQL document database, utilized for vector indexes and storing unstructured text blocks.' },
  { id: 't5', label: 'Node.js', type: 'tech', details: 'Server runtime for structuring REST APIs, microservices, and tool automation.' },
  { id: 't6', label: 'Express', type: 'tech', details: 'Node framework for composing lightweight request middleware routers and static servers.' },
  { id: 't7', label: 'React', type: 'tech', details: 'Frontend framework for building declarative, high-fidelity UI components.' },
  { id: 't8', label: 'Docker', type: 'tech', details: 'Containerization tool to build stable dev-to-prod pipeline environments.' },
  { id: 't9', label: 'AWS', type: 'tech', details: 'Cloud hosting provider, utilizing EC2 instances, S3 storage, and database replicas.' },

  // Experiences
  { id: 'e1', label: 'Selegic Inc', type: 'experience', details: 'AI & Backend Developer at Selegic Inc. Spearheading Encye RAG integration, MCP servers, and Salesforce CPQ Assistant.' },
  { id: 'e2', label: 'Belzabar Intern', type: 'experience', details: 'DevOps Engineer Intern at Belzabar Software Design. Automated CI/CD pipelines, IaC Terraform, and AWS observability.' },
  { id: 'e3', label: 'Dot Sphere Intern', type: 'experience', details: 'Full Stack Web Developer Intern at Dot Sphere. Built interactive features and optimized SEO.' },

  // Education
  { id: 'ed1', label: 'B.Tech SRM AP', type: 'education', details: 'Computer Science & Engineering degree at SRM University AP. CGPA: 8.83/10 with 100% Scholarship.' },

  // Achievements
  { id: 'a1', label: '17+ Projects', type: 'achievement', details: 'Successfully built and delivered 17+ software projects covering web apps, backend APIs, and CLI tools.' },
  { id: 'a2', label: 'Hackathons', type: 'achievement', details: 'Participated in 2 national hackathons, building prototype engines under strict time constraints.' },
  { id: 'a3', label: '5+ Certificates', type: 'achievement', details: 'Earned certifications in cloud computing, server security, and web framework specializations.' }
];

const LINKS_DATA: GraphLink[] = [
  // Project to Tech
  { source: 'p1', target: 't1' },
  { source: 'p1', target: 't2' },
  { source: 'p1', target: 't3' },
  { source: 'p1', target: 't4' },
  { source: 'p2', target: 't1' },
  { source: 'p2', target: 't3' },
  { source: 'p3', target: 't7' },
  { source: 'p3', target: 't5' },
  { source: 'p3', target: 't6' },
  { source: 'p3', target: 't4' },
  { source: 'p4', target: 't5' },
  { source: 'p4', target: 't6' },
  { source: 'p4', target: 't4' },
  { source: 'p4', target: 't7' },

  // Experiences to Tech / Projects
  { source: 'e1', target: 'p1' },
  { source: 'e1', target: 'p2' },
  { source: 'e1', target: 't1' },
  { source: 'e1', target: 't3' },
  { source: 'e1', target: 't4' },
  { source: 'e1', target: 't9' },
  { source: 'e2', target: 't5' },
  { source: 'e2', target: 't6' },
  { source: 'e2', target: 't4' },
  { source: 'e2', target: 'p4' },
  { source: 'e3', target: 'a2' },

  // Education to Tech / Achievements
  { source: 'ed1', target: 't1' },
  { source: 'ed1', target: 't5' },
  { source: 'ed1', target: 'a1' },

  // Achievements to Projects
  { source: 'a1', target: 'p3' },
  { source: 'a3', target: 't9' }
];

const TYPE_COLORS = {
  project: '#8B5CF6',     // Electric Violet
  tech: '#EC4899',        // Magenta Plasma
  experience: '#A855F7',  // Neural Purple
  education: '#C084FC',   // Warm Lavender
  achievement: '#EC4899'  // Magenta Plasma
};

export const KnowledgeGraphSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(NODES_DATA[0]);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const nodesRef = useRef<GraphNode[]>([]);
  const isDraggingNode = useRef<GraphNode | null>(null);
  const isPanning = useRef(false);
  const startPan = useRef({ x: 0, y: 0 });

  // Initialize nodes on first render
  useEffect(() => {
    nodesRef.current = NODES_DATA.map((node, idx) => {
      // Circle layout initialization
      const angle = (idx / NODES_DATA.length) * Math.PI * 2;
      const radius = 200;
      return {
        ...node,
        x: window.innerWidth / 2 + Math.cos(angle) * radius,
        y: window.innerHeight / 2.5 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: node.type === 'project' || node.type === 'experience' ? 32 : 24
      };
    });
  }, []);

  // Physics simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const handleResize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const updatePhysics = () => {
      const nodes = nodesRef.current;
      const links = LINKS_DATA;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Repulsion force between all node pairs
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = (n2.x || 0) - (n1.x || 0);
          const dy = (n2.y || 0) - (n1.y || 0);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 180) {
            const force = (180 - dist) * 0.08;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (n1 !== isDraggingNode.current) {
              n1.vx = (n1.vx || 0) - fx;
              n1.vy = (n1.vy || 0) - fy;
            }
            if (n2 !== isDraggingNode.current) {
              n2.vx = (n2.vx || 0) + fx;
              n2.vy = (n2.vy || 0) + fy;
            }
          }
        }
      }

      // 2. Attraction forces along spring synapses
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        const dx = (targetNode.x || 0) - (sourceNode.x || 0);
        const dy = (targetNode.y || 0) - (sourceNode.y || 0);
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const strength = 0.035;
        const targetDist = 120;
        const force = (dist - targetDist) * strength;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (sourceNode !== isDraggingNode.current) {
          sourceNode.vx = (sourceNode.vx || 0) + fx;
          sourceNode.vy = (sourceNode.vy || 0) + fy;
        }
        if (targetNode !== isDraggingNode.current) {
          targetNode.vx = (targetNode.vx || 0) - fx;
          targetNode.vy = (targetNode.vy || 0) - fy;
        }
      });

      // 3. Center gravity pull
      const centerX = width / 2;
      const centerY = height / 2.2;
      nodes.forEach(node => {
        if (node === isDraggingNode.current) return;
        const dx = centerX - (node.x || 0);
        const dy = centerY - (node.y || 0);
        node.vx = (node.vx || 0) + dx * 0.0035;
        node.vy = (node.vy || 0) + dy * 0.0035;
      });

      // 4. Update coordinates & apply damping
      nodes.forEach(node => {
        if (node === isDraggingNode.current) return;
        node.x = (node.x || 0) + (node.vx || 0);
        node.y = (node.y || 0) + (node.vy || 0);
        node.vx = (node.vx || 0) * 0.85;
        node.vy = (node.vy || 0) * 0.85;
      });
    };

    const drawGraph = () => {
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Apply panning and zooming translations
      ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      const nodes = nodesRef.current;
      const links = LINKS_DATA;

      // Filter highlights
      const query = searchQuery.toLowerCase().trim();

      // Draw links
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        const isSourceMatch = query ? sourceNode.label.toLowerCase().includes(query) : false;
        const isTargetMatch = query ? targetNode.label.toLowerCase().includes(query) : false;
        const isHighlighted = query ? (isSourceMatch || isTargetMatch) : true;

        ctx.strokeStyle = isHighlighted ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = isHighlighted ? 1.2 : 0.6;
        ctx.beginPath();
        ctx.moveTo(sourceNode.x || 0, sourceNode.y || 0);
        ctx.lineTo(targetNode.x || 0, targetNode.y || 0);
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(node => {
        const isMatch = query ? node.label.toLowerCase().includes(query) : true;
        const isSelected = selectedNode?.id === node.id;
        const color = TYPE_COLORS[node.type];

        ctx.save();
        ctx.translate(node.x || 0, node.y || 0);

        // Dim if search query is active and this node is not a match
        const alpha = isMatch ? 1 : 0.25;

        // Outer glow on hover/selected
        if (isSelected) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
        }

        // Draw node backing circle
        ctx.fillStyle = isSelected ? color : 'rgba(11, 17, 32, 0.9)';
        ctx.strokeStyle = isSelected ? '#ffffff' : color;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, (node.radius || 20) * (isSelected ? 1.08 : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Remove shadow for text
        ctx.shadowBlur = 0;

        // Draw node icon label
        ctx.fillStyle = isSelected ? '#050816' : '#ffffff';
        ctx.font = `bold 10px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw abbreviated label inside node
        const labelText = node.label.length > 10 ? `${node.label.substring(0, 8)}..` : node.label;
        ctx.fillText(labelText, 0, 0);

        // Draw category above node
        if (isSelected || isMatch) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.font = '8px Space Grotesk';
          ctx.fillText(node.type.toUpperCase(), 0, - (node.radius || 20) - 8);
        }

        ctx.restore();
      });

      ctx.restore();
    };

    const tick = () => {
      updatePhysics();
      drawGraph();
      animFrame = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [searchQuery, selectedNode, zoom, offset]);

  // Click & Drag event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse coordinates back through zoom/pan translations
    const translatedX = ((mouseX - canvas.width / 2 - offset.x) / zoom) + canvas.width / 2;
    const translatedY = ((mouseY - canvas.height / 2 - offset.y) / zoom) + canvas.height / 2;

    // Check if clicked on a node
    const clickedNode = nodesRef.current.find(node => {
      const dx = (node.x || 0) - translatedX;
      const dy = (node.y || 0) - translatedY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < (node.radius || 20);
    });

    if (clickedNode) {
      isDraggingNode.current = clickedNode;
      setSelectedNode(clickedNode);
    } else {
      isPanning.current = true;
      startPan.current = { x: mouseX - offset.x, y: mouseY - offset.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDraggingNode.current) {
      // Dragging node
      const node = isDraggingNode.current;
      const translatedX = ((mouseX - canvas.width / 2 - offset.x) / zoom) + canvas.width / 2;
      const translatedY = ((mouseY - canvas.height / 2 - offset.y) / zoom) + canvas.height / 2;
      node.x = translatedX;
      node.y = translatedY;
      node.vx = 0;
      node.vy = 0;
    } else if (isPanning.current) {
      // Panning canvas
      setOffset({
        x: mouseX - startPan.current.x,
        y: mouseY - startPan.current.y
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingNode.current = null;
    isPanning.current = false;
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.45));
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <section id="graph" ref={containerRef} className="h-screen w-full relative z-10 flex flex-col justify-end">
      
      {/* Absolute canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Search & Actions overlay */}
      <div className="absolute top-6 left-6 right-6 flex flex-col sm:flex-row gap-4 justify-between items-start pointer-events-none">
        
        {/* Title */}
        <div className="pointer-events-auto bg-[#050816]/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neuralPurple/10 border border-neuralPurple/25">
            <Network className="w-5 h-5 text-neuralPurple animate-pulse" />
          </div>
          <div>
            <h2 className="font-grotesk font-bold text-base text-white leading-tight">Cognitive Network</h2>
            <p className="text-[10px] text-zinc-500 font-sans tracking-wide">Signature Interactive Map</p>
          </div>
        </div>

        {/* Controls and Search */}
        <div className="flex flex-wrap items-center gap-3 pointer-events-auto w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex items-center w-full sm:w-60">
            <Search className="absolute left-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search network nodes..."
              className="w-full bg-[#0A0816]/80 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-neuralPurple/30 transition-all font-sans"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 text-zinc-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Zoom controls */}
          <div className="flex bg-[#0B1120]/85 border border-white/5 rounded-xl p-1 shrink-0">
            <button onClick={handleZoomIn} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleZoomOut} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleReset} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Reset View">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Node Details Drawer overlay */}
      {selectedNode && (
        <div className="absolute bottom-24 lg:bottom-8 left-6 right-6 lg:left-auto lg:w-[380px] pointer-events-auto z-20">
          <div className="glass-panel border border-white/5 rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <span 
              className="text-[9px] uppercase tracking-widest font-bold font-grotesk px-2.5 py-0.5 rounded-md"
              style={{ backgroundColor: `${TYPE_COLORS[selectedNode.type]}20`, color: TYPE_COLORS[selectedNode.type] }}
            >
              {selectedNode.type}
            </span>

            <h3 className="font-grotesk font-bold text-xl text-white mt-3 mb-2">
              {selectedNode.label}
            </h3>

            <p className="text-zinc-300 font-sans text-sm leading-relaxed mb-4">
              {selectedNode.details}
            </p>

            <div className="text-[10px] text-zinc-600 font-sans border-t border-white/5 pt-3 flex justify-between">
              <span>Synapse Node: {selectedNode.id.toUpperCase()}</span>
              <span>Drag node to relocate</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
