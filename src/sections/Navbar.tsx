import { useState, useEffect } from 'react';
import navbarBg from '../assets/navbar-bg.jpg';
import iconHome from '../assets/icons/个人空间.png';
import iconAbout from '../assets/icons/关于我.png';
import iconExp from '../assets/icons/工作经历.png';
import iconWork from '../assets/icons/工作内容.png';
import iconWorks from '../assets/icons/作品展示.png';
import iconEdu from '../assets/icons/教育经历.png';
import iconSkills from '../assets/icons/技术能力.png';
import iconContact from '../assets/icons/联系我.png';

// 左侧导航栏 — 点击定位到对应模块区域
const NAV_ITEMS = [
  { id: 'hero',       label: '个人空间', icon: iconHome },
  { id: 'about',      label: '关于我',   icon: iconAbout },
  { id: 'experience', label: '工作经历', icon: iconExp },
  { id: 'work',       label: '工作内容', icon: iconWork },
  { id: 'works',      label: '作品展示', icon: iconWorks },
  { id: 'education',  label: '教育经历', icon: iconEdu },
  { id: 'skills',     label: '技术能力', icon: iconSkills },
  { id: 'contact',    label: '联系我',   icon: iconContact },
];

// 各模块标题在背景图中的纵向位置（百分比，相对于 15745px 高度）
// 基于新背景图 2560×15745 视觉估算：
//   个人空间=0px      关于我=1440px    工作经历=2840px   工作内容=4280px
//   作品展示=9000px   教育经历=12200px 技术能力=13600px  联系我=14800px
const SECTION_POSITIONS: Record<string, number> = {
  hero:       0,
  about:      9.15,
  experience: 18.04,
  work:       27.18,
  works:      57.16,
  education:  77.48,
  skills:     86.38,
  contact:    94.00,
};

interface NavbarProps {
  /** 当前是否展开（移动端控制） */
  isOpen: boolean;
  /** 切换展开/收起 */
  onToggle: () => void;
}

export default function Navbar({ isOpen, onToggle }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('hero');

  // 监听滚动，高亮当前所在模块
  // 注意：百分比基于背景图原始高度(15745px)，而背景图实际高度 ≈ scrollHeight
  // 因此分母必须用 scrollHeight，不能用 (scrollHeight - innerHeight)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docTotalHeight = document.documentElement.scrollHeight;

      const scrollPercent = (scrollY / docTotalHeight) * 100;

      let current = 'hero';
      for (const item of NAV_ITEMS) {
        const pos = SECTION_POSITIONS[item.id];
        if (scrollPercent >= pos - 1.5) {
          current = item.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 点击导航项 — 平滑滚动到对应位置（移动端点击后自动收起）
  // 百分比基于背景图高度(≈scrollHeight)，不是可滚动距离
  const handleClick = (id: string) => {
    const docTotalHeight = document.documentElement.scrollHeight;
    const targetPercent = SECTION_POSITIONS[id] || 0;
    const targetY = (targetPercent / 100) * docTotalHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    // 移动端点击后收起
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* 移动端遮罩层 — 展开时显示，点击关闭 */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* 移动端切换按钮（汉堡菜单） — 仅 <768px 显示 */}
      <button
        type="button"
        onClick={onToggle}
        className="nav-btn md:hidden fixed top-4 left-4 z-50 w-11 h-11 rounded-xl border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-black/40 transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
        aria-label={isOpen ? '收起导航' : '展开导航'}
      >
        {isOpen ? (
          // 关闭图标 X
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          // 汉堡图标
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        )}
      </button>

      {/* 导航栏主体
          - PC端 (md+): 始终展开，translateX(0)
          - 移动端: 根据 isOpen 控制位移 */}
      <nav
        className={`fixed left-0 top-0 bottom-0 w-52 md:w-44 lg:w-56 z-50
                    border-r border-white/20 shadow-2xl shadow-black/40
                    flex flex-col overflow-hidden
                    transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{
          backgroundImage: `url(${navbarBg})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
        aria-label="主导航"
      >
        {/* 顶部 Logo */}
        <div className="relative px-5 py-6 border-b border-white/15">
          <div className="text-cyan-300 font-mono font-bold text-2xl tracking-tight drop-shadow-md">
            {'</LZH>'}
          </div>
          <div className="text-cyan-100/70 text-xs mt-1 font-medium drop-shadow-sm">林志辉 · 个人空间</div>
        </div>

        {/* 导航项列表 */}
        <div className="relative flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item.id)}
                className="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group border"
                style={{
                  // 内联样式确保移动端不被默认 appearance 覆盖
                  backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : 'transparent',
                  borderColor: isActive ? 'rgba(255,255,255,0.45)' : 'transparent',
                  boxShadow: isActive ? '0 4px 16px rgba(0,200,255,0.25)' : 'none',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-8 h-8 flex-shrink-0 object-contain transition-transform duration-200"
                  style={{
                    // 选中时图标加亮发光，未选中时正常
                    filter: isActive
                      ? 'brightness(1.4) drop-shadow(0 0 6px rgba(0,220,255,0.7))'
                      : 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))',
                    transform: isActive ? 'scale(1.1)' : undefined,
                  }}
                  draggable={false}
                />
                <span
                  className="font-medium whitespace-nowrap transition-colors"
                  style={{
                    color: isActive ? '#ffffff' : 'rgb(0, 150, 245)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '14px',
                  }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-sm shadow-cyan-300/60" />
                )}
              </button>
            );
          })}
        </div>

        {/* 底部信息 */}
        <div className="relative px-5 py-4 border-t border-white/15 text-white/50 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-300/60" />
            <span>在线 · 欢迎交流</span>
          </div>
        </div>
      </nav>
    </>
  );
}
