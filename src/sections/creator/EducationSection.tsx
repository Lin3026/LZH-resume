import { FadeIn } from './components';

interface EducationItem {
  period: string;
  school: string;
  meta: string;
  detail: string;
}

const EDUCATION: EducationItem[] = [
  {
    period: '2013.9 - 2017.7',
    school: '南昌大学科学技术学院',
    meta: '学历：本科　|　专业：动画',
    detail: '系统接受动画专业本科教育，奠定视觉表达与动态设计基础。',
  },
  {
    period: '2015.9 - 2016.7',
    school: '江西视图科技教育培训机构',
    meta: '参加培训',
    detail: '系统学习了 C4D、AE、PS、PR 等软件技能，强化后期制作与动效设计实战能力。',
  },
];

function EducationRow({ item, index }: { item: EducationItem; index: number }) {
  return (
    <FadeIn delay={index * 0.12} y={30} className="relative pl-12 sm:pl-16">
      {/* 圆点 */}
      <span
        className="absolute left-[14px] sm:left-[22px] top-2 w-3.5 h-3.5 rounded-full bg-cyan-400 ring-4 ring-black"
        aria-hidden="true"
      />
      {/* 日期 */}
      <span className="block text-xs sm:text-sm uppercase tracking-widest text-white/55 mb-2">
        {item.period}
      </span>
      {/* 学校名 */}
      <span
        className="block font-black leading-tight text-white mb-2"
        style={{ fontSize: 'clamp(1.4rem, 4vw, 2.4rem)' }}
      >
        {item.school}
      </span>
      {/* 标签行 */}
      <span
        className="block font-medium text-white/80 mb-4"
        style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}
      >
        {item.meta}
      </span>
      {/* 详情 */}
      <p
        className="whitespace-pre-line rounded-[24px] sm:rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-6 leading-relaxed text-white/75"
        style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)' }}
      >
        {item.detail}
      </p>
    </FadeIn>
  );
}

export default function EducationSection() {
  return (
    <section
      id="education"
      className="relative z-10 bg-[#0a0a0a] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-4 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-28 pb-24"
    >
      <FadeIn delay={0} y={40} className="mb-14 sm:mb-20">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          教育经历
        </h2>
      </FadeIn>

      {/* 竖向时间轴：左侧竖线 + 右排内容 */}
      <div className="relative mx-auto max-w-3xl">
        {/* 竖线 */}
        <span
          className="absolute left-[21px] sm:left-[29px] top-2 bottom-2 w-px bg-white/15"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-12 sm:gap-16">
          {EDUCATION.map((item, i) => (
            <EducationRow key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
