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

**项目：** ${exp.tags.join(' · ')}

---
`
    )
    .join('\n');
};

export default function WorkContentSection() {
  const markdown = generateMarkdownContent();

  return (
    <section id="work-content" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 tracking-tight">
          工作内容详述
        </h2>
        <p className="text-cyan-200 text-lg text-center mb-16">实践是最好的老师</p>

        <div className="bg-white/95 border border-blue-200 rounded-2xl p-6 md:p-12 shadow-xl ocean-card">
          <div className="prose prose-base max-w-none
            prose-headings:text-blue-900 prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-blue-200 prose-h2:pb-3
            prose-p:text-blue-800 prose-p:text-base prose-p:leading-loose prose-p:my-3
            prose-blockquote:border-l-4 prose-blockquote:border-l-cyan-500 prose-blockquote:text-blue-700 prose-blockquote:text-lg prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:pl-4 prose-blockquote:my-4
            prose-strong:text-blue-900 prose-strong:text-base prose-strong:font-bold
            prose-hr:border-blue-200 prose-hr:my-6
            prose-code:text-cyan-700 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-li:text-blue-800 prose-li:text-base prose-li:my-1
            prose-a:text-cyan-600 prose-a:font-medium">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
}
