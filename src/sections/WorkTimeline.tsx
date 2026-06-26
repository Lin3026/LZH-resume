import { useState } from 'react';
import { workExperiences } from '../data/resumeData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function WorkTimeline() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section id="experience" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          工作经历
        </h2>
        <p className="text-slate-400 text-center mb-16">积累成长，每一步都算数</p>

        <div className="relative">
          {/* 时间轴线 */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500 transform md:-translate-x-1/2" />

          <div className="space-y-12">
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
                  {/* 时间轴点 */}
                  <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`w-4 h-4 rounded-full border-2 cursor-pointer transition-all duration-300 ${
                        isActive
                          ? 'bg-purple-400 border-purple-300 scale-150 shadow-lg shadow-purple-500/50'
                          : 'bg-slate-700 border-purple-500 hover:bg-purple-500 hover:scale-125'
                      }`}
                      onClick={() => setActiveId(isActive ? null : exp.id)}
                    />
                  </div>

                  {/* 卡片区域 */}
                  <div
                    className={`ml-12 md:ml-0 w-full md:w-[calc(50%-2rem)] ${
                      isEven ? 'md:pr-8' : 'md:pl-8'
                    }`}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 bg-slate-800 border-slate-700 hover:border-purple-500/50 ${
                        isActive ? 'border-purple-500 shadow-xl shadow-purple-500/20' : ''
                      }`}
                      onClick={() => setActiveId(isActive ? null : exp.id)}
                    >
                      <CardContent className="p-5">
                        {/* 时间段 */}
                        <div className="text-xs text-purple-400 font-mono mb-2">
                          {exp.startDate} → {exp.endDate}
                        </div>

                        {/* 公司 & 职位 */}
                        <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                        <p className="text-purple-300 text-sm mb-3">{exp.position}</p>

                        {/* 展开内容 */}
                        <div
                          className={`overflow-hidden transition-all duration-500 ${
                            isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p className="text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-line">
                            {exp.description}
                          </p>
                        </div>

                        {/* 技术标签 */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {exp.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="text-xs bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 另一侧时间标签（仅桌面端） */}
                  <div
                    className={`hidden md:flex w-[calc(50%-2rem)] items-center ${
                      isEven ? 'pl-8 justify-start' : 'pr-8 justify-end'
                    }`}
                  >
                    <span className="text-slate-500 text-sm font-mono">
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
