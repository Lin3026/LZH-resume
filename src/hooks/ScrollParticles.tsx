import { useEffect, useRef } from 'react';
import starImg from '../assets/star.png';

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

export default function ScrollParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const lastScrollRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const scrollAccumRef = useRef(0); // 累计滚动距离（跨多次 scroll 事件）

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 预加载星星图片
    const img = new Image();
    img.src = starImg;
    img.onload = () => { imgRef.current = img; };
    img.onerror = () => { console.warn('[ScrollParticles] star.png 加载失败'); };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnStars = (scrollDelta: number) => {
      const isScrollingDown = scrollDelta > 0;

      // 累计滚动距离，每满 25px 生成 1 颗星
      scrollAccumRef.current += Math.abs(scrollDelta);
      const threshold = 25;
      const numToSpawn = Math.floor(scrollAccumRef.current / threshold);

      if (numToSpawn > 0) {
        scrollAccumRef.current -= numToSpawn * threshold; // 减去已消耗的距离
      }

      const count = Math.min(numToSpawn, 3); // 每帧最多3颗

      for (let i = 0; i < count; i++) {
        const edgeY = isScrollingDown
          ? -20 - Math.random() * 50
          : canvas.height + 20 + Math.random() * 50;

        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: edgeY,
          vx: (Math.random() - 0.5) * 0.3,
          vy: isScrollingDown
            ? 0.2 + Math.random() * 0.6
            : -(0.2 + Math.random() * 0.6),
          life: 0,
          maxLife: 160 + Math.random() * 180,
          size: 8 + Math.random() * 16,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
        });
      }

      while (starsRef.current.length > 120) {
        starsRef.current.shift();
      }
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;

      if (Math.abs(delta) >= 1) {
        spawnStars(delta);
      }
    };

    // 初次加载也触发一次，确保监听生效
    lastScrollRef.current = window.scrollY;

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = imgRef.current;
      if (!img) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      starsRef.current = starsRef.current.filter((s) => {
        s.x += s.vx + Math.sin(s.life * 0.008) * 0.2;
        s.y += s.vy;
        s.life++;
        s.rotation += s.rotSpeed;

        if (s.life >= s.maxLife) return false;

        const progress = s.life / s.maxLife;
        let opacity: number;
        if (progress < 0.25) {
          opacity = progress / 0.25;
        } else if (progress < 0.75) {
          opacity = 1;
        } else {
          opacity = 1 - Math.pow((progress - 0.75) / 0.25, 2);
        }

        const sizeScale = progress < 0.2
          ? progress / 0.2
          : 1 + (progress - 0.2) * 0.15;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.drawImage(
          img,
          -(s.size * sizeScale) / 2,
          -(s.size * sizeScale) / 2,
          s.size * sizeScale,
          s.size * sizeScale
        );
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
