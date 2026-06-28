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

// 各模块在背景图中的纵向位置（百分比，相对于 19197px 高度）
const SECTION_POSITIONS: Record<string, number> = {
  hero:       0,
  about:      12,
  experience: 24,
  work:       38,
  works:      54,
  education:  82,
  skills:     88,
  contact:    94,
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');

  // 监听滚动，高亮当前所在模块
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / docHeight) * 100;

      let current = 'hero';
      for (const item of NAV_ITEMS) {
        const pos = SECTION_POSITIONS[item.id];
        if (scrollPercent >= pos - 3) {
          current = item.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 点击导航项 — 平滑滚动到对应位置
  const handleClick = (id: string) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetPercent = SECTION_POSITIONS[id] || 0;
    const targetY = (targetPercent / 100) * docHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed left-0 top-0 bottom-0 w-44 sm:w-48 md:w-52 lg:w-56 z-50
                 border-r border-white/20 shadow-2xl shadow-black/40
                 flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${navbarBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
      aria-label="主导航"
    >
      {/* 顶部 Logo */}
      <div className="relative px-4 sm:px-5 py-5 sm:py-6 border-b border-white/15">
        <div className="text-cyan-300 font-mono font-bold text-xl sm:text-2xl tracking-tight drop-shadow-md">
          {'</LZH>'}
        </div>
        <div className="text-cyan-100/70 text-xs mt-1 font-medium drop-shadow-sm">林志辉 · 作品集</div>
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
              className={`
                w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                text-left transition-all duration-200 group
                ${isActive
                  ? 'bg-white/20 text-white border border-white/40 shadow-lg shadow-cyan-500/20 backdrop-blur-sm'
                  : 'text-white/85 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                }
              `}
            >
              {/* 自定义图标 */}
              <img
                src={item.icon}
                alt={item.label}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 object-contain drop-shadow-md transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
                draggable={false}
              />
              <span className={`font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {/* 激活指示条 */}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-sm shadow-cyan-300/60" />
              )}
            </button>
          );
        })}
      </div>

      {/* 底部信息 */}
      <div className="relative px-4 sm:px-5 py-3 sm:py-4 border-t border-white/15 text-white/50 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-300/60" />
          <span>在线 · 欢迎交流</span>
        </div>
      </div>
    </nav>
  );
}
