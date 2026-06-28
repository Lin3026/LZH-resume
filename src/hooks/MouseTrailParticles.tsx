import { useEffect, useRef } from 'react';
import starImg from '../assets/star.png';

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

export default function MouseTrailParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number>(0);
  const prevMouseRef = useRef({ x: -100, y: -100 });
  const distanceAccumRef = useRef(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 预加载星星图片
    const img = new Image();
    img.src = starImg;
    imgRef.current = img;

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

      if (mx > 0 && my > 0 && imgRef.current && imgRef.current.complete) {
        const dx = mx - pm.x;
        const dy = my - pm.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        distanceAccumRef.current += dist;

        // 每累计 45px 生成一颗星星（原来20px，现在放慢发射）
        if (distanceAccumRef.current > 45) {
          distanceAccumRef.current = 0;
          starsRef.current.push({
            x: mx + (Math.random() - 0.5) * 12,
            y: my + (Math.random() - 0.5) * 10,
            size: 1,
            maxSize: 14 + Math.random() * 18,
            life: 0,
            maxLife: 90 + Math.random() * 70,   // 原来50+30，存活更久
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.03, // 旋转更慢
            drift: (Math.random() - 0.5) * 0.15,     // 漂移更慢
          });
        }
      }

      prevMouseRef.current = { x: mx, y: my };

      while (starsRef.current.length > 80) {
        starsRef.current.shift();
      }

      const img = imgRef.current;
      if (img && img.complete) {
        starsRef.current = starsRef.current.filter((s) => {
          s.life++;
          if (s.life >= s.maxLife) return false;

          const progress = s.life / s.maxLife;
          // 缓慢放大（比之前慢）
          s.size = s.maxSize * Math.min(1, progress * 2);
          s.rotation += s.rotSpeed;
          s.x += s.drift;

          // 慢速消散：前30%淡入，后70%缓慢淡出
          let opacity: number;
          if (progress < 0.3) {
            opacity = progress / 0.3;              // 淡入阶段
          } else {
            opacity = 1 - Math.pow((progress - 0.3) / 0.7, 1.5); // 非线性缓出，消失更慢
          }

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rotation);
          ctx.drawImage(img, -s.size / 2, -s.size / 2, s.size, s.size);
          ctx.restore();

          return true;
        });
      }

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
