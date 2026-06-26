import { educations } from '../data/resumeData';
import { Card, CardContent } from '@/components/ui/card';

export default function EducationSection() {
  return (
    <section id="education" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          教育经历
        </h2>
        <p className="text-slate-400 text-center mb-16">知识是最好的投资</p>

        <div className="grid md:grid-cols-2 gap-6">
          {educations.map((edu) => (
            <Card
              key={edu.id}
              className="bg-slate-900 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
                    🎓
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{edu.school}</h3>
                    <p className="text-purple-300 font-medium text-sm">
                      {edu.degree} · {edu.major}
                    </p>
                    <p className="text-slate-500 text-xs font-mono mt-1">
                      {edu.startDate} — {edu.endDate}
                    </p>
                    {edu.description && (
                      <p className="text-slate-400 text-sm mt-3 leading-relaxed">
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
