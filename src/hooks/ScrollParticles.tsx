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

    const spawnStars = (scrollDelta: number) => {
      // 减少生成量，让星星不那么密集（原来0.15→0.08）
      const count = Math.min(Math.abs(scrollDelta) * 0.08, 4); // 原来最多8个，现在最多4个
      const isScrollingDown = scrollDelta > 0;

      for (let i = 0; i < count; i++) {
        const edgeY = isScrollingDown
          ? -20 - Math.random() * 50
          : canvas.height + 20 + Math.random() * 50;

        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: edgeY,
          vx: (Math.random() - 0.5) * 0.3,       // 水平漂移更慢
          vy: isScrollingDown
            ? 0.2 + Math.random() * 0.6           // 下落速度更慢（原0.3-1.1）
            : -(0.2 + Math.random() * 0.6),
          life: 0,
          maxLife: 160 + Math.random() * 180,      // 原来最多240，现在更多
          size: 8 + Math.random() * 16,            // 星星更大一点
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,   // 旋转更慢
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

      if (Math.abs(delta) > 1) {
        spawnStars(delta);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = imgRef.current;
      if (!img || !img.complete) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      starsRef.current = starsRef.current.filter((s) => {
        s.x += s.vx + Math.sin(s.life * 0.008) * 0.2;  // 正弦摆动更慢
        s.y += s.vy;
        s.life++;
        s.rotation += s.rotSpeed;

        if (s.life >= s.maxLife) return false;

        const progress = s.life / s.maxLife;
        // 慢速消散：前25%淡入，中间50%全亮，后25%缓慢淡出
        let opacity: number;
        if (progress < 0.25) {
          opacity = progress / 0.25;               // 淡入
        } else if (progress < 0.75) {
          opacity = 1;                             // 全亮保持更久
        } else {
          opacity = 1 - Math.pow((progress - 0.75) / 0.25, 2); // 二次方缓出
        }

        // 尺寸变化更平缓
        const sizeScale = progress < 0.2
          ? progress / 0.2                          // 小→大
          : 1 + (progress - 0.2) * 0.15;           // 轻微变大

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.drawImage(img, -(s.size * sizeScale) / 2, -(s.size * sizeScale) / 2, s.size * sizeScale, s.size * sizeScale);
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
