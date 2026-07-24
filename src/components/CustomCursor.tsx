import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if device is mobile or touch-capable
    const checkDevice = () => {
      const mobile = 
        window.matchMedia('(max-width: 768px)').matches || 
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Track hoveable items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.interactive-node') ||
        target.closest('.glass-panel-hover')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile]);

  // Smooth trail effect
  useEffect(() => {
    if (isMobile) return;

    const updateTrail = () => {
      setTrail(prev => {
        // Linear interpolation: trail = prev + (target - prev) * ease
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.16,
          y: prev.y + dy * 0.16
        };
      });
      requestRef.current = requestAnimationFrame(updateTrail);
    };

    requestRef.current = requestAnimationFrame(updateTrail);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Glow Orb */}
      <div
        className={`fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-out mix-blend-screen ${
          hovered 
            ? 'w-12 h-12 border-neuralMagenta/50 bg-neuralMagenta/10 shadow-[0_0_15px_rgba(236,72,153,0.4)] scale-110' 
            : 'w-7 h-7 border-neuralPurple/45 bg-transparent'
        }`}
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
        }}
      />
      {/* Inner Dot */}
      <div
        className={`fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white mix-blend-screen transition-transform duration-200 ${
          hovered ? 'scale-75 bg-neuralMagenta' : ''
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
};
