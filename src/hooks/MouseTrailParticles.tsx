import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotSpeed: number;
  drift: number;
}

// 绘制一颗五角星
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  r: number, alpha: number, rotation: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  // 黄色星星：外圈金色，内圈琥珀色
  const outerColor = `rgba(255, 215, 0, ${alpha})`;   // gold
  const innerColor = `rgba(255, 180, 0, ${alpha * 0.7})`; // amber

  ctx.shadowColor = `rgba(255, 200, 0, ${alpha * 0.9})`;
  ctx.shadowBlur = 10 + r * 0.3;

  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    const ox = r * Math.cos(outerAngle);
    const oy = r * Math.sin(outerAngle);
    const ix = r * 0.45 * Math.cos(innerAngle);
    const iy = r * 0.45 * Math.sin(innerAngle);
    if (i === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fillStyle = outerColor;
  ctx.fill();

  // 内圈稍深的颜色增加层次
  ctx.globalAlpha = alpha * 0.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    const ox = r * 0.55 * Math.cos(outerAngle);
    const oy = r * 0.55 * Math.sin(outerAngle);
    const ix = r * 0.25 * Math.cos(innerAngle);
    const iy = r * 0.25 * Math.sin(innerAngle);
    if (i === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fillStyle = innerColor;
  ctx.fill();

  // 中心高光
  ctx.globalAlpha = alpha * 0.9;
  const hotGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.35);
  hotGrad.addColorStop(0, `rgba(255, 255, 200, ${alpha * 0.9})`);
  hotGrad.addColorStop(1, `rgba(255, 215, 0, 0)`);
  ctx.fillStyle = hotGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export default function MouseTrailParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
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

        // 每累计 20px 生成一颗黄色星星
        if (distanceAccumRef.current > 20) {
          distanceAccumRef.current = 0;
          starsRef.current.push({
            x: mx + (Math.random() - 0.5) * 10,
            y: my + (Math.random() - 0.5) * 8,
            size: 1,
            maxSize: 10 + Math.random() * 14,
            life: 0,
            maxLife: 50 + Math.random() * 30,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.06,
            drift: (Math.random() - 0.5) * 0.25,
          });
        }
      }

      prevMouseRef.current = { x: mx, y: my };

      while (starsRef.current.length > 60) {
        starsRef.current.shift();
      }

      starsRef.current = starsRef.current.filter((s) => {
        s.life++;
        if (s.life >= s.maxLife) return false;

        const progress = s.life / s.maxLife;
        // 星星先放大后缓缓消散
        s.size = s.maxSize * Math.min(1, progress * 3);
        s.rotation += s.rotSpeed;
        s.x += s.drift;

        let opacity: number;
        if (progress < 0.15) {
          opacity = progress / 0.15;
        } else {
          opacity = 1 - (progress - 0.15) / 0.85;
        }

        drawStar(ctx, s.x, s.y, s.size, opacity, s.rotation);
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
