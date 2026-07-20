import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useMotionTemplate,
  animate,
} from 'framer-motion';
import BorderGlow from '../../components/BorderGlow';
import ScrollFloat from './ScrollFloat';

/* ============================================================
 * 工作经历 — 横向时间轴
 * 单一坐标系：X = left:X%（JS 注入），Y = 50%
 *   · 轴线 与 圆点 共 Y（top:50%）
 *   · 圆点 与 竖线 共 X（left:0 + translateX(-50%)）
 * 动画：左→右遮罩揭示（流水扫过，扫过常驻）+ 圆点点亮；
 *       跟随滚动进出视口 —— 滚到位置出现，往上滚收起。
 * ========================================================== */

interface WorkExperience {
  dateRange: string;
  company: string;
  title: string;
}

const WORK_EXPERIENCE: WorkExperience[] = [
  {
    dateRange: '2017.08—2019.04',
    company: '北京月蚀有限公司',
    title: '后期制作',
  },
  {
    dateRange: '2019.05—2020.01',
    company: '乐城堡科技有限公司',
    title: '海外游戏视频设计师',
  },
  {
    dateRange: '2020.03—2022.04',
    company: '小米海外游戏',
    title: '海外广告视频设计师',
  },
  {
    dateRange: '2022.05—至今',
    company: '乐元素科技有限公司',
    title: '高级广告创意设计师',
  },
];

export default function ServicesSection({ triggerRef }: { triggerRef?: React.RefObject<HTMLElement> }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // 联动触发：当「关于我」区块大部分滚出视口（bottom <= 视口40%高度）时，
  // 下面的时间轴就开始播放动画；往上滚回该区块时，动画收回。
  const [aboutGone, setAboutGone] = useState(false);
  useEffect(() => {
    const el = triggerRef?.current;
    if (!el) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      // 提前触发：关于我区块滚出约 60% 时就开始显示时间轴
      setAboutGone(rect.bottom <= window.innerHeight * 0.4);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [triggerRef]);

  // 减少动画偏好下恒显示；否则跟随「关于我」区块滚出视口而进出
  const show = reduce || aboutGone;

  // 左→右揭示进度（0..100 百分比），驱动遮罩
  const reveal = useMotionValue(reduce ? 100 : 0);
  // 已扫过区域可见，未扫过透明 —— 扫光从左往右推进，扫过常驻
  const mask = useMotionTemplate`linear-gradient(to right, #000 0%, #000 ${reveal}%, rgba(0,0,0,0) calc(${reveal}% + 3%))`;

  useEffect(() => {
    const controls = animate(reveal, show ? 100 : 0, {
      duration: reduce ? 0 : 1.3,
      ease: [0.25, 0.1, 0.25, 1],
    });
    return () => controls.stop();
  }, [show, reduce, reveal]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] overflow-hidden"
      style={{ color: '#e5e5e5' }}
    >
      <div className="mb-16 sm:mb-20 md:mb-24">
        <ScrollFloat containerClassName="section-float-title">
          工作经历
        </ScrollFloat>
      </div>

      <motion.div
        className="timeline-wrapper"
        style={{ maskImage: mask as any, WebkitMaskImage: mask as any }}
      >
        {/* 轨道：相对定位，作为唯一坐标系 */}
        <div className="timeline-track">

          {/* 渐变横线（轴线）：top:50% 与所有圆点共 Y */}
          <div className="timeline-line" />

          {/* 起点空心圆：left:20px top:50%，与轴线共 Y */}
          <div className="timeline-start" />

          {/* 各节点：容器只负责 left:X%，内部元素共享同一 X/Y */}
          {WORK_EXPERIENCE.map((exp, i) => {
            const isAbove = i % 2 === 1;
            const leftPct = ((i + 1) / (WORK_EXPERIENCE.length + 1)) * 100;

            return (
              <div
                key={i}
                className="timeline-entry"
                style={{ left: `${leftPct}%` }}
              >
                {/* 竖线：与圆点同 X（left:0 + translateX(-50%)） */}
                <div className={`timeline-stem ${isAbove ? 'stem-up' : 'stem-down'}`} />

                {/* 圆点：X=left:0(x:-50%)，Y=top:50%(y:-50%)，与轴线共 Y */}
                <motion.div
                  className="timeline-dot"
                  style={{ x: '-50%', y: '-50%' }}
                  initial={{ scale: reduce ? 1 : 0 }}
                  animate={show ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                />

                {/* 卡片：定位层（CSS transform 定位，不碰 framer transform） */}
                <div className={`timeline-card-wrap ${isAbove ? 'card-above' : 'card-below'}`}>
                  <BorderGlow
                    className="timeline-card glass-card"
                    backgroundColor="rgba(18,18,24,0.84)"
                    borderRadius={16}
                    glowColor="250 85 70"
                    colors={['#3b82f6', '#8b5cf6', '#a855f7']}
                    edgeSensitivity={35}
                    glowRadius={22}
                  >
                    <p className="timeline-date">{exp.dateRange}</p>
                    <p className="timeline-company">{exp.company}</p>
                    <p className="timeline-title">{exp.title}</p>
                  </BorderGlow>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
