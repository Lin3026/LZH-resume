import { useRef, useState, type ReactNode, type MouseEvent, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/* ============================================================
 * FadeIn — 滚动进入视口时淡入（带位移）
 * ========================================================== */
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
 * Magnet — 鼠标跟随磁吸悬停效果
 * ========================================================== */
interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // 仅在距元素边缘 padding 范围内激活
    if (Math.abs(dx) < rect.width / 2 + padding && Math.abs(dy) < rect.height / 2 + padding) {
      setTransform(`translate3d(${dx / strength}px, ${dy / strength}px, 0)`);
    } else {
      setTransform('translate3d(0,0,0)');
    }
  };

  const handleLeave = () => setTransform('translate3d(0,0,0)');

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform,
        transition: transform ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
 * AnimatedText — 逐字滚动驱动淡入（opacity 0.2 -> 1）
 * ========================================================== */
interface CharProps {
  progress: MotionValue<number>;
  range: [number, number];
  char: string;
}

function Char({ progress, range, char }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  // 分词：连续的拉丁字母/数字作为一个「词」（不换行），CJK 字符与空格各为独立片段
  type Segment = { type: 'word' | 'char' | 'space'; text: string };
  const segments: Segment[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      segments.push({ type: 'space', text: ch });
      i++;
    } else if (/[A-Za-z0-9]/.test(ch)) {
      let w = '';
      let j = i;
      while (j < text.length && /[A-Za-z0-9]/.test(text[j])) {
        w += text[j];
        j++;
      }
      segments.push({ type: 'word', text: w });
      i = j;
    } else {
      segments.push({ type: 'char', text: ch });
      i++;
    }
  }

  const totalChars = segments.filter((s) => s.type !== 'space').length || 1;

  // 为每个非空白字符预计算滚动范围
  const ranges: [number, number][] = [];
  let count = 0;
  for (const seg of segments) {
    if (seg.type === 'space') {
      ranges.push([1, 1]);
      continue;
    }
    for (let k = 0; k < seg.text.length; k++) {
      const start = count / totalChars;
      const end = start + 1 / totalChars;
      ranges.push([start, Math.min(end, 1)]);
      count++;
    }
  }

  let idx = 0;
  const nextRange = () => ranges[idx++] ?? [1, 1];

  return (
    <p ref={ref} className={className}>
      {segments.map((seg, si) => {
        if (seg.type === 'space') {
          idx++; // 占位，保持 ranges 对齐
          return ' ';
        }
        if (seg.type === 'word') {
          // 拉丁词：整体不换行，内部逐字淡入
          return (
            <span key={si} className="inline-block whitespace-nowrap">
              {Array.from(seg.text).map((ch) => (
                <Char key={`${si}-${ch}`} progress={scrollYProgress} range={nextRange()} char={ch} />
              ))}
            </span>
          );
        }
        // 单个 CJK 字符：允许在字符间自然换行
        return (
          <Char key={si} progress={scrollYProgress} range={nextRange()} char={seg.text} />
        );
      })}
    </p>
  );
}

/* ============================================================
 * ContactButton — 渐变胶囊按钮
 * ========================================================== */
interface ContactButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function ContactButton({ label = '联系我', onClick, className }: ContactButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full font-medium uppercase tracking-widest text-white px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base ${className ?? ''}`}
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid #ffffff',
        outlineOffset: '-3px',
        WebkitAppearance: 'none',
        appearance: 'none',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

/* ============================================================
 * LiveProjectButton — 描边幽灵胶囊按钮
 * ========================================================== */
interface LiveProjectButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function LiveProjectButton({
  label = '在线预览',
  onClick,
  className,
}: LiveProjectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 border-[#1a1a1a]/20 text-[#1a1a1a] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base transition-colors hover:bg-[#1a1a1a]/5 ${className ?? ''}`}
      style={{ WebkitAppearance: 'none', appearance: 'none', cursor: 'pointer' }}
    >
      {label}
    </button>
  );
}
