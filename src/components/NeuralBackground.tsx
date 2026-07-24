import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseDir: number;
  color: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

interface ActionPotential {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  speed: number;
  color: string;
}

export const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let sparks: Spark[] = [];
    let pulses: ActionPotential[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      sparks = [];
      pulses = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 85);
      
      const colors = [
        'rgba(139, 92, 246, ', // Electric Violet
        'rgba(168, 85, 247, ', // Neural Purple
        'rgba(236, 72, 153, '  // Magenta Plasma
      ];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2 + 1.2,
          pulse: Math.random(),
          pulseDir: Math.random() > 0.5 ? 0.008 : -0.008,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      const sparkCount = 45;
      for (let i = 0; i < sparkCount; i++) {
        sparks.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -Math.random() * 0.35 - 0.08,
          alpha: Math.random() * 0.4 + 0.05,
          size: Math.random() * 1.2 + 0.4
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- Draw faint brain hemispheres outline (Scroll Parallax) ---
      const cx = canvas.width / 2;
      const cy = canvas.height / 2.2;
      const scrollOffset = window.scrollY * 0.15; // parallax scrolling speed

      ctx.save();
      ctx.translate(0, -scrollOffset);
      
      // Left hemisphere outer curve
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.015)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 200);
      ctx.bezierCurveTo(cx - 160, cy - 220, cx - 250, cy - 100, cx - 220, cy);
      ctx.bezierCurveTo(cx - 250, cy + 90, cx - 140, cy + 200, cx - 35, cy + 180);
      ctx.bezierCurveTo(cx - 20, cy + 200, cx - 10, cy + 240, cx, cy + 260);
      ctx.stroke();

      // Right hemisphere outer curve
      ctx.beginPath();
      ctx.moveTo(cx, cy - 200);
      ctx.bezierCurveTo(cx + 160, cy - 220, cx + 250, cy - 100, cx + 220, cy);
      ctx.bezierCurveTo(cx + 250, cy + 90, cx + 140, cy + 200, cx + 35, cy + 180);
      ctx.bezierCurveTo(cx + 20, cy + 200, cx + 10, cy + 240, cx, cy + 260);
      ctx.stroke();

      // Faint biological internal folds (Gyri and Sulci)
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.008)';
      ctx.lineWidth = 1;
      
      // Left gyri folds
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy - 140);
      ctx.bezierCurveTo(cx - 100, cy - 140, cx - 100, cy - 50, cx - 60, cy - 50);
      ctx.bezierCurveTo(cx - 130, cy - 50, cx - 120, cy + 40, cx - 60, cy + 40);
      ctx.bezierCurveTo(cx - 110, cy + 40, cx - 90, cy + 110, cx - 40, cy + 110);
      ctx.stroke();

      // Right gyri folds
      ctx.beginPath();
      ctx.moveTo(cx + 40, cy - 140);
      ctx.bezierCurveTo(cx + 100, cy - 140, cx + 100, cy - 50, cx + 60, cy - 50);
      ctx.bezierCurveTo(cx + 130, cy - 50, cx + 120, cy + 40, cx + 60, cy + 40);
      ctx.bezierCurveTo(cx + 110, cy + 40, cx + 90, cy + 110, cx + 40, cy + 110);
      ctx.stroke();

      ctx.restore();

      // Render sparks (dust)
      sparks.forEach(spark => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        
        if (spark.y < 0) {
          spark.y = canvas.height;
          spark.x = Math.random() * canvas.width;
        }
        if (spark.x < 0 || spark.x > canvas.width) {
          spark.x = Math.random() * canvas.width;
        }

        // Draw spark with sine drift for brainwave motion
        spark.x += Math.sin(Date.now() * 0.001 + spark.y * 0.01) * 0.1;

        ctx.fillStyle = `rgba(168, 85, 247, ${spark.alpha})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update particle pulses
      particles.forEach(p => {
        p.pulse += p.pulseDir;
        if (p.pulse > 1 || p.pulse < 0.2) {
          p.pulseDir = -p.pulseDir;
        }
      });

      // Draw synapses (connections)
      const connectionDist = 135;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx = -p1.vx;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy = -p1.vy;

        // Interactive mouse connection
        if (mouseRef.current.active) {
          const dx = p1.x - mouseRef.current.x;
          const dy = p1.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            p1.x -= dx * 0.008;
            p1.y -= dy * 0.008;

            const alpha = (1 - dist / 150) * 0.2;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        }

        // Draw connections to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.1;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Randomly trigger action potential pulses along lines
            if (Math.random() < 0.00018 && pulses.length < 15) {
              pulses.push({
                startX: p1.x,
                startY: p1.y,
                endX: p2.x,
                endY: p2.y,
                progress: 0,
                speed: Math.random() * 0.02 + 0.012,
                color: Math.random() > 0.5 ? '#EC4899' : '#8B5CF6'
              });
            }
          }
        }
      }

      // Update and draw action potentials
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pulse = pulses[k];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(k, 1);
          continue;
        }

        const currentX = pulse.startX + (pulse.endX - pulse.startX) * pulse.progress;
        const currentY = pulse.startY + (pulse.endY - pulse.startY) * pulse.progress;

        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
      }

      // Draw nodes (neurons)
      particles.forEach(p => {
        ctx.fillStyle = `${p.color}${p.pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `${p.color}${p.pulse * 0.2})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
