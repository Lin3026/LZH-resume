import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  wobble: number;       // 水平摆动相位
  wobbleSpeed: number;
}

export default function ScrollParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
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

    const spawnBubbles = (scrollDelta: number) => {
      // 根据滚动速度决定水泡数量
      const count = Math.min(Math.abs(scrollDelta) * 0.15, 8);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = scrollDelta > 0
          ? canvas.height + Math.random() * 20
          : -20 - Math.random() * 20;

        const angle = (Math.random() - 0.5) * Math.PI * 0.18; // 横向微扰 ±16°
        const speed = 0.5 + Math.random() * 1.5;

        bubblesRef.current.push({
          x,
          y,
          vx: Math.sin(angle) * speed,
          vy: scrollDelta > 0 ? -(1 + Math.random() * 2) : (1 + Math.random() * 2),
          life: 0,
          maxLife: 80 + Math.random() * 120,  // 存活时间（80-200帧）
          size: 3 + Math.random() * 6,  // 水泡尺寸稍大
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.03,
        });
      }

      // 限制总数
      while (bubblesRef.current.length > 200) {
        bubblesRef.current.shift();
      }
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;

      if (Math.abs(delta) > 1) {
        spawnBubbles(delta);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubblesRef.current = bubblesRef.current.filter((b) => {
        b.wobble += b.wobbleSpeed;
        b.x += b.vx + Math.sin(b.wobble) * 0.4;  // 水泡左右摇摆
        b.y += b.vy;
        b.life++;

        if (b.life >= b.maxLife) return false;

        const progress = b.life / b.maxLife;
        const opacity = progress < 0.3
          ? progress / 0.3
          : (1 - (progress - 0.3) / 0.7);

        const alpha = opacity * 0.85;
        // 水泡轻微缩放：刚生成时小，中间最大，末期略缩
        const scale = progress < 0.2 ? progress / 0.2 : (1 - (progress - 0.2) * 0.3);
        const r = b.size * scale;

        if (r < 0.5) return true;

        ctx.save();
        ctx.globalAlpha = alpha;

        // 水泡主体 - 半透明白色填充
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.08})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();

        // 水泡外圈 - 细亮环
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.stroke();

        // 高光 - 左上小亮点（像光线反射）
        if (r > 2) {
          const hx = b.x - r * 0.35;
          const hy = b.y - r * 0.35;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(hx, hy, r * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }

        // 底部淡反光（让水泡更立体）
        if (r > 3) {
          ctx.strokeStyle = `rgba(186, 230, 253, ${alpha * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(b.x, b.y, r * 0.85, Math.PI * 0.15, Math.PI * 0.45);
          ctx.stroke();
        }

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
