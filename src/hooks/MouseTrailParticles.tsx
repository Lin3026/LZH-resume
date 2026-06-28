import { useEffect, useRef } from 'react';

interface CloudPuff {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  life: number;
  maxLife: number;
  drift: number;       // 水平飘移方向 -1~1
}

export default function MouseTrailParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puffsRef = useRef<CloudPuff[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number>(0);
  const prevMouseRef = useRef({ x: -100, y: -100 });
  const distanceAccumRef = useRef(0);

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

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -100, y: -100 };
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // 绘制一朵小云
    const drawCloud = (
      cx: number, cy: number, r: number, alpha: number
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha * 0.5;

      // 云朵由 3-4 个圆叠加
      const circles = [
        { dx: 0,      dy: 0,      sr: 1.0 },
        { dx: -0.45,  dy: -0.15, sr: 0.6 },
        { dx: 0.40,   dy: -0.10,  sr: 0.55 },
        { dx: -0.15,  dy: 0.18,   sr: 0.45 },
        { dx: 0.20,   dy: 0.15,   sr: 0.40 },
      ];

      ctx.fillStyle = `rgba(220, 230, 255, ${alpha * 0.45})`;
      for (const c of circles) {
        ctx.beginPath();
        ctx.arc(
          cx + c.dx * r,
          cy + c.dy * r,
          r * c.sr,
          0, Math.PI * 2
        );
        ctx.fill();
      }

      // 外层柔光
      ctx.globalAlpha = alpha * 0.15;
      const grad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.6);
      grad.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
      grad.addColorStop(1, 'rgba(200, 220, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const pm = prevMouseRef.current;

      if (mx > 0 && my > 0) {
        const dx = mx - pm.x;
        const dy = my - pm.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        distanceAccumRef.current += dist;

        // 每累计 25px 生成一朵小云
        if (distanceAccumRef.current > 25) {
          distanceAccumRef.current = 0;
          puffsRef.current.push({
            x: mx + (Math.random() - 0.5) * 8,
            y: my + (Math.random() - 0.5) * 6,
            size: 1,
            maxSize: 18 + Math.random() * 22,
            life: 0,
            maxLife: 60 + Math.random() * 40,
            drift: (Math.random() - 0.5) * 0.3,
          });
        }
      }

      prevMouseRef.current = { x: mx, y: my };

      while (puffsRef.current.length > 50) {
        puffsRef.current.shift();
      }

      puffsRef.current = puffsRef.current.filter((p) => {
        p.life++;
        if (p.life >= p.maxLife) return false;

        const progress = p.life / p.maxLife;
        // 云朵先膨胀后缓缓消散
        p.size = p.maxSize * Math.min(1, progress * 2.5);
        p.x += p.drift;

        let opacity: number;
        if (progress < 0.2) {
          opacity = progress / 0.2;
        } else {
          opacity = 1 - (progress - 0.2) / 0.8;
        }

        drawCloud(p.x, p.y, p.size, opacity);
        return true;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
      aria-hidden="true"
    />
  );
}
