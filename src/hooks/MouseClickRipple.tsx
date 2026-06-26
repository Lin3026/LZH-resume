import { useEffect, useRef, useCallback } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
}

export default function MouseClickRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const animFrameRef = useRef<number>(0);

  const createRipple = useCallback((x: number, y: number) => {
    const maxRadius = 28 + Math.random() * 10;
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius,
      life: 0,
      maxLife: 60 + Math.random() * 20, // 约 1 秒生命周期
    });
    if (ripplesRef.current.length > 8) {
      ripplesRef.current.shift();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ripplesRef.current = ripplesRef.current.filter((r) => {
      r.life++;
      if (r.life >= r.maxLife) return false;

      const progress = r.life / r.maxLife;

      // ease-out 扩散：开始快后面慢，像水波自然减速
      r.radius = r.maxRadius * (1 - Math.pow(1 - progress, 2.5));

      // 透明度：淡入快，淡出慢
      let alpha: number;
      if (progress < 0.12) {
        alpha = (progress / 0.12) * 0.55;
      } else {
        alpha = 0.55 * (1 - (progress - 0.12) / 0.88);
      }

      ctx.save();
      ctx.globalAlpha = alpha;

      // 单一主圈——干净和谐
      ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
      ctx.lineWidth = Math.max(0.5, 1.5 * (1 - progress * 0.7));
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();

      // 极淡内圈，仅在扩散前半段可见
      if (progress < 0.5 && r.radius > 6) {
        ctx.globalAlpha = alpha * 0.3;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      return true;
    });

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleClick = (e: MouseEvent) => {
      createRipple(e.clientX, e.clientY);
    };

    document.addEventListener('click', handleClick);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('click', handleClick);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [animate, createRipple]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    />
  );
}
