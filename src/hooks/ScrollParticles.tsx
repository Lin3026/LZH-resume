import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  rotSpeed: number;
}

// 绘制一颗五角星（复用逻辑）
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  r: number, alpha: number, rotation: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  const outerColor = `rgba(255, 215, 0, ${alpha})`;
  const innerColor = `rgba(255, 180, 0, ${alpha * 0.7})`;

  ctx.shadowColor = `rgba(255, 200, 0, ${alpha * 0.9})`;
  ctx.shadowBlur = 8 + r * 0.2;

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

  // 内圈层级
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
  ctx.globalAlpha = alpha * 0.85;
  const hotGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.35);
  hotGrad.addColorStop(0, `rgba(255, 255, 200, ${alpha * 0.85})`);
  hotGrad.addColorStop(1, `rgba(255, 215, 0, 0)`);
  ctx.fillStyle = hotGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export default function ScrollParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
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

    const spawnStars = (scrollDelta: number) => {
      const count = Math.min(Math.abs(scrollDelta) * 0.15, 8);
      const isScrollingDown = scrollDelta > 0;

      for (let i = 0; i < count; i++) {
        const edgeY = isScrollingDown
          ? -15 - Math.random() * 40
          : canvas.height + 15 + Math.random() * 40;

        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: edgeY,
          vx: (Math.random() - 0.5) * 0.5,
          vy: isScrollingDown
            ? 0.3 + Math.random() * 0.8
            : -(0.3 + Math.random() * 0.8),
          life: 0,
          maxLife: 100 + Math.random() * 140,
          size: 4 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.04,
        });
      }

      while (starsRef.current.length > 150) {
        starsRef.current.shift();
      }
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;

      if (Math.abs(delta) > 1) {
        spawnStars(delta);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current = starsRef.current.filter((s) => {
        s.x += s.vx + Math.sin(s.life * 0.01) * 0.3;
        s.y += s.vy;
        s.life++;
        s.rotation += s.rotSpeed;

        if (s.life >= s.maxLife) return false;

        const progress = s.life / s.maxLife;
        let opacity: number;
        if (progress < 0.1) {
          opacity = progress / 0.1;
        } else if (progress < 0.7) {
          opacity = 1;
        } else {
          opacity = 1 - (progress - 0.7) / 0.3;
        }

        const sizeScale = progress < 0.2
          ? progress / 0.2
          : 1 + (progress - 0.2) * 0.3;

        drawStar(ctx, s.x, s.y, s.size * sizeScale, opacity, s.rotation);
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
