import { personalInfo } from '../data/resumeData';

export default function ContactSection() {
  const contacts = [
    { icon: '✉️', label: '邮箱', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: '📱', label: '电话', value: personalInfo.phone, href: `tel:${personalInfo.phone.replace(/\s/g, '')}` },
    { icon: '📍', label: '所在地', value: personalInfo.location, href: undefined },
    ...(personalInfo.github ? [{ icon: '🐙', label: 'GitHub', value: 'github.com/Lin3026', href: personalInfo.github }] : []),
    ...(personalInfo.website ? [{ icon: '🌐', label: '个人网站', value: personalInfo.website.replace(/^https?:\/\//, ''), href: personalInfo.website }] : []),
  ];

  return (
    <section id="contact" className="py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">联系我</h2>
        <p className="text-slate-400 mb-16">期待与你的每一次交流</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {contacts.map((c) => (
            <div
              key={c.label}
              className={`bg-slate-900 border border-slate-700 rounded-xl p-5 flex items-center gap-4 group ${
                c.href ? 'cursor-pointer hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-0.5' : ''
              }`}
              onClick={() => c.href && window.open(c.href, c.href.startsWith('http') ? '_blank' : '_self')}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/30 to-teal-600/30 border border-cyan-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                {c.icon}
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs text-slate-500 mb-0.5">{c.label}</div>
                <div className="text-white text-sm font-medium truncate group-hover:text-cyan-300 transition-colors">
                  {c.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-slate-600 text-sm">
          © {new Date().getFullYear()} {personalInfo.name} · 用创意连接世界
        </div>
      </div>
    </section>
  );
}
