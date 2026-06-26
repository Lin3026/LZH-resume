import { personalInfo } from '../data/resumeData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 背景网格 */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* 光晕 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-15 animate-pulse delay-1000" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* 头像 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-400 shadow-2xl shadow-purple-500/50 overflow-hidden bg-slate-800">
              <img
                src={personalInfo.avatar}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&size=160&background=6d28d9&color=fff`;
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs">
              ✓
            </div>
          </div>
        </div>

        {/* 姓名 */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
          {personalInfo.name}
        </h1>

        {/* 职位 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {personalInfo.title.split(' / ').map((t) => (
            <Badge
              key={t}
              className="text-sm md:text-base px-4 py-1.5 bg-purple-500/30 text-purple-200 border border-purple-400/50 backdrop-blur-sm"
            >
              {t}
            </Badge>
          ))}
        </div>

        {/* 简介 */}
        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 whitespace-pre-line">
          {personalInfo.bio}
        </p>

        {/* 联系信息 */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 text-slate-400 text-sm">
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

        {/* 按钮 */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-2.5 rounded-full shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            查看作品
          </Button>
          <Button
            variant="outline"
            className="border-slate-500 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-2.5 rounded-full transition-all hover:scale-105"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            联系我
          </Button>
          {personalInfo.github && (
            <Button
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-2.5 rounded-full transition-all hover:scale-105"
              onClick={() => window.open(personalInfo.github, '_blank')}
            >
              🐙 GitHub
            </Button>
          )}
        </div>
      </div>

      {/* 向下滚动提示 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-purple-400 rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
