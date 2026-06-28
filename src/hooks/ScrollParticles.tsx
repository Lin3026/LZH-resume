import { useEffect, useRef } from 'react';

interface Smoke {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  drift: number;
}

export default function ScrollParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smokeRef = useRef<Smoke[]>([]);
  const lastScrollRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawSmoke = (sx: number, sy: number, r: number, alpha: number, lifePct: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;

      const layers = [
        { scale: 1.0, a: 0.35 },
        { scale: 1.6, a: 0.15 },
        { scale: 0.55, a: 0.50 },
        { scale: 2.2, a: 0.06 },
      ];

      for (const layer of layers) {
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * layer.scale);
        const gv = Math.floor(210 + lifePct * 20);
        const bv = Math.floor(gv + 15);
        grad.addColorStop(0, `rgba(${gv},${gv + 8},${bv},${alpha * layer.a})`);
        grad.addColorStop(0.5, `rgba(${gv - 15},${gv - 5},${bv - 5},${alpha * layer.a * 0.6})`);
        grad.addColorStop(1, `rgba(${gv - 40},${gv - 30},${bv - 20},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sx, sy, r * layer.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const spawnSmoke = (scrollDelta: number) => {
      const count = Math.min(Math.abs(scrollDelta) * 0.2, 10);
      const isScrollingDown = scrollDelta > 0;

      for (let i = 0; i < count; i++) {
        const edgeY = isScrollingDown
          ? -10 - Math.random() * 30
          : canvas.height + 10 + Math.random() * 30;

        smokeRef.current.push({
          x: Math.random() * canvas.width,
          y: edgeY,
          vx: (Math.random() - 0.5) * 0.6,
          vy: isScrollingDown
            ? 0.4 + Math.random() * 1.0
            : -(0.4 + Math.random() * 1.0),
          life: 0,
          maxLife: 120 + Math.random() * 160,
          size: 20 + Math.random() * 50,
          drift: (Math.random() - 0.5) * 0.02,
        });
      }

      while (smokeRef.current.length > 180) {
        smokeRef.current.shift();
      }
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;

      if (Math.abs(delta) > 1) {
        spawnSmoke(delta);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      smokeRef.current = smokeRef.current.filter((s) => {
        s.x += s.vx + Math.sin(s.life * 0.012) * 0.4;
        s.y += s.vy;
        s.life++;

        if (s.life >= s.maxLife) return false;

        const progress = s.life / s.maxLife;
        let opacity: number;
        if (progress < 0.12) {
          opacity = progress / 0.12;
        } else if (progress < 0.75) {
          opacity = 1;
        } else {
          opacity = 1 - (progress - 0.75) / 0.25;
        }

        const sizeScale = progress < 0.25
          ? progress / 0.25
          : 1 + (progress - 0.25) * 0.4;

        drawSmoke(s.x, s.y, s.size * sizeScale, opacity, progress);
        return true;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
