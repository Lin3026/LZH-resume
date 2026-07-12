import { useEffect, useRef, useState } from 'react';
import LineSidebar from './LineSidebar';

interface NavItem {
  label: string;
  id: string;
}

// 与页面板块顺序一致，点击滚动 + 滚动联动高亮
const NAV_ITEMS: NavItem[] = [
  { label: '首屏', id: 'hero' },
  { label: '环球展示', id: 'dome' },
  { label: '关于我', id: 'about' },
  { label: '工作经历', id: 'services' },
  { label: '工作内容', id: 'projects' },
  { label: '作品解析', id: 'showcase' },
  { label: '教育经历', id: 'education' },
  { label: '联系方式', id: 'contact' },
];

export default function CreatorSidebar() {
  const [active, setActive] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const ratiosRef = useRef<Record<string, number>>({});

  // 入场时机：滚动到「环球展示」(dome) 露出 50% 时才从左侧滑入；
  // 滚回「首屏」(hero) 时再缩回左边
  useEffect(() => {
    const dome = document.getElementById('dome');
    const hero = document.getElementById('hero');
    if (!dome && !hero) return;
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'dome') {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              setVisible(true);
            }
          } else if (entry.target.id === 'hero') {
            if (entry.isIntersecting) setVisible(false);
          }
        });
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] }
    );
    if (dome) ob.observe(dome);
    if (hero) ob.observe(hero);
    return () => ob.disconnect();
  }, []);

  // 滚动联动：被视口中线穿过的板块设为高亮
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          ratiosRef.current[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
        });
        let bestIdx = 0;
        let bestRatio = -1;
        NAV_ITEMS.forEach((it, i) => {
          const r = ratiosRef.current[it.id] ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestIdx = i;
          }
        });
        if (bestRatio > 0) setActive(bestIdx);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    NAV_ITEMS.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = (index: number, _label: string) => {
    const id = NAV_ITEMS[index].id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(index);
  };

  return (
    <aside
      className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-40 hidden md:block"
      aria-label="板块导航"
    >
      <div
        className={`rounded-2xl px-4 py-5 transition-all duration-500 ease-out ${
          visible ? 'translate-x-0 opacity-100' : '-translate-x-[140%] opacity-0'
        }`}
        style={{
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        }}
      >
        <LineSidebar
          items={NAV_ITEMS.map((it) => it.label)}
          active={active}
          defaultActive={0}
          accentColor="#22d3ee"
          textColor="#cbd5e1"
          markerColor="#475569"
          showIndex
          showMarker
          proximityRadius={90}
          maxShift={16}
          markerLength={42}
          markerGap={0}
          tickScale={0.5}
          scaleTick
          itemGap={18}
          fontSize={1}
          smoothing={120}
          onItemClick={handleClick}
        />
      </div>
    </aside>
  );
}
