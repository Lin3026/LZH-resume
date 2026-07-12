import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  useReducedMotion,
} from 'framer-motion';
import { FadeIn } from './components';

interface WorkItem {
  company: string;
  title: string;
  dateRange: string;
  desc: string;
}

const WORK_ITEMS: WorkItem[] = [
  {
    company: '乐元素科技有限公司',
    title: '高级广告创意设计师',
    dateRange: '2022-05 - 至今',
    desc: `负责开心消消乐、开心水族箱、假日乐消消、宝贝乐消消、BabyTopia 等多款游戏创意方向。对接外包视频制作，创意整理及投放数据分析并做出计划调整。其中「假日乐消消」去年国内上线成功，今年开始盈利。

每周将所有素材数据进行统计(消耗、新增、CTR、CVR、CP1、次留、首日付费率.首日RO1、3日RO1、7日ROI)并做出分析跑量素材的共性及低效素材的原因。并做出调整素材的制作和测试方向。每两周做出复盘 报告分享给组内同事让大家能以此得到灵感并应用到各自的项目中去。`,
  },
  {
    company: '小米海外游戏',
    title: '海外广告视频设计师',
    dateRange: '2020-03 - 2022-04',
    desc: `负责海外三消、涂色、经营等多款游戏视频制作，对接外包视频制作。
对实习生进行技能培训与创意思维培训。
Tile Fun 一年半下载量 2000 万，Match Fun3D 下载量 500 万。
Tile Fun 曾进入日本排行榜第九、欧洲排行第五。`,
  },
  {
    company: '乐城堡科技有限公司',
    title: '海外游戏视频设计师',
    dateRange: '2019-05 - 2020-01',
    desc: `负责多款海外游戏投放视频广告制作(Puzzle、涂色、World 品类)。
其中 Coloring Fun 达到 1000 万下载量。`,
  },
  {
    company: '北京月蚀文化发展',
    title: '后期制作',
    dateRange: '2017-08 - 2019-04',
    desc: `负责游戏栏目包装、游戏赛事包装(火影、英雄联盟逆战)。制作游戏版本更新视频，熟悉各类视频后期制作流程。`,
  },
];

function WorkCard({ item }: { item: WorkItem }) {
  return (
    <div className="w-full flex flex-col max-h-[78vh] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-[#1a1a1a]/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-6 sm:p-10 md:p-14 overflow-hidden">
      {/* 顶部：公司名 + 日期 + 职位 */}
      <div className="mb-6 sm:mb-8 shrink-0">
        <span
          className="block font-black leading-none text-[#1a1a1a]"
          style={{ fontSize: 'clamp(1.8rem, 6vw, 4rem)' }}
        >
          {item.company}
        </span>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="text-xs sm:text-sm uppercase tracking-widest text-[#1a1a1a]/60">
            {item.dateRange}
          </span>
          <span
            className="font-medium text-[#1a1a1a]"
            style={{ fontSize: 'clamp(1rem, 2.2vw, 1.6rem)' }}
          >
            {item.title}
          </span>
        </div>
      </div>

      {/* 文字框 */}
      <p
        className="whitespace-pre-line flex-1 min-h-0 overflow-y-auto rounded-[24px] sm:rounded-[32px] border border-[#1a1a1a]/10 bg-[#fafafa] p-5 sm:p-8 leading-relaxed text-[#1a1a1a]/80"
        style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}
      >
        {item.desc}
      </p>
    </div>
  );
}

function StickyWorkCard({
  item,
  index,
  total,
  progress,
  reduce,
}: {
  item: WorkItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, reduce ? 1 : targetScale]);

  return (
    <div
      className="sticky h-[80vh] flex items-center"
      style={{ top: `calc(6rem + ${index * 28}px)`, zIndex: index + 1 }}
    >
      <motion.div style={{ scale }} className="w-full">
        <WorkCard item={item} />
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
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
          工作内容
        </h2>
      </FadeIn>

      <div className="relative max-w-6xl mx-auto">
        {WORK_ITEMS.map((item, i) => (
          <StickyWorkCard
            key={i}
            item={item}
            index={i}
            total={WORK_ITEMS.length}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}
      </div>
    </section>
  );
}
