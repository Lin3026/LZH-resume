import { personalInfo } from '../data/resumeData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 背景网格 - 海洋波纹 */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* 光晕 - 海洋波光效果 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-400 rounded-full filter blur-3xl opacity-15 animate-pulse delay-1000" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* 头像 - 直接在深色背景上 */}
        <div className="mb-6 flex justify-center relative">
          <div className="relative">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50 overflow-hidden bg-slate-800">
              <img
                src={personalInfo.avatar}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&size=160&background=0891b2&color=fff`;
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-400 rounded-full border-2 border-white flex items-center justify-center text-xs">
              ✓
            </div>
          </div>
        </div>

        {/* 姓名 - 直接在深色背景上，白色文字 */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          {personalInfo.name}
        </h1>

        {/* 职位 - 直接在深色背景上 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {personalInfo.title.split(' / ').map((t) => (
            <Badge
              key={t}
              className="text-sm md:text-base px-4 py-1.5 bg-cyan-500/20 text-cyan-100 border border-cyan-400/50 font-medium backdrop-blur-sm"
            >
              {t}
            </Badge>
          ))}
        </div>

        {/* 个人简介白框 - 只包住简介文字，带海洋装饰 */}
        <div className="relative bg-white/85 border-2 border-cyan-200 rounded-3xl p-7 md:p-10 shadow-2xl shadow-cyan-500/20 overflow-hidden ocean-card mb-8 max-w-2xl mx-auto">
          {/* 海洋装饰 - 左上角波纹 */}
          <svg className="absolute -top-6 -left-6 w-32 h-32 text-cyan-200/40" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <path d="M0,20 Q25,10 50,20 T100,20" stroke="currentColor" strokeWidth="2" />
            <path d="M0,35 Q25,25 50,35 T100,35" stroke="currentColor" strokeWidth="2" />
            <path d="M0,50 Q25,40 50,50 T100,50" stroke="currentColor" strokeWidth="2" />
          </svg>
          {/* 海洋装饰 - 右下角气泡 */}
          <svg className="absolute -bottom-4 -right-4 w-28 h-28 text-teal-200/40" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <circle cx="20" cy="80" r="8" stroke="currentColor" strokeWidth="2" />
            <circle cx="45" cy="60" r="12" stroke="currentColor" strokeWidth="2" />
            <circle cx="70" cy="35" r="6" stroke="currentColor" strokeWidth="2" />
            <circle cx="85" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
          </svg>

          {/* 简介文字 */}
          <p className="relative text-blue-800 text-base md:text-lg leading-loose whitespace-pre-line text-left">
            {personalInfo.bio}
          </p>
        </div>

        {/* 联系信息 - 直接在深色背景上，浅色文字 */}
        <div className="flex flex-wrap justify-center gap-5 mb-7 text-cyan-100 text-sm font-medium drop-shadow">
          <span className="flex items-center gap-1.5">
            <span>📍</span> {personalInfo.location}
          </span>
          <span className="flex items-center gap-1.5">
            <span>✉️</span> {personalInfo.email}
          </span>
          <span className="flex items-center gap-1.5">
            <span>📱</span> {personalInfo.phone}
          </span>
        </div>

        {/* 按钮 - 直接在深色背景上 */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2.5 rounded-full shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            查看作品
          </Button>
          <Button
            variant="outline"
            className="border-cyan-400 text-cyan-100 hover:bg-cyan-500/20 hover:text-white px-8 py-2.5 rounded-full transition-all hover:scale-105 bg-white/5 backdrop-blur-sm"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            联系我
          </Button>
          {personalInfo.github && (
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-100 hover:bg-cyan-500/20 hover:text-white px-8 py-2.5 rounded-full transition-all hover:scale-105 bg-white/5 backdrop-blur-sm"
              onClick={() => window.open(personalInfo.github, '_blank')}
            >
              🐙 GitHub
            </Button>
          )}
        </div>
      </div>

      {/* 向下滚动提示 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-300 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
