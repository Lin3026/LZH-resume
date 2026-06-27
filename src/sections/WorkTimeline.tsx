import { workExperiences } from '../data/resumeData';
import { CardContent } from '@/components/ui/card';

// 海洋图标 SVG 组件（每个卡片用不同的贝壳/海洋生物颜色）
const SHELL_ICONS = [
  // 蓝色贝壳
  <svg key="shell-0" viewBox="0 0 64 64" className="w-12 h-12" fill="none">
    <path d="M32 8C18 8 4 22 4 36c0 14 14 24 28 24s28-10 28-24c0-14-14-28-28-28z"
      fill="#7dd3fc" stroke="#0ea5e9" strokeWidth="2"/>
    <path d="M20 30 Q32 16 44 30 M24 34 Q32 22 40 34 M26 38 Q32 28 38 38"
      stroke="#0284c7" strokeWidth="2" fill="none" opacity="0.5"/>
    <ellipse cx="32" cy="42" rx="4" ry="2" fill="#0ea5e9" opacity="0.3"/>
  </svg>,
  // 青色贝壳
  <svg key="shell-1" viewBox="0 0 64 64" className="w-12 h-12" fill="none">
    <path d="M32 8C18 8 4 22 4 36c0 14 14 24 28 24s28-10 28-24c0-14-14-28-28-28z"
      fill="#67e8f9" stroke="#06b6d4" strokeWidth="2"/>
    <path d="M20 30 Q32 16 44 30 M24 34 Q32 22 40 34 M26 38 Q32 28 38 38"
      stroke="#0891b2" strokeWidth="2" fill="none" opacity="0.5"/>
    <ellipse cx="32" cy="42" rx="4" ry="2" fill="#06b6d4" opacity="0.3"/>
  </svg>,
  // 紫色贝壳
  <svg key="shell-2" viewBox="0 0 64 64" className="w-12 h-12" fill="none">
    <path d="M32 8C18 8 4 22 4 36c0 14 14 24 28 24s28-10 28-24c0-14-14-28-28-28z"
      fill="#d8b4fe" stroke="#a855f7" strokeWidth="2"/>
    <path d="M20 30 Q32 16 44 30 M24 34 Q32 22 40 34 M26 38 Q32 28 38 38"
      stroke="#7c3aed" strokeWidth="2" fill="none" opacity="0.5"/>
    <ellipse cx="32" cy="42" rx="4" ry="2" fill="#a855f7" opacity="0.3"/>
  </svg>,
  // 粉色贝壳
  <svg key="shell-3" viewBox="0 0 64 64" className="w-12 h-12" fill="none">
    <path d="M32 8C18 8 4 22 4 36c0 14 14 24 28 24s28-10 28-24c0-14-14-28-28-28z"
      fill="#fda4af" stroke="#ec4899" strokeWidth="2"/>
    <path d="M20 30 Q32 16 44 30 M24 34 Q32 22 40 34 M26 38 Q32 28 38 38"
      stroke="#db2777" strokeWidth="2" fill="none" opacity="0.5"/>
    <ellipse cx="32" cy="42" rx="4" ry="2" fill="#ec4899" opacity="0.3"/>
  </svg>,
];

// 海星装饰
const STARFISH = (
  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
    <path d="M24 4 L27 17 L40 15 L31 25 L38 37 L25 31 L13 39 L19 26 L6 21 L19 17 Z"
      fill="#fb923c" stroke="#ea580c" strokeWidth="1.5"/>
    <circle cx="24" cy="23" r="3" fill="#fed7aa"/>
  </svg>
);

export default function WorkTimeline() {
  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      {/* 标题区域 */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-4 relative">
          <span className="text-amber-400 text-3xl animate-pulse">★</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-400 text-transparent bg-clip-text drop-shadow-[0_4px_12px_rgba(34,211,238,0.4)]">
            工作经历
          </h2>
          <span className="text-amber-400 text-3xl animate-pulse delay-500">★</span>
        </div>
        <div className="relative inline-block mx-auto">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 rounded-full transform rotate-[-1deg] shadow-lg shadow-amber-500/30" />
          <p className="relative z-10 px-8 py-1.5 text-white font-bold tracking-wider text-base drop-shadow-sm">
            成长不止步，奋斗写一步
          </p>
        </div>
      </div>

      {/* 时间轴主体 - 单列布局：年份在左，卡片在右 */}
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="relative pl-16 md:pl-24">
          {/* 时间轴线 - 白色虚线 */}
          <div
            className="absolute left-6 md:left-12 top-0 bottom-0 border-l-[3px] border-dashed border-white/70"
          />

          <div className="space-y-10">
            {workExperiences.map((exp, index) => {
              const year = exp.startDate.split('-')[0];
              const shellIcon = SHELL_ICONS[index % SHELL_ICONS.length];

              return (
                <div key={exp.id} className="relative flex items-stretch group">
                  {/* 时间轴节点圆圈 */}
                  <div className="absolute -left-[2rem] md:-left-[3rem] w-6 h-6 mt-6 rounded-full border-[3px] border-white bg-cyan-900/80 shadow-[0_0_10px_rgba(255,255,255,0.5)] flex-shrink-0 z-10">
                    <div className="absolute inset-1 rounded-full bg-white/50" />
                  </div>

                  {/* 年份标签 - 在时间线左侧（桌面端）- 统一字体 */}
                  <div className="hidden md:flex absolute left-0 -translate-x-full items-center justify-end pr-4 mt-6">
                    <span className="text-2xl font-bold font-mono text-amber-300 select-none whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                      {year}年
                    </span>
                  </div>

                  {/* 移动端年份 - 统一字体格式 */}
                  <div className="md:hidden absolute -left-16 top-0">
                    <span className="text-xl font-bold font-mono text-amber-300 select-none whitespace-nowrap">
                      {year}年
                    </span>
                  </div>

                  {/* 卡片内容区 */}
                  <div className="flex-1 ml-0 md:ml-8 relative">
                    <div className="bg-white/80 border-2 border-blue-200/60 rounded-2xl p-5 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-400/70 ocean-card group-hover:-translate-y-0.5">
                      <CardContent className="p-0 flex gap-4 items-center">
                        {/* 左侧贝壳图标 */}
                        <div className="flex-shrink-0">
                          {shellIcon}
                        </div>

                        {/* 文字内容 - 保留岗位 / 公司 + 工作时间段 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl md:text-2xl font-bold text-blue-900 leading-tight mb-2">
                            {exp.position} <span className="text-cyan-500 mx-1">/</span> {exp.company}
                          </h3>
                          {/* 工作时间段 */}
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0" />
                            <span className="text-sm font-semibold text-cyan-700 font-mono tracking-wide">
                              {exp.startDate} — {exp.endDate}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* 右侧海星装饰（奇数项显示） */}
                    {index % 2 === 1 && (
                      <div className="hidden lg:block absolute -right-6 top-4 -translate-x-full opacity-50 group-hover:opacity-80 transition-opacity">
                        {STARFISH}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
