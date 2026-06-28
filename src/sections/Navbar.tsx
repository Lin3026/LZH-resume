import { useState, useEffect } from 'react';

// 左侧导航栏 — 点击定位到对应模块区域
const NAV_ITEMS = [
  { id: 'hero',       label: '个人空间', icon: '🏠' },
  { id: 'about',      label: '关于我',   icon: '👤' },
  { id: 'experience', label: '工作经历', icon: '💼' },
  { id: 'work',       label: '工作内容', icon: '📝' },
  { id: 'works',      label: '作品展示', icon: '🎬' },
  { id: 'education',  label: '教育经历', icon: '🎓' },
  { id: 'skills',     label: '技术能力', icon: '⚡' },
  { id: 'contact',    label: '联系我',   icon: '✉️' },
];

// 各模块在背景图中的纵向位置（百分比，相对于 19197px 高度）
// 用于点击导航后平滑滚动定位
const SECTION_POSITIONS: Record<string, number> = {
  hero:       0,     // 顶部 0%
  about:      12,    // 12%
  experience: 24,    // 24%
  work:       38,    // 38%
  works:      54,    // 54%（作品展示区，12个视频槽位）
  education:  82,    // 82%
  skills:     88,    // 88%
  contact:    94,    // 94%
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');

  // 监听滚动，高亮当前所在模块
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / docHeight) * 100;

      // 找到当前滚动位置对应的模块
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
      className="fixed left-0 top-0 bottom-0 w-48 md:w-56 z-50
                 bg-gradient-to-b from-slate-900/95 via-blue-900/95 to-slate-900/95
                 backdrop-blur-xl border-r border-cyan-400/30 shadow-2xl shadow-black/40
                 flex flex-col"
      aria-label="主导航"
    >
      {/* 顶部 Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="text-cyan-300 font-mono font-bold text-2xl tracking-tight">
          {'</LZH>'}
        </div>
        <div className="text-cyan-100/60 text-xs mt-1 font-medium">林志辉 · 作品集</div>
      </div>

      {/* 导航项列表 */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-left transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-white border border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                  : 'text-cyan-100/70 hover:bg-white/5 hover:text-white border border-transparent'
                }
              `}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="font-medium text-sm md:text-base whitespace-nowrap">{item.label}</span>
              {/* 激活指示条 */}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* 底部信息 */}
      <div className="px-5 py-4 border-t border-white/10 text-cyan-100/40 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span>在线 · 欢迎交流</span>
        </div>
      </div>
    </nav>
  );
}
