import { FadeIn } from './components';

/**
 * 首屏 Hero — 白底线稿风格（参考用户提供的参考图）
 * 布局：左侧大标题 + 按钮 | 右侧人物线稿插画
 */
const BASE = import.meta.env.BASE_URL;
// v5: premultiply 去蓝边（直通alpha源 → 预乘后VP9+alpha，Safari退H.264黑底）
const HERO_VIDEO_WEBM = `${BASE}hero-video-v5.webm`;
const HERO_VIDEO_MP4 = `${BASE}hero-video-v5.mp4`;

export default function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      {/* 主内容区：左文字 + 右插画 */}
      <div className="hero-body">
        {/* 左侧文字 */}
        <div className="hero-left">
          <FadeIn delay={0.12} y={32}>
            <h1 className="hero-title">
              你好，
              <br />
              我是林志辉
            </h1>
          </FadeIn>

          <FadeIn delay={0.28} y={24}>
            <p className="hero-subtitle">
              {'站得高  看得远  想得开  看得透  拿得起  放得下'}
            </p>
          </FadeIn>

          <FadeIn delay={0.42} y={20}>
            <button
              type="button"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="hero-cta"
            >
              了解更多
              <svg className="hero-cta-arrow" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </FadeIn>

          {/* 基本信息：年龄 / 性别 / 地点 */}
          <FadeIn delay={0.52} y={16} className="hero-info-row">
            <span className="hero-info-tag">32岁</span>
            <span className="hero-info-tag">男</span>
            <span className="hero-info-tag">北京·昌平</span>
          </FadeIn>
        </div>

        {/* 右侧视频（替换原线稿插画） */}
        <div className="hero-right">
          <FadeIn delay={0.35} y={30}>
            <video
              ref={(el) => { if (el) el.muted = true; }}
              className="hero-illustration"
              autoPlay
              muted
              loop
              playsInline
              draggable={false}
            >
              <source src={HERO_VIDEO_WEBM} type="video/webm" />
              <source src={HERO_VIDEO_MP4} type="video/mp4" />
            </video>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
