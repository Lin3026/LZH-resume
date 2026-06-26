import { useState } from 'react';
import { skills } from '../data/resumeData';

const levelLabels = ['', '入门', '熟悉', '熟练', '精通', '专家'];
const levelColors = ['', 'bg-slate-600', 'bg-blue-600', 'bg-cyan-500', 'bg-purple-500', 'bg-gradient-to-r from-purple-500 to-pink-500'];

export default function SkillsSection() {
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredSkills = skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-20 bg-slate-900">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          技术能力
        </h2>
        <p className="text-slate-400 text-center mb-12">工欲善其事，必先利其器</p>

        {/* 分类标签 */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 技能网格 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{skill.icon}</span>
                <div>
                  <span className="text-white font-medium text-sm">{skill.name}</span>
                  <div className="text-xs text-purple-400">{levelLabels[skill.level]}</div>
                </div>
              </div>
              {/* 进度条 */}
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${levelColors[skill.level]}`}
                  style={{ width: `${(skill.level / 5) * 100}%` }}
                />
              </div>
              {/* 小圆点 */}
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      dot <= skill.level ? 'bg-purple-400' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
