import './Starfield.css';
import { useEffect, useRef } from 'react';

/**
 * 全局宇宙星空背景
 * - 随页面滚动铺满整篇文档、置于最底层（z-index:0），不拦截任何交互
 * - 深空星云渐变底 + 三层不同密度/大小的星点（错峰闪烁）
 * - 偶尔划过的流星（固定视口内、不随文档滚动），增强「宇宙」氛围
 * - 指针视差：鼠标/触摸移动时，三层星点以不同深度做反向位移，营造纵深感
 *   —— 仅用 transform + CSS 变量，rAF 节流，纯 GPU 合成，零 layout/paint
 * - 尊重 prefers-reduced-motion：用户偏好减少动态时完全不监听
 */
export default function Starfield() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 用户偏好减少动态：不启用视差
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const loop = () => {
      // 缓动跟随，避免生硬跳变
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      el.style.setProperty('--mx', curX.toFixed(3));
      el.style.setProperty('--my', curY.toFixed(3));
      // 接近目标即停止 rAF，静止时不占 CPU
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      // 归一化到 [-1, 1]，中心为 0
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // passive：不阻塞滚动；pointermove 同时覆盖鼠标 / 触摸 / 触控笔
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="starfield" aria-hidden="true" ref={ref}>
      <div className="starfield-layer s1" />
      <div className="starfield-layer s2" />
      <div className="starfield-layer s3" />
      <div className="shooting-star ss1" />
      <div className="shooting-star ss2" />
      <div className="shooting-star ss3" />
    </div>
  );
}
