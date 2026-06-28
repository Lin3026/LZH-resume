import { useState, useEffect } from 'react';
import Navbar from './sections/Navbar';
import VideoShowcase from './sections/VideoShowcase';
import MouseTrailParticles from './hooks/MouseTrailParticles';
import MouseClickRipple from './hooks/MouseClickRipple';
import ScrollParticles from './hooks/ScrollParticles';
import './App.css';

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

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

  return (
    <div className="min-h-screen text-white bg-slate-950 cursor-none">
      {/* 左侧固定导航栏（不铺满，固定宽度） */}
      <Navbar />

      {/* 粒子特效 */}
      <ScrollParticles />
      <MouseTrailParticles />
      <MouseClickRipple />

      {/* 纸飞机光标 */}
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          left: cursorPos.x + 12,
          top: cursorPos.y + 12,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 11L22 2L14 22L17 12L2 11Z"
            fill="white"
            stroke="#06b6d4"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M2 11L9 8"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* 主内容区 — 左侧留出导航栏宽度，背景图铺满剩余宽度自适应各设备 */}
      <main className="relative z-20 ml-44 sm:ml-48 md:ml-52 lg:ml-56">
        <VideoShowcase />
      </main>
    </div>
  );
}

