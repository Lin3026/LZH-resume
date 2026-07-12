import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import cursorImg from './assets/cursor.png';
import Navbar from './sections/Navbar';
import VideoShowcase from './sections/VideoShowcase';
import MouseTrailParticles from './hooks/MouseTrailParticles';
import MouseClickRipple from './hooks/MouseClickRipple';
import ScrollParticles from './hooks/ScrollParticles';
import Starfield from './components/Starfield';
import { useIsMobile } from './hooks/use-mobile';
import './App.css';

// 音乐分享页面懒加载，减小首屏体积
const MusicShare = lazy(() => import('./sections/MusicShare'));
// 互动加载页（三消小游戏 + 资源预加载）懒加载
const GameLoading = lazy(() => import('./sections/GameLoading'));
  // 个人简历页（3D Creator 作品集，原「老家分享」）懒加载
  const CreatorPortfolio = lazy(() => import('./sections/creator/CreatorPortfolio'));

/** 页面视图 */
type PageView = 'home' | 'music' | 'game' | 'creator';

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  // 门禁：会话内是否已通过互动游戏（同浏览器会话记住，刷新不重复、新会话需重过）
  const PASSED_KEY = 'lzh-passed-game';
  const readPassed = (): boolean => {
    try {
      return sessionStorage.getItem(PASSED_KEY) === '1';
    } catch {
      return false;
    }
  };
  const [hasPassedGame, setHasPassedGame] = useState<boolean>(readPassed);

  // 当前页面视图：未通关强制落地游戏页，已通关（同会话）直接进个人简历
  const [currentPage, setCurrentPage] = useState<PageView>(readPassed() ? 'creator' : 'game');

  // 用 useIsMobile (基于屏幕宽度 < 768px) 判断，避免触屏笔记本误判
  const isMobile = useIsMobile();

  // 导航栏展开状态 — 移动端默认收起
  const [navOpen, setNavOpen] = useState(false);

  // 视频详情弹窗开关（值未直接使用，通过 setDialogOpen 回调传递）
  const [, setDialogOpen] = useState(false);

  // 弹窗打开/关闭时切换 body class，全局隐藏原生光标让纸飞机穿透
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (open) {
      document.body.classList.add('dialog-open');
    } else {
      document.body.classList.remove('dialog-open');
    }
  };

  // 顶部导航栏链接配置 — 点击切换页面视图
  const topNavLinks = [
    { label: '个人空间', page: 'home' as PageView },
    { label: '音乐分享', page: 'music' as PageView },
    { label: '互动游戏', page: 'game' as PageView },
    { label: '个人简历', page: 'creator' as PageView },
  ];

  const handleTopNavClick = (page: PageView | null) => {
    if (!page) return;
    // 门禁：未通过互动游戏前，禁止进入个人空间（其余页面可自由访问）
    if (page === 'home' && !hasPassedGame) {
      if (currentPage !== 'game') setCurrentPage('game');
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 游戏通关：记录会话状态并放行进入个人简历
  const handleGameComplete = useCallback(() => {
    try {
      sessionStorage.setItem(PASSED_KEY, '1');
    } catch {
      /* 忽略隐私模式等写入失败 */
    }
    setHasPassedGame(true);
    setCurrentPage('creator');
  }, []);

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
      // 清理：组件卸载时移除 body class
      document.body.classList.remove('dialog-open');
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
    <div className={`min-h-screen text-white bg-transparent ${showCustomCursor && currentPage === 'home' ? 'cursor-hidden' : ''}`}>
      {/* 全局宇宙星空背景：固定铺满视口、置于最底层，全站共享 */}
      <Starfield />

      {/* 顶部固定导航栏 — 半透明，常驻不随滚动隐藏，全站统一显示 */}
      {
      <header
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-8 md:gap-16"
        style={{
          height: '40px',
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {topNavLinks.map(({ label, page }) => {
          const isActive = page === currentPage;
          // 门禁：未通关前，「个人空间」锁定不可进入
          const locked = page === 'home' && !hasPassedGame;
          return (
            <button
              key={label}
              disabled={locked}
              title={locked ? '请先完成互动游戏 🎮' : undefined}
              onClick={() => handleTopNavClick(page)}
              className={`font-medium tracking-wide transition-all duration-200 text-sm md:text-base select-none ${
                locked
                  ? 'text-white/35 cursor-not-allowed'
                  : 'text-white/80 hover:text-white'
              }`}
              style={{
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                color: isActive ? '#22d3ee' : undefined,
                borderBottom: isActive ? '2px solid #22d3ee' : '2px solid transparent',
                paddingBottom: '2px',
                WebkitAppearance: 'none',
                appearance: 'none',
                background: 'none',
                cursor: locked ? 'not-allowed' : 'pointer',
              }}
            >
              {label}
            </button>
          );
        })}
      </header>
      }

      {/* 左侧导航栏 — 仅在个人空间页面显示
          - PC端：始终展开，固定宽度，主内容区留出对应左边距
          - 移动端：默认收起，点击汉堡按钮展开（覆盖在内容上，不挤内容） */}
      {currentPage === 'home' && (
        <Navbar isOpen={navOpen} onToggle={() => setNavOpen((v) => !v)} />
      )}

      {/* 粒子特效 — 仅首页显示，音乐页由 TargetCursor 接管交互视觉 */}
      {currentPage === 'home' && (
        <>
          <ScrollParticles />
          <MouseTrailParticles />
          <MouseClickRipple />
        </>
      )}

      {/* 自定义光标 — 仅 PC 端 + 首页显示（音乐页由 TargetCursor 接管），z-index 用常量保证在弹窗上方 */}
      {showCustomCursor && currentPage === 'home' && (
        <div
          className="fixed pointer-events-none select-none"
          style={{
            left: cursorPos.x + 10,
            top: cursorPos.y + 10,
            width: 28,
            height: 28,
            zIndex: 'var(--z-cursor)',
            backgroundImage: `url(${cursorImg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            transform: 'rotate(10deg)',
          }}
        />
      )}

      {/* 主内容区
          - 个人空间页 (home): 左侧留出导航栏宽度
          - 音乐分享页 (music): 全宽，由 MusicShare 自行控制版心
          - 互动入口 (game): 全宽，三消加载页 */}
      {currentPage === 'home' && (
        <main className="relative z-20 md:ml-44 lg:ml-56">
          <VideoShowcase onDialogOpenChange={handleDialogOpenChange} />
        </main>
      )}
      {currentPage === 'music' && (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <MusicShare onBack={() => setCurrentPage(hasPassedGame ? 'home' : 'game')} />
        </Suspense>
      )}
      {currentPage === 'game' && (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <GameLoading onComplete={handleGameComplete} />
        </Suspense>
      )}
      {currentPage === 'creator' && (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <CreatorPortfolio />
        </Suspense>
      )}
    </div>
  );
}
