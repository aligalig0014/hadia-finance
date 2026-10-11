import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  color: string;
  opacity: number;
  type: 'rose' | 'sakura' | 'heart' | 'sparkle';
}

interface PetalRainCanvasProps {
  density?: 'gentle' | 'romantic' | 'storm';
  interactive?: boolean;
}

export const PetalRainCanvas: React.FC<PetalRainCanvasProps> = ({
  density = 'romantic',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Number of particles
    const count = density === 'gentle' ? 45 : density === 'romantic' ? 85 : 140;

    const roseColors = [
      '#f43f5e', // rose-500
      '#e11d48', // rose-600
      '#fda4af', // rose-300
      '#fb7185', // rose-400
      '#be123c', // rose-700
      '#ec4899', // pink-500
      '#f472b6', // pink-400
    ];

    const createPetal = (startY?: number): Petal => {
      const typeRand = Math.random();
      const type: Petal['type'] =
        typeRand < 0.65 ? 'rose' : typeRand < 0.85 ? 'sakura' : typeRand < 0.95 ? 'heart' : 'sparkle';

      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height - 20,
        size: Math.random() * 12 + 10,
        speedY: Math.random() * 1.5 + 1.2,
        speedX: Math.random() * 1.4 - 0.7,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        color: roseColors[Math.floor(Math.random() * roseColors.length)],
        opacity: Math.random() * 0.45 + 0.55,
        type,
      };
    };

    const petals: Petal[] = Array.from({ length: count }, () => createPetal());

    // Wind and mouse effect
    let mouseX = width / 2;
    let mouseY = height / 2;
    let hasMouse = false;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      hasMouse = true;
      if ('touches' in e && e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        mouseX = (e as MouseEvent).clientX;
        mouseY = (e as MouseEvent).clientY;
      }
    };

    if (interactive) {
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('touchmove', onPointerMove, { passive: true });
    }

    const drawHeart = (cx: number, cy: number, size: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const d = size * 0.5;
      ctx.moveTo(0, d / 4);
      ctx.bezierCurveTo(0, 0, -d / 2, 0, -d / 2, d / 3);
      ctx.bezierCurveTo(-d / 2, (2 * d) / 3, 0, d, 0, (4 * d) / 3);
      ctx.bezierCurveTo(0, d, d / 2, (2 * d) / 3, d / 2, d / 3);
      ctx.bezierCurveTo(d / 2, 0, 0, 0, 0, d / 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotZ);
      ctx.scale(Math.cos(p.rotX), Math.sin(p.rotY));
      ctx.globalAlpha = p.opacity;

      if (p.type === 'heart') {
        drawHeart(0, 0, p.size, p.color, p.opacity);
        ctx.restore();
        return;
      }

      if (p.type === 'sparkle') {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      // Elegant curved rose / sakura petal
      const grad = ctx.createLinearGradient(-p.size / 2, -p.size, p.size / 2, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(0.6, p.type === 'sakura' ? '#fce7f3' : '#be123c');
      grad.addColorStop(1, '#881337');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.9, p.size * 0.3, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.3, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
      ctx.closePath();
      ctx.fill();

      // Delicate center vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.8);
      ctx.quadraticCurveTo(p.size * 0.1, 0, 0, p.size * 0.7);
      ctx.stroke();

      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient wind oscillator
      const ambientWind = Math.sin(tick * 0.015) * 0.8;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Interaction wind
        if (hasMouse && interactive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const force = (140 - dist) / 140;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 2;
          }
        }

        p.y += p.speedY;
        p.x += p.speedX + ambientWind;
        p.rotX += p.rotSpeedX;
        p.rotY += p.rotSpeedY;
        p.rotZ += p.rotSpeedZ;

        // Wrap around bottom
        if (p.y > height + 40) {
          petals[i] = createPetal(-30);
        }
        if (p.x < -40) {
          p.x = width + 20;
        } else if (p.x > width + 40) {
          p.x = -20;
        }

        drawPetal(p);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('touchmove', onPointerMove);
      }
    };
  }, [density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      aria-hidden="true"
    />
  );
};
