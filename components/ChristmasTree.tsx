
import React, { useRef, useEffect } from 'react';

const COLORS = [
  '#ff1493', // Deep Pink
  '#ff69b4', // Hot Pink
  '#da70d6', // Orchid
  '#ba55d3', // Medium Orchid
  '#ffd700', // Gold
  '#ffffff', // White
];

interface Particle {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  angleOffset: number;
  jitter: number;
}

const ChristmasTree: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Set internal resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = [];
    const lightSpiral: { x: number; y: number; z: number }[] = [];

    const treeHeight = height * 0.7;
    const treeBaseWidth = width * 0.4;
    const particleCount = 1800;

    // Generate tree particles
    for (let i = 0; i < particleCount; i++) {
      const t = Math.random(); // Height progress 0 to 1
      const radius = (1 - t) * treeBaseWidth * 0.5;
      const angle = t * Math.PI * 30; // Spiral wraps
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = t * treeHeight;

      particles.push({
        x: 0, y: 0, z: 0,
        baseX: x,
        baseY: -y, // Upwards from bottom
        baseZ: z,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 2 + 0.5,
        angleOffset: Math.random() * Math.PI * 2,
        jitter: Math.random() * 5
      });
    }

    // Generate swirling light ribbon
    const ribbonPoints = 400;
    for (let i = 0; i < ribbonPoints; i++) {
      const t = i / ribbonPoints;
      const radius = (1 - t) * treeBaseWidth * 0.55;
      const angle = t * Math.PI * 18;
      lightSpiral.push({
        x: Math.cos(angle) * radius,
        y: -t * treeHeight,
        z: Math.sin(angle) * radius
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height * 0.85; // Base position

      // Simple 3D projection: x' = x, y' = y + z * factor
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const rotX = x * Math.cos(time * 0.5) - z * Math.sin(time * 0.5);
        const rotZ = x * Math.sin(time * 0.5) + z * Math.cos(time * 0.5);
        
        // Depth perspective
        const scale = (rotZ + treeBaseWidth) / (treeBaseWidth * 2) * 0.4 + 0.8;
        return {
          px: centerX + rotX * scale,
          py: centerY + y * scale,
          opacity: scale * 0.8,
          scale
        };
      };

      // Draw tree particles
      particles.forEach(p => {
        const { px, py, opacity, scale } = project(p.baseX, p.baseY, p.baseZ);
        
        // Add subtle sparkle
        const sparkle = Math.sin(time * 5 + p.angleOffset) * 0.5 + 0.5;
        
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity * sparkle;
        ctx.fill();
      });

      // Draw light ribbon
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffffff';
      
      lightSpiral.forEach((pt, i) => {
        // Offset ribbon slightly over time to look like it's flowing
        const flowT = (time * 2) % 1;
        const { px, py, opacity } = project(pt.x, pt.y, pt.z);
        
        if (i === 0) ctx.moveTo(px, py);
        else {
          ctx.globalAlpha = opacity * 0.6;
          ctx.lineTo(px, py);
        }
      });
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // Draw star on top
      const starPos = project(0, -treeHeight - 10, 0);
      drawStar(ctx, starPos.px, starPos.py, 5, 12, 6, '#ffd700');

      animationFrameId = requestAnimationFrame(render);
    };

    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    render();

    const handleResize = () => {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full cursor-default"
      style={{ touchAction: 'none' }}
    />
  );
};

export default ChristmasTree;
