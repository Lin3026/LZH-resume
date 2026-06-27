import { useState } from 'react';
import { workExperiences } from '../data/resumeData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function WorkTimeline() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section id="experience" className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 tracking-tight">
          工作经历
        </h2>
        <p className="text-cyan-200 text-lg text-center mb-20">积累成长，每一步都算数</p>

        <div className="relative">
          {/* 时间轴线 - 加粗 + 渐变 + 光晕 */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-teal-400 to-sky-400 transform md:-translate-x-1/2 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]" />

          <div className="space-y-16">
            {workExperiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              const isActive = activeId === exp.id;
              return (
                <div
                  key={exp.id}
                  className={`relative flex items-start gap-0 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  {/* 时间轴节点 - 放大 + 外圈光环 */}
                  <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`w-6 h-6 rounded-full border-[3px] cursor-pointer transition-all duration-300 flex items-center justify-center ${
                        isActive
                          ? 'bg-cyan-400 border-cyan-200 scale-125 shadow-[0_0_20px_rgba(34,211,238,0.8)]'
                          : 'bg-white border-cyan-500 hover:bg-cyan-50 hover:scale-110 shadow-lg shadow-cyan-500/30'
                      }`}
                      onClick={() => setActiveId(isActive ? null : exp.id)}
                    >
                      {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>

                  {/* 卡片区域 */}
                  <div
                    className={`ml-14 md:ml-0 w-full md:w-[calc(50%-2.5rem)] ${
                      isEven ? 'md:pr-10' : 'md:pl-10'
                    }`}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 bg-white/95 border-2 hover:border-cyan-500 shadow-xl ocean-card ${
                        isActive ? 'border-cyan-500 shadow-2xl shadow-cyan-500/30 scale-[1.02]' : 'border-blue-200'
                      }`}
                      onClick={() => setActiveId(isActive ? null : exp.id)}
                    >
                      <CardContent className="p-7">
                        {/* 时间段 - 加大加粗 */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded-lg mb-4">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full" />
                          <span className="text-base text-cyan-700 font-bold font-mono tracking-wide">
                            {exp.startDate} → {exp.endDate}
                          </span>
                        </div>

                        {/* 公司 - 加大 */}
                        <h3 className="text-2xl font-bold text-blue-900 mb-1 tracking-tight">{exp.company}</h3>
                        {/* 职位 - 加大 */}
                        <p className="text-cyan-700 text-lg font-medium mb-4">{exp.position}</p>

                        {/* 展开内容 - 加大行高和字号 */}
                        <div
                          className={`overflow-hidden transition-all duration-500 ${
                            isActive ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="pt-3 border-t border-blue-100">
                            <p className="text-blue-800 text-base leading-loose whitespace-pre-line">
                              {exp.description}
                            </p>
                          </div>
                        </div>

                        {/* 项目标签 - 加大 */}
                        <div className="flex flex-wrap gap-2 mt-5">
                          {exp.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-medium"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 另一侧年份标签（仅桌面端）- 放大但避免重合 */}
                  <div
                    className={`hidden md:flex w-[calc(50%-2.5rem)] items-center ${
                      isEven ? 'pl-10 justify-start' : 'pr-10 justify-end'
                    }`}
                  >
                    <span className="text-cyan-300/60 text-2xl font-bold font-mono select-none">
                      {exp.startDate.split('-')[0]}
                    </span>
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
