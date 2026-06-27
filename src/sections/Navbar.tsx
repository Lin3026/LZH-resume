import { useState, useEffect } from 'react';

const navItems = [
  { id: 'hero', label: '首页' },
  { id: 'experience', label: '工作经历' },
  { id: 'education', label: '教育经历' },
  { id: 'skills', label: '技能' },
  { id: 'work-content', label: '工作内容' },
  { id: 'projects', label: '作品展示' },
  { id: 'contact', label: '联系我' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navItems.map((item) => document.getElementById(item.id));
      let current: HTMLElement | null = null;
      for (const section of sections) {
        if (section && window.scrollY >= section.offsetTop - 100) {
          current = section;
        }
      }
      if (current) setActiveSection(current.id);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            className="text-white font-bold text-lg hover:text-cyan-400 transition-colors"
            onClick={() => scrollTo('hero')}
          >
            <span className="text-cyan-400">&lt;</span>LZH
            <span className="text-cyan-400">/&gt;</span>
          </button>

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-cyan-600/20 text-cyan-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 移动端汉堡菜单 */}
          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* 移动端菜单抽屉 */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
          mobileOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* 背景遮罩 */}
        <div
          className={`absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        {/* 抽屉 */}
        <div
          className={`absolute top-16 right-0 w-64 bg-slate-900 border-l border-slate-800 h-full transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-cyan-600/20 text-cyan-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
