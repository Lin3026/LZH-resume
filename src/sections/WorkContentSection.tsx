import { workExperiences } from '../data/resumeData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 把所有工作内容汇聚成一篇 Markdown
const generateMarkdownContent = () => {
  return workExperiences
    .map(
      (exp) => `## ${exp.company} · ${exp.position}

> ${exp.startDate} — ${exp.endDate}

${exp.description}

**技术栈：** ${exp.tags.join(' · ')}

---
`
    )
    .join('\n');
};

export default function WorkContentSection() {
  const markdown = generateMarkdownContent();

  return (
    <section id="work-content" className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          工作内容详述
        </h2>
        <p className="text-slate-400 text-center mb-16">Markdown 渲染 · 清晰呈现每段经历</p>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-10">
          <div className="prose prose-invert max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-xl prose-h2:border-b prose-h2:border-slate-700 prose-h2:pb-2
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-blockquote:border-l-purple-500 prose-blockquote:text-slate-400 prose-blockquote:italic
            prose-strong:text-purple-300
            prose-hr:border-slate-700
            prose-code:text-cyan-300 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-li:text-slate-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
}
