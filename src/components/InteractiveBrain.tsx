import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface BrainRegion {
  id: string;
  name: string;
  subtitle: string;
  sectionId: string;
  color: string;
  // Bounding center coordinates in model space
  cx: number;
  cy: number;
  cz: number;
  index: number;
}

const REGIONS: BrainRegion[] = [
  // Left side labels (connect to Left Hemisphere)
  { id: 'projects', name: 'Projects', subtitle: 'Engineering Memories', sectionId: 'projects', color: '#8B5CF6', cx: -18, cy: 12, cz: 10, index: 0 },
  { id: 'experience', name: 'Experience', subtitle: 'Professional Cortex', sectionId: 'experience', color: '#C084FC', cx: -15, cy: -8, cz: 8, index: 1 },
  { id: 'skills', name: 'Skills', subtitle: 'Neural Connections', sectionId: 'skills', color: '#A855F7', cx: -12, cy: 0, cz: -5, index: 2 },
  { id: 'achievements', name: 'Achievements', subtitle: 'Milestones & Awards', sectionId: 'achievements', color: '#EC4899', cx: -18, cy: -18, cz: -4, index: 3 },
  
  // Right side labels (connect to Right Hemisphere / Stem)
  { id: 'mission', name: 'Current Mission', subtitle: 'Active Focus', sectionId: 'mission', color: '#EC4899', cx: 18, cy: 15, cz: 12, index: 4 },
  { id: 'learning', name: 'Learning', subtitle: 'Research & Growth', sectionId: 'research', color: '#8B5CF6', cx: 12, cy: 12, cz: -10, index: 5 },
  { id: 'leadership', name: 'Leadership', subtitle: 'Teams & Hackathons', sectionId: 'about', color: '#A855F7', cx: 15, cy: -2, cz: 5, index: 6 },
  { id: 'vision', name: 'Values & Vision', subtitle: 'Connect Synapse', sectionId: 'contact', color: '#C084FC', cx: 15, cy: -15, cz: -8, index: 7 }
];

export const InteractiveBrain: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvas3D = useRef<HTMLCanvasElement>(null);
  const canvas2D = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const targetCameraPos = useRef(new THREE.Vector3(0, 0, 155));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const animFrame = useRef<number>(0);
  const activeRegionRef = useRef<string | null>(null);
  activeRegionRef.current = activeRegion;

  useEffect(() => {
    const container = mountRef.current;
    const canvas = canvas3D.current;
    const overlay = canvas2D.current;
    if (!container || !canvas || !overlay) return;

    // Set canvas dimensions
    const width = container.clientWidth;
    const height = 480;
    canvas.width = width;
    canvas.height = height;
    overlay.width = width;
    overlay.height = height;

    // 1. Three.js Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
    camera.position.set(0, 0, 150);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // 2. Procedural Point Cloud Generation (3,500 particles)
    const particleCount = 3500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const regionIndices = new Float32Array(particleCount);

    const nodesData: { x: number; y: number; z: number; regionIndex: number; colorObj: THREE.Color }[] = [];

    const colorPalette = REGIONS.map(r => new THREE.Color(r.color));

    for (let i = 0; i < particleCount; i++) {
      let x = 0, y = 0, z = 0;
      let regionIndex = -1;

      // Partition: 82% Cerebrum hemispheres, 10% Cerebellum, 8% Brainstem
      const rand = Math.random();

      if (rand < 0.82) {
        // Cerebrum (Hemispheres) - Ellipsoid modulated by gyri harmonics
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        // Gyri sine folds
        const fold = 1.0 + 0.08 * Math.sin(16.0 * theta) * Math.cos(14.0 * phi);
        const rx = 34 * fold;
        const ry = 27 * fold;
        const rz = 24 * fold;

        x = rx * Math.sin(phi) * Math.cos(theta);
        y = ry * Math.cos(phi) + 5;
        z = rz * Math.sin(phi) * Math.sin(theta);

        // Hemispheric cleft separation
        const cleft = 1.8;
        if (x > 0) {
          x += cleft;
          // Right Hemisphere regions
          if (y > 10 && z > 8) regionIndex = 4; // mission
          else if (y > 10 && z < -4) regionIndex = 5; // learning
          else if (y < -10) regionIndex = 7; // vision
          else regionIndex = 6; // leadership
        } else {
          x -= cleft;
          // Left Hemisphere regions
          if (y > 8 && z > 6) regionIndex = 0; // projects
          else if (y < -5 && z > 2) regionIndex = 1; // experience
          else if (y < -12) regionIndex = 3; // achievements
          else regionIndex = 2; // skills
        }
      } else if (rand < 0.92) {
        // Cerebellum (Lower right back) - dense striated parallel horizontal rows
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.45;
        const r = 12 + Math.random() * 6;
        
        // Group into vertical layers
        const layerHeight = 2.4;
        y = -22 + (Math.floor(Math.random() * 6) - 3) * layerHeight + (Math.random() - 0.5) * 0.5;
        x = 16 + r * Math.sin(phi) * Math.cos(theta);
        z = -18 + r * Math.sin(phi) * Math.sin(theta);
        regionIndex = 6; // map to leadership/about
      } else {
        // Brainstem (Lower bottom cylinder)
        y = -20 - Math.random() * 25;
        const r = Math.random() * 5.5;
        const theta = Math.random() * Math.PI * 2;
        x = r * Math.cos(theta) - 1.0;
        z = r * Math.sin(theta) - 3.5;
        regionIndex = 1; // map to experience/timeline
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Assign region colors
      const region = REGIONS.find(r => r.index === regionIndex) || REGIONS[0];
      const colorObj = new THREE.Color(region.color);
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;

      regionIndices[i] = regionIndex;

      nodesData.push({ x, y, z, regionIndex, colorObj });
    }

    // 3. Synapses Connection Line Segments (15,000 links)
    const linePositions: number[] = [];
    const lineRegions: number[] = [];
    const maxDistance = 9.8;
    let connectionsCount = 0;

    // Build segment arrays by pairing nearby nodes
    for (let i = 0; i < particleCount; i += 2) {
      if (connectionsCount > 15000) break;
      const n1 = nodesData[i];
      for (let j = i + 1; j < particleCount; j += 3) {
        const n2 = nodesData[j];
        if (n1.regionIndex !== n2.regionIndex) continue; // keep connections intra-region for biological segmentation

        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dz = n1.z - n2.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDistance * maxDistance) {
          linePositions.push(n1.x, n1.y, n1.z);
          linePositions.push(n2.x, n2.y, n2.z);

          lineRegions.push(n1.regionIndex, n2.regionIndex);
          connectionsCount++;
        }
      }
    }

    // 4. Custom GPU Shaders (Bloom / Hover Glow)
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('aRegion', new THREE.BufferAttribute(regionIndices, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        uniform float uActiveRegion;
        uniform float uSearchPulse;
        uniform vec3 uPulseCenter;
        attribute float aRegion;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = color;
          
          float isActive = (uActiveRegion >= 0.0 && abs(aRegion - uActiveRegion) < 0.1) ? 1.0 : 0.0;
          
          // Noise wobble
          vec3 pos = position;
          pos.x += sin(uTime * 2.5 + position.y * 0.25) * 0.25;
          pos.y += cos(uTime * 2.0 + position.x * 0.25) * 0.25;
          
          // Spatial search wave pulse propagation
          if (uSearchPulse > 0.0) {
            float dist = distance(position, uPulseCenter);
            float wave = sin(dist * 0.45 - uTime * 12.0);
            if (wave > 0.8) {
              pos += normalize(position) * 1.5;
            }
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float size = 4.2;
          if (isActive > 0.5) {
            size *= 2.4;
            vAlpha = 1.0;
          } else if (uActiveRegion >= 0.0) {
            size *= 0.55;
            vAlpha = 0.14;
          } else {
            vAlpha = 0.55 + sin(uTime * 1.5 + position.x) * 0.12;
          }
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float intensity = smoothstep(0.5, 0.1, dist) * vAlpha;
          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uActiveRegion: { value: -1.0 },
        uSearchPulse: { value: 0 },
        uPulseCenter: { value: new THREE.Vector3() }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particlesObj = new THREE.Points(particleGeometry, particleMaterial);
    brainGroup.add(particlesObj);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    lineGeometry.setAttribute('aRegion', new THREE.BufferAttribute(new Float32Array(lineRegions), 1));

    const lineMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        uniform float uActiveRegion;
        attribute float aRegion;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          float isActive = (uActiveRegion >= 0.0 && abs(aRegion - uActiveRegion) < 0.1) ? 1.0 : 0.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Map colors to lines based on region
          if (aRegion < 0.5) vColor = vec3(0.54, 0.36, 0.96); // #8B5CF6
          else if (aRegion < 1.5) vColor = vec3(0.75, 0.52, 0.99); // #C084FC
          else if (aRegion < 2.5) vColor = vec3(0.66, 0.33, 0.97); // #A855F7
          else vColor = vec3(0.93, 0.28, 0.6); // #EC4899

          if (isActive > 0.5) {
            vAlpha = 0.5 + sin(uTime * 6.0) * 0.25;
          } else if (uActiveRegion >= 0.0) {
            vAlpha = 0.02;
          } else {
            vAlpha = 0.09 + sin(uTime * 2.0 + position.y) * 0.04;
          }
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, vAlpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uActiveRegion: { value: -1.0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const linesObj = new THREE.LineSegments(lineGeometry, lineMaterial);
    brainGroup.add(linesObj);

    // 5. Interactive Camera Lerping & Raycasting
    let currentLookAt = new THREE.Vector3(0, 0, 0);

    const onResize = () => {
      const w = container.clientWidth;
      canvas.width = w;
      overlay.width = w;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', onResize);

    // 6. Draw 2D Bezier linking wires overlay canvas
    const ctx2D = overlay.getContext('2d');
    const tempV = new THREE.Vector3();

    const drawConnectingWires = () => {
      if (!ctx2D) return;
      ctx2D.clearRect(0, 0, overlay.width, overlay.height);

      REGIONS.forEach((region) => {
        const labelEl = labelRefs.current[region.id];
        if (!labelEl) return;

        // Project 3D coordinate of region center to 2D screen coordinate
        tempV.set(region.cx, region.cy, region.cz);
        tempV.applyEuler(brainGroup.rotation);
        tempV.project(camera);

        const brainX = (tempV.x * 0.5 + 0.5) * overlay.width;
        const brainY = (-(tempV.y * 0.5) + 0.5) * overlay.height;

        // Find label bounding position
        const containerRect = container.getBoundingClientRect();
        const labelRect = labelEl.getBoundingClientRect();

        const isLeft = region.index < 4;
        const labelX = isLeft 
          ? labelRect.right - containerRect.left 
          : labelRect.left - containerRect.left;
        const labelY = labelRect.top - containerRect.top + labelRect.height / 2;

        const isHovered = activeRegionRef.current === region.id;

        // Draw curved Bezier path linking the label to the brain nodes
        ctx2D.beginPath();
        ctx2D.moveTo(labelX, labelY);
        
        // Control points
        const cp1x = isLeft ? labelX + 40 : labelX - 40;
        const cp1y = labelY;
        const cp2x = isLeft ? brainX - 50 : brainX + 50;
        const cp2y = brainY;

        ctx2D.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, brainX, brainY);

        // Styling: Hovered connections glow brightly
        if (isHovered) {
          ctx2D.strokeStyle = region.color;
          ctx2D.lineWidth = 1.8;
          ctx2D.shadowBlur = 10;
          ctx2D.shadowColor = region.color;
        } else {
          ctx2D.strokeStyle = 'rgba(255, 255, 255, 0.055)';
          ctx2D.lineWidth = 0.75;
          ctx2D.shadowBlur = 0;
        }
        ctx2D.stroke();

        // Draw dot at termination anchors
        ctx2D.beginPath();
        ctx2D.arc(brainX, brainY, isHovered ? 3.5 : 2, 0, Math.PI * 2);
        ctx2D.fillStyle = isHovered ? '#ffffff' : `${region.color}50`;
        ctx2D.fill();

        ctx2D.shadowBlur = 0; // reset
      });
    };

    // 7. Search triggering listener
    const handleSearchPulse = (e: Event) => {
      const customEvent = e as CustomEvent;
      const queryStr = (customEvent.detail?.query || '').toLowerCase();
      
      // Map search keyword to region index
      let targetIndex = -1;
      if (queryStr.includes('rag') || queryStr.includes('project') || queryStr.includes('memory')) targetIndex = 0;
      else if (queryStr.includes('experience') || queryStr.includes('cortex') || queryStr.includes('work')) targetIndex = 1;
      else if (queryStr.includes('skill') || queryStr.includes('python')) targetIndex = 2;
      else if (queryStr.includes('achievement')) targetIndex = 3;
      else if (queryStr.includes('mission') || queryStr.includes('build')) targetIndex = 4;
      else if (queryStr.includes('learn') || queryStr.includes('read')) targetIndex = 5;
      else if (queryStr.includes('leadership')) targetIndex = 6;
      else targetIndex = 7;

      const targetRegion = REGIONS.find(r => r.index === targetIndex);
      if (targetRegion) {
        // Trigger wave animation starting at target coordinates
        particleMaterial.uniforms.uSearchPulse.value = 1.0;
        particleMaterial.uniforms.uPulseCenter.value.set(targetRegion.cx, targetRegion.cy, targetRegion.cz);
        
        // Zoom camera in slightly
        targetCameraPos.current.set(targetRegion.cx * 1.5, targetRegion.cy * 1.5, 95);
        targetLookAt.current.set(targetRegion.cx * 0.8, targetRegion.cy * 0.8, targetRegion.cz * 0.8);

        setTimeout(() => {
          particleMaterial.uniforms.uSearchPulse.value = 0;
          targetCameraPos.current.set(0, 0, 155);
          targetLookAt.current.set(0, 0, 0);
        }, 3200);
      }
    };
    const handleCognitiveHover = (e: Event) => {
      const customEvent = e as CustomEvent;
      setActiveRegion(customEvent.detail?.regionId || null);
    };

    const handleCognitiveNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const sectionId = customEvent.detail?.sectionId;
      const region = REGIONS.find(r => r.sectionId === sectionId);
      if (region) {
        // Zoom camera in
        targetCameraPos.current.set(region.cx * 2.2, region.cy * 2.2, 50);
        targetLookAt.current.set(region.cx, region.cy, region.cz);
        setActiveRegion(region.id);

        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          setTimeout(() => {
            targetCameraPos.current.set(0, 0, 130);
            targetLookAt.current.set(0, 0, 0);
            setActiveRegion(null);
          }, 1500);
        }, 900);
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('cognitive-hover', handleCognitiveHover);
    window.addEventListener('cognitive-search', handleSearchPulse);
    window.addEventListener('cognitive-navigate', handleCognitiveNavigate);

    // 8. Animation Loop
    let time = 0;
    const clock = new THREE.Clock();

    const animateLoop = () => {
      time = clock.getElapsedTime();
      
      // Update custom shader uniforms
      particleMaterial.uniforms.uTime.value = time;
      lineMaterial.uniforms.uTime.value = time;

      const currentRegionIndex = REGIONS.find(r => r.id === activeRegionRef.current)?.index ?? -1;
      particleMaterial.uniforms.uActiveRegion.value = currentRegionIndex;
      lineMaterial.uniforms.uActiveRegion.value = currentRegionIndex;

      // Keep rotation fixed (no auto-rotation)
      brainGroup.rotation.y = 0;
      brainGroup.rotation.x = 0;

      // Smooth camera flying lerp
      camera.position.lerp(targetCameraPos.current, 0.05);
      currentLookAt.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
      drawConnectingWires();

      animFrame.current = requestAnimationFrame(animateLoop);
    };

    animateLoop();

    // Cleanups
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('cognitive-search', handleSearchPulse);
      window.removeEventListener('cognitive-hover', handleCognitiveHover);
      window.removeEventListener('cognitive-navigate', handleCognitiveNavigate);
      cancelAnimationFrame(animFrame.current);
      renderer.dispose();
    };
  }, []);

  const handleLabelClick = (region: BrainRegion) => {
    setActiveRegion(region.id);
    
    // Lerp camera into the region
    targetCameraPos.current.set(region.cx * 2.2, region.cy * 2.2, 50);
    targetLookAt.current.set(region.cx, region.cy, region.cz);

    // Eased smooth transition scroll to matching section
    setTimeout(() => {
      const el = document.getElementById(region.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      // Reset camera targets after transition
      setTimeout(() => {
        targetCameraPos.current.set(0, 0, 155);
        targetLookAt.current.set(0, 0, 0);
        setActiveRegion(null);
      }, 1500);
    }, 900);
  };

  const leftLabels = REGIONS.slice(0, 4);
  const rightLabels = REGIONS.slice(4);

  return (
    <div ref={mountRef} className="w-full relative flex items-center justify-between select-none max-w-7xl mx-auto h-[480px] px-4">
      
      {/* WebGL Canvas spanning the entire container width */}
      <canvas
        ref={canvas3D}
        className="absolute inset-0 w-full h-full pointer-events-auto z-10"
      />
      {/* 2D Bezier Lines Canvas Overlay spanning the entire container width */}
      <canvas
        ref={canvas2D}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* 1. Left Side labels — pushed to the outer left edge */}
      <div className="flex flex-col gap-6 items-end w-[28%] z-30 pr-12 lg:pr-16">
        {leftLabels.map((region) => (
          <div
            key={region.id}
            ref={(el) => { labelRefs.current[region.id] = el; }}
            onMouseEnter={() => setActiveRegion(region.id)}
            onMouseLeave={() => setActiveRegion(null)}
            onClick={() => handleLabelClick(region)}
            className={`group text-right cursor-pointer py-1.5 transition-all duration-300 pr-3.5 border-r ${
              activeRegion === region.id 
                ? 'border-[#EC4899] translate-x-[-4px]' 
                : 'border-white/5 hover:border-[#8B5CF6]/50'
            }`}
          >
            <div className="text-zinc-550 font-mono text-[9px] uppercase tracking-widest leading-none mb-1">
              {region.subtitle}
            </div>
            <div 
              className="font-grotesk font-bold text-sm leading-none transition-colors"
              style={{ color: activeRegion === region.id ? region.color : '#F8FAFC' }}
            >
              {region.name}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Central Gap spacer for the brain — wide breathing room */}
      <div className="relative w-[44%] h-[480px] pointer-events-none flex items-center justify-center z-10">
        {/* Concentric Purple platform effect underneath the brain */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-44 h-4 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/15 blur-sm border border-[#A855F7]/30 transform scale-y-[0.16] animate-pulse pointer-events-none shadow-[0_0_35px_rgba(139,92,246,0.35)]" />
      </div>

      {/* 3. Right Side labels — pushed to the outer right edge */}
      <div className="flex flex-col gap-6 items-start w-[28%] z-30 pl-12 lg:pl-16">
        {rightLabels.map((region) => (
          <div
            key={region.id}
            ref={(el) => { labelRefs.current[region.id] = el; }}
            onMouseEnter={() => setActiveRegion(region.id)}
            onMouseLeave={() => setActiveRegion(null)}
            onClick={() => handleLabelClick(region)}
            className={`group text-left cursor-pointer py-1.5 transition-all duration-300 pl-3.5 border-l ${
              activeRegion === region.id 
                ? 'border-[#EC4899] translate-x-[4px]' 
                : 'border-white/5 hover:border-[#8B5CF6]/50'
            }`}
          >
            <div className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-none mb-1">
              {region.subtitle}
            </div>
            <div 
              className="font-grotesk font-bold text-sm leading-none transition-colors"
              style={{ color: activeRegion === region.id ? region.color : '#F8FAFC' }}
            >
              {region.name}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
