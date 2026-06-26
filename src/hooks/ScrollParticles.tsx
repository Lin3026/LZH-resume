import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const COLORS = [
  'rgba(168, 85, 247, 0.8)',  // purple
  'rgba(139, 92, 246, 0.7)',  // lighter purple
  'rgba(59, 130, 246, 0.7)',  // blue
  'rgba(14, 165, 233, 0.6)',  // cyan
  'rgba(236, 72, 153, 0.6)',  // pink
];

export default function ScrollParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
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

    const spawnParticles = (scrollDelta: number) => {
      // 根据滚动速度决定粒子数量
      const count = Math.min(Math.abs(scrollDelta) * 0.3, 15);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = scrollDelta > 0
          ? canvas.height + Math.random() * 20
          : -20 - Math.random() * 20;

        const angle = (Math.random() - 0.5) * Math.PI * 0.6; // 横向随机角度
        const speed = 1 + Math.random() * 3;

        particlesRef.current.push({
          x,
          y,
          vx: Math.sin(angle) * speed,
          vy: scrollDelta > 0 ? -(2 + Math.random() * 4) : (2 + Math.random() * 4),
          life: 0,
          maxLife: 40 + Math.random() * 60,
          size: 2 + Math.random() * 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }

      // 限制总数
      while (particlesRef.current.length > 200) {
        particlesRef.current.shift();
      }
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;

      if (Math.abs(delta) > 1) {
        spawnParticles(delta);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife) return false;

        const progress = p.life / p.maxLife;
        const opacity = progress < 0.3
          ? progress / 0.3
          : (1 - (progress - 0.3) / 0.7);

        const alpha = opacity * 0.9;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.6), 0, Math.PI * 2);
        ctx.fill();

        // 小光晕
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2 * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

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
