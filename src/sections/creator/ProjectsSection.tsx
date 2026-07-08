import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { FadeIn, LiveProjectButton } from './components';

/** 构造 CloudFront 图片的 Higgs 代理 URL */
const higgs = (file: string) =>
  `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(
    `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/${file}`,
  )}&w=1280&q=85`;

interface Project {
  no: string;
  name: string;
  category: string;
  col1Top: string;
  col1Bottom: string;
  col2: string;
}

const PROJECTS: Project[] = [
  {
    no: '01',
    name: 'Nextlevel Studio',
    category: '客户项目',
    col1Top: higgs('hf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png'),
    col1Bottom: higgs('hf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png'),
    col2: higgs('hf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png'),
  },
  {
    no: '02',
    name: 'Aura Brand Identity',
    category: '个人项目',
    col1Top: higgs('hf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png'),
    col1Bottom: higgs('hf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png'),
    col2: higgs('hf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png'),
  },
  {
    no: '03',
    name: 'Solaris Digital',
    category: '客户项目',
    col1Top: higgs('hf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png'),
    col1Bottom: higgs('hf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png'),
    col2: higgs('hf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png'),
  },
];

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div
      className="sticky h-[85vh]"
      style={{ top: `calc(6rem + ${index * 28}px)` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full h-full flex flex-col rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-[#1a1a1a]/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8"
      >
        {/* 顶部行：编号 + 名称 / 类别 + 在线预览按钮 */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-4 sm:gap-6 items-baseline min-w-0">
            <span
              className="font-black leading-none shrink-0 text-[#1a1a1a]"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 120px)' }}
            >
              {project.no}
            </span>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm uppercase tracking-widest text-[#1a1a1a]/60 mb-1">
                {project.category}
              </span>
              <h3
                className="font-medium uppercase text-[#1a1a1a] truncate"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton label="在线预览" className="shrink-0" />
        </div>

        {/* 底部行：左 40% 两张 + 右 60% 一张 */}
        <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6 flex-1 min-h-0">
          <div className="w-[40%] flex flex-col gap-3 sm:gap-4 min-h-0">
            <img
              src={project.col1Top}
              alt=""
              loading="lazy"
              className="w-full object-cover rounded-[24px] sm:rounded-[40px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={project.col1Bottom}
              alt=""
              loading="lazy"
              className="w-full object-cover rounded-[24px] sm:rounded-[40px] flex-1 min-h-0"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>
          <div className="w-[60%] min-h-0">
            <img
              src={project.col2}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover rounded-[24px] sm:rounded-[40px]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative z-10 bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-4 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-28 pb-24"
    >
      <FadeIn delay={0} y={40} className="mb-12 sm:mb-16">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          项目
        </h2>
      </FadeIn>

      <div className="relative max-w-6xl mx-auto">
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.no}
            project={p}
            index={i}
            total={PROJECTS.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
