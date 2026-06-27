import { useEffect, useRef } from 'react';

interface RippleDrop {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  color: string;
}

const COLORS = [
  '6, 182, 212',    // cyan-500
  '20, 184, 166',   // teal-500
  '56, 189, 248',   // sky-400
  '34, 211, 238',   // cyan-400
];

export default function MouseTrailParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<RippleDrop[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number>(0);
  const prevMouseRef = useRef({ x: -100, y: -100 });
  const distanceAccumRef = useRef(0); // 累计移动距离

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

        // 每累计 35px 生成一个"点水"涟漪（间歇性，非连续）
        if (distanceAccumRef.current > 35) {
          distanceAccumRef.current = 0;
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          dropsRef.current.push({
            x: mx,
            y: my,
            radius: 1,
            maxRadius: 14 + Math.random() * 16,
            life: 0,
            maxLife: 50 + Math.random() * 30,
            color,
          });
        }
      }

      prevMouseRef.current = { x: mx, y: my };

      while (dropsRef.current.length > 60) {
        dropsRef.current.shift();
      }

      // 绘制蜻蜓点水涟漪
      dropsRef.current = dropsRef.current.filter((d) => {
        d.life++;
        if (d.life >= d.maxLife) return false;

        const progress = d.life / d.maxLife;
        // 涟漪快速扩散后减速
        d.radius = d.maxRadius * (1 - Math.pow(1 - progress, 3));

        let opacity: number;
        if (progress < 0.15) {
          opacity = progress / 0.15;        // 快速浮现
        } else {
          opacity = 1 - (progress - 0.15) / 0.85;  // 缓慢消散
        }
        const alpha = opacity * 0.6;

        ctx.save();
        ctx.globalAlpha = alpha;

        // 外圈涟漪
        ctx.strokeStyle = `rgba(${d.color}, ${alpha * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.stroke();

        // 内圈涟漪（更小更淡）
        if (d.radius > 4) {
          ctx.globalAlpha = alpha * 0.4;
          ctx.strokeStyle = `rgba(${d.color}, ${alpha * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius * 0.55, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 中心水滴高光（仅初始阶段）
        if (progress < 0.3) {
          const dropAlpha = (1 - progress / 0.3) * 0.8;
          ctx.globalAlpha = dropAlpha;
          const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, 3);
          grad.addColorStop(0, `rgba(255, 255, 255, ${dropAlpha})`);
          grad.addColorStop(1, `rgba(${d.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

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
