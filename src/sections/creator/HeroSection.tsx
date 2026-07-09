import { FadeIn } from './components';

/**
 * 首屏 Hero — 白底线稿风格（参考用户提供的参考图）
 * 布局：左侧大标题 + 按钮 | 右侧人物线稿插画
 */
const BASE = import.meta.env.BASE_URL;
const HERO_ILLUSTRATION = `${BASE}hero-illustration.jpg`;

const NAV_LINKS = [
  { label: '关于', target: 'about' },
  { label: '工作经历', target: 'services' },
  { label: '项目', target: 'projects' },
];

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      {/* 顶部导航 */}
      <FadeIn delay={0} y={-16} className="hero-nav-wrap">
        <nav className="hero-nav">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollTo(link.target)}
              className="hero-nav-link"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </FadeIn>

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
              游戏广告创意设计师 32岁
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
        </div>

        {/* 右侧插画 */}
        <div className="hero-right">
          <FadeIn delay={0.35} y={30}>
            <img
              src={HERO_ILLUSTRATION}
              alt="人物线稿插画"
              className="hero-illustration"
              draggable={false}
              loading="eager"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
