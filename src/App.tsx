import Navbar from './sections/Navbar';
import VideoShowcase from './sections/VideoShowcase';
import MouseTrailParticles from './hooks/MouseTrailParticles';
import MouseClickRipple from './hooks/MouseClickRipple';
import ScrollParticles from './hooks/ScrollParticles';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen text-white bg-slate-950">
      {/* 左侧固定导航栏（不铺满，固定宽度） */}
      <Navbar />

      {/* 粒子特效 */}
      <ScrollParticles />
      <MouseTrailParticles />
      <MouseClickRipple />

      {/* 主内容区 — 左侧留出导航栏宽度，背景图铺满剩余宽度自适应各设备 */}
      <main className="relative z-20 ml-44 sm:ml-48 md:ml-52 lg:ml-56">
        <VideoShowcase />
      </main>
    </div>
  );
}

