import { useState, useEffect, useRef, useCallback } from 'react';
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
// 用户PS精确测量（终稿1.jpg 2560×15745）：
//   个人空间=0px      关于我=1440px    工作经历=2840px   工作内容=4280px
//   作品展示=9180px   教育经历=11425px 技术能力=12867px  联系我=14306px
const SECTION_POSITIONS: Record<string, number> = {
  hero:       0,
  about:      9.15,
  experience: 18.04,
  work:       27.18,
  works:      57.99,    // 9180/15745
  education:  72.56,    // 11425/15745
  skills:     81.72,    // 12867/15745
  contact:    90.72,    // 14306/15745
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
  // 使用视口参考点（从视口顶部往下 35%），比纯百分比更稳，且兜底底部激活“联系我”
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docTotalHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;

      // 用户视线参考点：视口顶部往下 35% 处
      const viewportRef = scrollY + innerHeight * 0.35;

      let current = 'hero';
      for (const item of NAV_ITEMS) {
        const posPixel = (SECTION_POSITIONS[item.id] / 100) * docTotalHeight;
        if (viewportRef >= posPixel) {
          current = item.id;
        }
      }

      // 兜底：滚动到接近底部时，强制激活最后一个模块“联系我”
      const maxScroll = docTotalHeight - innerHeight;
      if (maxScroll > 0 && scrollY >= maxScroll - 50) {
        current = 'contact';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始化一次
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

  // —— 磁吸效果（proximity）：光标靠近时整项向右位移 + 放大，离开还原 ——
  // 参考 LineSidebar 的 rAF 指数缓动，使 effect 平滑过渡而非生硬跳变
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const PROXIMITY_RADIUS = 90; // 光标到 item 中心的感应半径(px)
  const PROXIMITY_SMOOTHING = 90; // 缓动时间常数(ms)，越小越跟手

  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(PROXIMITY_SMOOTHING, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);
    let moving = false;
    const els = itemRefs.current;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      const target = targetsRef.current[i] || 0;
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty('--effect', value.toFixed(4));
      if (!settled) moving = true;
    }
    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const list = listRef.current;
      if (!list) return;
      const listRect = list.getBoundingClientRect();
      const pointerY = e.clientY - listRect.top;
      const els = itemRefs.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) {
          targetsRef.current[i] = 0;
          continue;
        }
        const r = el.getBoundingClientRect();
        const center = r.top - listRect.top + r.height / 2;
        const distance = Math.abs(pointerY - center);
        // smoothstep 衰减：越近 effect 越接近 1
        const p = Math.max(0, 1 - distance / PROXIMITY_RADIUS);
        targetsRef.current[i] = p * p * (3 - 2 * p);
      }
      startLoop();
    },
    [startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

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
                    flex flex-col overflow-visible
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
        {/* 导航项列表 — 顶部留出 40px 给固定导航栏；挂载磁吸 proximity 监听 */}
        <div
          ref={listRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative flex-1 pt-10 pb-3 px-2 space-y-0.5"
        >
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                onClick={() => handleClick(item.id)}
                className="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left group border hover:bg-white/10 hover:border-white/30 transition-[background-color,border-color,box-shadow] duration-200"
                style={{
                  // 内联样式确保移动端不被默认 appearance 覆盖
                  backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : 'transparent',
                  borderColor: isActive ? 'rgba(255,255,255,0.45)' : 'transparent',
                  boxShadow: isActive ? '0 4px 16px rgba(0,200,255,0.25)' : 'none',
                  // 磁吸：光标靠近时整项向右位移(拉伸) + 放大 + 提亮；transform-origin 左对齐呈拉伸感
                  transform:
                    'translateX(calc(var(--effect, 0) * 14px)) scale(calc(1 + var(--effect, 0) * 0.12))',
                  transformOrigin: 'left center',
                  filter: 'brightness(calc(1 + var(--effect, 0) * 0.25))',
                  willChange: 'transform',
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
        <div className="relative px-5 py-4 text-white/50 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-300/60" />
            <span>在线 · 欢迎交流</span>
          </div>
        </div>
      </nav>
    </>
  );
}
