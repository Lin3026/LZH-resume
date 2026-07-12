import './Starfield.css';

/**
 * 全局宇宙星空背景
 * - 固定铺满视口、置于最底层（z-index:0），不拦截任何交互
 * - 深空星云渐变底 + 三层不同密度/大小的星点（错峰闪烁）
 * - 偶尔划过的流星，增强「宇宙」氛围
 * - 仅动画 opacity / transform，GPU 友好；尊重 prefers-reduced-motion
 */
export default function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield-layer s1" />
      <div className="starfield-layer s2" />
      <div className="starfield-layer s3" />
      <div className="shooting-star ss1" />
      <div className="shooting-star ss2" />
      <div className="shooting-star ss3" />
    </div>
  );
}
