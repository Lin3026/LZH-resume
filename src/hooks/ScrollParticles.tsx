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
  'rgba(6, 182, 212, 0.8)',   // cyan-500
  'rgba(20, 184, 166, 0.7)',  // teal-500
  'rgba(56, 189, 248, 0.7)',  // sky-400
  'rgba(34, 211, 238, 0.6)',  // cyan-400
  'rgba(94, 234, 212, 0.6)',  // teal-300
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
      const count = Math.min(Math.abs(scrollDelta) * 0.15, 8);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = scrollDelta > 0
          ? canvas.height + Math.random() * 20
          : -20 - Math.random() * 20;

        const angle = (Math.random() - 0.5) * Math.PI * 0.18; // 横向微扰 ±16°
        const speed = 0.5 + Math.random() * 1.5;  // 速度减半

        particlesRef.current.push({
          x,
          y,
          vx: Math.sin(angle) * speed,   // 减弱横向扰动
          vy: scrollDelta > 0 ? -(1 + Math.random() * 2) : (1 + Math.random() * 2),  // 垂直速度减半
          life: 0,
          maxLife: 80 + Math.random() * 120,  // 存活时间翻倍（80-200帧）
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
