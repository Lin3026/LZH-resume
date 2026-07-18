import { useEffect, useRef } from 'react';
import './GalaxyCore.css';

/**
 * 轨道中心的「银河（螺旋星系）」效果，替换原本的发光太阳。
 * - Canvas 绘制：发光核心 + 三条对数螺旋星臂（青→紫→粉→白渐变配色，沿用轨道渐变主题）
 * - 椭圆直接焊进粒子坐标：每个粒子 Y 按 squash 压扁，旋臂与散开粒子天生就是椭圆
 * - 差速自转：内圈转得快、外圈慢，模拟星系旋转；整体缓慢公转
 * - 星点轻微闪烁；中心叠加径向辉光
 * - 开局即铺满（3000 粒子），无淡入、不扩散、不生成新粒子，仅持续旋转
 * - 尊重 prefers-reduced-motion：静态不旋转
 */

// 颜色沿「距核心归一化半径 r(0→1)」插值，配色与轨道渐变 #22d3ee→#a855f7→#f472b6 呼应
const PALETTE: [number, string][] = [
  [0.0, '#ffffff'], // 核心：白
  [0.10, '#eaf4ff'], // 近白蓝
  [0.20, '#cfe8ff'], // 浅蓝
  [0.30, '#bcd2fb'], // 蓝
  [0.40, '#b58cf0'], // 蓝紫过渡
  [0.50, '#a855f7'], // 紫
  [0.60, '#c56fd6'], // 紫粉过渡
  [0.70, '#f472b6'], // 粉
  [0.80, '#d081cf'], // 粉青过渡（偏紫粉）
  [0.90, '#7ba9de'], // 粉青过渡（偏蓝青）
  [1.0, '#22d3ee'], // 外缘：青
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function colorAt(r: number): string {
  let lo = PALETTE[0];
  let hi = PALETTE[PALETTE.length - 1];
  for (let i = 0; i < PALETTE.length - 1; i++) {
    if (r >= PALETTE[i][0] && r <= PALETTE[i + 1][0]) {
      lo = PALETTE[i];
      hi = PALETTE[i + 1];
      break;
    }
  }
  const span = hi[0] - lo[0] || 1;
  const t = (r - lo[0]) / span;
  const c0 = hexToRgb(lo[1]);
  const c1 = hexToRgb(hi[1]);
  return `rgb(${Math.round(lerp(c0[0], c1[0], t))},${Math.round(
    lerp(c0[1], c1[1], t)
  )},${Math.round(lerp(c0[2], c1[2], t))})`;
}

interface Particle {
  radius: number; // 距核心像素半径
  baseAngle: number; // 初始角度
  size: number;
  color: string;
  alpha: number;
  twinkle: number; // 闪烁相位
  spin: number; // 自转角速度系数（内快外慢）
}

export default function GalaxyCore({
  size = 176,
  tilt = 0,
  squash = 1,
}: {
  size?: number;
  tilt?: number;
  /** 纵向压扁比例，把圆盘压成椭圆以匹配轨道环视角（如 240/640 ≈ 0.375）。椭圆焊进粒子坐标本身 */
  squash?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const R = size * 0.46;
    const cx = size / 2;
    const cy = size / 2;
    const ARMS = 3;
    const COUNT = 6000; // 密度翻倍：弥散盘 + 弱旋臂，填满整个椭圆
    const unit = size / 176 / 1.5; // 粒子像素大小随画布等比放大后再缩小 1.5 倍
    const MAX_P = 0.425 * unit; // 最大粒子上限，再缩小一倍，clamp 掉个别过大的颗粒

    const particles: Particle[] = [];
    for (let i = 0; i < COUNT; i++) {
      // 65% 为弥散盘星：随机角度，填满旋臂之间的暗区，形成完整椭圆盘
      // 35% 为旋臂星：形成微弱螺旋纹理，但臂很宽，不突出
      const isArm = Math.random() < 0.35;
      const rt = Math.pow(Math.random(), isArm ? 0.65 : 0.55);
      const radius = rt * R;

      let baseAngle: number;
      let sizePx: number;
      let alpha: number;

      if (isArm) {
        const arm = Math.floor(Math.random() * ARMS);
        const twist = radius * 0.0035; // 轻微螺旋扭转
        const scatter = (Math.random() - 0.5) * 1.0; // 宽臂，填缝
        baseAngle = arm * ((Math.PI * 2) / ARMS) + twist + scatter;
        sizePx = 0.4 + Math.random() * 1.3 * (1 - rt * 0.5);
        alpha = 0.4 + Math.random() * 0.5;
      } else {
        baseAngle = Math.random() * Math.PI * 2; // 全角度均匀填充
        sizePx = 0.3 + Math.random() * 1.0 * (1 - rt * 0.5);
        alpha = 0.18 + Math.random() * 0.35; // 较淡，作为背景底
      }
      // 限制最大粒子视觉尺寸，避免个别超大颗粒过显眼（上限 MAX_P 像素，见上方定义）
      sizePx = Math.min(sizePx * unit, MAX_P);

      particles.push({
        radius,
        baseAngle,
        size: sizePx,
        color: colorAt(rt),
        alpha,
        twinkle: Math.random() * Math.PI * 2,
        spin: 0.4 + (1 - rt) * 0.9, // 内圈快、外圈慢
      });
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const time = (now - start) / 1000;
      const fade = 1; // 开局即满：不淡入、不扩散、不生成新粒子，只持续旋转
      ctx.clearRect(0, 0, size, size);
      const rot = reduced ? 0 : time * 0.12;

      // 椭圆核心辉光（与粒子同样压扁）
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, squash);
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.95);
      core.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
      core.addColorStop(0.12, `rgba(190,225,255,${0.72 * fade})`);
      core.addColorStop(0.38, `rgba(168,85,247,${0.38 * fade})`);
      core.addColorStop(0.7, `rgba(244,114,182,${0.16 * fade})`);
      core.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 星点：椭圆分布（Y 按 squash 压扁）+ 差速旋转 + 闪烁，一开始就铺满
      for (const p of particles) {
        const a = p.baseAngle + rot * p.spin;
        const x = cx + Math.cos(a) * p.radius;
        const y = cy + Math.sin(a) * p.radius * squash; // 压扁成椭圆
        const tw = reduced ? 1 : 0.6 + 0.4 * Math.sin(time * 1.5 + p.twinkle);
        ctx.globalAlpha = p.alpha * tw * fade;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [size, squash]);

  return (
    <canvas
      className="orbit-galaxy"
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size, transform: `rotate(${tilt}deg)` }}
      aria-hidden="true"
    />
  );
}
