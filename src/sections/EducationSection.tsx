import { educations } from '../data/resumeData';
import { Card, CardContent } from '@/components/ui/card';

export default function EducationSection() {
  return (
    <section id="education" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 tracking-tight">
          教育经历
        </h2>
        <p className="text-cyan-200 text-lg text-center mb-16">知识是最好的投资</p>

        <div className="grid md:grid-cols-2 gap-6">
          {educations.map((edu) => (
            <Card
              key={edu.id}
              className="bg-white/95 border-blue-200 hover:border-cyan-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/20 shadow-lg ocean-card"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center text-2xl shadow-lg">
                    🎓
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-blue-900 truncate">{edu.school}</h3>
                    <p className="text-cyan-700 font-medium text-sm">
                      {edu.degree} · {edu.major}
                    </p>
                    <p className="text-blue-500 text-xs font-mono mt-1">
                      {edu.startDate} — {edu.endDate}
                    </p>
                    {edu.description && (
                      <p className="text-blue-800 text-sm mt-3 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
