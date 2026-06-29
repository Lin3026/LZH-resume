import { useState, useEffect, useMemo } from 'react';
import cursorImg from './assets/cursor.png';
import Navbar from './sections/Navbar';
import VideoShowcase from './sections/VideoShowcase';
import MouseTrailParticles from './hooks/MouseTrailParticles';
import MouseClickRipple from './hooks/MouseClickRipple';
import ScrollParticles from './hooks/ScrollParticles';
import { useIsMobile } from './hooks/use-mobile';
import './App.css';

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  // 用 useIsMobile (基于屏幕宽度 < 768px) 判断，避免触屏笔记本误判
  const isMobile = useIsMobile();

  // 导航栏展开状态 — 移动端默认收起
  const [navOpen, setNavOpen] = useState(false);

  // 视频详情弹窗是否打开（用于隐藏自定义光标）
  const [dialogOpen, setDialogOpen] = useState(false);

  // 光标控制：仅 PC 端使用自定义光标，移动端用原生光标
  const showCustomCursor = useMemo(() => !isMobile, [isMobile]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseLeave = () => setCursorPos({ x: -100, y: -100 });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // 窗口尺寸变化时，PC端自动重置为收起状态（PC端不需要这个 state）
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setNavOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`min-h-screen text-white bg-slate-950 ${showCustomCursor ? 'cursor-hidden' : ''}`}>
      {/* 左侧导航栏
          - PC端：始终展开，固定宽度，主内容区留出对应左边距
          - 移动端：默认收起，点击汉堡按钮展开（覆盖在内容上，不挤内容） */}
      <Navbar isOpen={navOpen} onToggle={() => setNavOpen((v) => !v)} />

      {/* 粒子特效 */}
      <ScrollParticles />
      <MouseTrailParticles />
      <MouseClickRipple />

      {/* 自定义光标 — 仅 PC 端显示，弹窗打开时隐藏 */}
      {showCustomCursor && !dialogOpen && (
        <div
          className="fixed z-[99999] pointer-events-none select-none"
          style={{
            left: cursorPos.x + 10,
            top: cursorPos.y + 10,
            width: 28,
            height: 28,
            backgroundImage: `url(${cursorImg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            transform: 'rotate(10deg)',
          }}
        />
      )}

      {/* 主内容区
          - PC端 (md+): 左侧留出导航栏宽度 (ml-44 lg:ml-56)
          - 移动端 (<768px): 无左边距，导航栏展开时覆盖在内容上方 */}
      <main className="relative z-20 md:ml-44 lg:ml-56">
        <VideoShowcase onDialogOpenChange={setDialogOpen} />
      </main>
    </div>
  );
}
