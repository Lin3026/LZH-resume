import VideoShowcase from './sections/VideoShowcase';
import MouseTrailParticles from './hooks/MouseTrailParticles';
import MouseClickRipple from './hooks/MouseClickRipple';
import ScrollParticles from './hooks/ScrollParticles';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen text-white bg-transparent">
      {/* 背景粒子特效保留 */}
      <ScrollParticles />
      <MouseTrailParticles />
      <MouseClickRipple />

      {/* 只保留作品展示区域 */}
      <main className="relative z-20 pt-8 pb-20">
        <VideoShowcase />
      </main>
    </div>
  );
}
