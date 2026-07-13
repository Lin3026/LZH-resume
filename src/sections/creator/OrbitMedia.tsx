// 改编自 React Bits — OrbitImages (Dominik Koch, https://x.com/dominikkoch)
// 轨道项改为 <img> 缩略图，支持点击回调

import { useMemo, useEffect, useLayoutEffect, useRef, useState, useId, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import './OrbitMedia.css';

function generateEllipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}
function generateCirclePath(cx: number, cy: number, r: number) {
  return generateEllipsePath(cx, cy, r, r);
}
function generateSquarePath(cx: number, cy: number, size: number) {
  const h = size / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`;
}
function generateRectanglePath(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
}
function generateTrianglePath(cx: number, cy: number, size: number) {
  const h = (size * Math.sqrt(3)) / 2;
  const hs = size / 2;
  return `M ${cx} ${cy - h / 1.5} L ${cx + hs} ${cy + h / 3} L ${cx - hs} ${cy + h / 3} Z`;
}
function generateStarPath(cx: number, cy: number, outerR: number, innerR: number, points: number) {
  const step = Math.PI / points;
  let path = '';
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return path + ' Z';
}
function generateHeartPath(cx: number, cy: number, size: number) {
  const s = size / 30;
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`;
}
function generateInfinityPath(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`;
}
function generateWavePath(cx: number, cy: number, w: number, amplitude: number, waves: number) {
  const pts: string[] = [];
  const segs = waves * 20;
  const hw = w / 2;
  for (let i = 0; i <= segs; i++) {
    const x = cx - hw + (w * i) / segs;
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  for (let i = segs; i >= 0; i--) {
    const x = cx - hw + (w * i) / segs;
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(`L ${x} ${y}`);
  }
  return pts.join(' ') + ' Z';
}

interface OrbitItemProps {
  item: ReactNode;
  index: number;
  totalItems: number;
  path: string;
  itemSize: number;
  rotation: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  fill: boolean;
  onClick?: () => void;
}

function OrbitItem({ item, index, totalItems, path, itemSize, rotation, progress, fill, onClick }: OrbitItemProps) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;

  const offsetDistance = useTransform(progress, (p: number) => {
    const offset = (((p + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });

  return (
    <motion.div
      className="orbit-item"
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: '0deg',
        offsetAnchor: 'center center',
        offsetDistance,
      } as any}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`查看作品 ${index + 1}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }}}
    >
      <div style={{ transform: `rotate(${-rotation}deg)`, width: '100%', height: '100%' }}>
        {item}
      </div>
      <span className="orbit-item-index" style={{ transform: `rotate(${-rotation}deg)` }}>{index + 1}</span>
    </motion.div>
  );
}

export interface OrbitMediaProps {
  images?: string[];
  altPrefix?: string;
  shape?: 'ellipse' | 'circle' | 'square' | 'rectangle' | 'triangle' | 'star' | 'heart' | 'infinity' | 'wave' | 'custom';
  customPath?: string;
  baseWidth?: number;
  radiusX?: number;
  radiusY?: number;
  radius?: number;
  starPoints?: number;
  starInnerRatio?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  direction?: 'normal' | 'reverse';
  fill?: boolean;
  className?: string;
  showPath?: boolean;
  pathColor?: string;
  pathWidth?: number;
  /** 彩色渐变描边：传入 2+ 个颜色时，用线性渐变替换单色 pathColor（轨道变成彩色实线） */
  pathGradient?: string[];
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  paused?: boolean;
  centerContent?: ReactNode;
  responsive?: boolean;
  onItemClick?: (index: number) => void;
}

export default function OrbitMedia({
  images = [],
  altPrefix = 'Orbiting image',
  shape = 'ellipse',
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = 'normal',
  fill = true,
  className = '',
  showPath = false,
  pathColor = 'rgba(0,0,0,0.1)',
  pathWidth = 2,
  pathGradient,
  easing = 'linear',
  paused = false,
  centerContent,
  responsive = false,
  onItemClick,
}: OrbitMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  const designCenterX = baseWidth / 2;
  const designCenterY = baseWidth / 2;

  const path = useMemo(() => {
    switch (shape) {
      case 'circle':
        return generateCirclePath(designCenterX, designCenterY, radius);
      case 'ellipse':
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
      case 'square':
        return generateSquarePath(designCenterX, designCenterY, radius * 2);
      case 'rectangle':
        return generateRectanglePath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case 'triangle':
        return generateTrianglePath(designCenterX, designCenterY, radius * 2);
      case 'star':
        return generateStarPath(designCenterX, designCenterY, radius, radius * starInnerRatio, starPoints);
      case 'heart':
        return generateHeartPath(designCenterX, designCenterY, radius * 2);
      case 'infinity':
        return generateInfinityPath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case 'wave':
        return generateWavePath(designCenterX, designCenterY, radiusX * 2, radiusY, 3);
      case 'custom':
        return customPath || generateCirclePath(designCenterX, designCenterY, radius);
      default:
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
    }
  }, [shape, customPath, designCenterX, designCenterY, radiusX, radiusY, radius, starPoints, starInnerRatio]);

  useLayoutEffect(() => {
    if (!responsive || !containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      setScale(containerRef.current.clientWidth / baseWidth);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [responsive, baseWidth]);

  const progress = useMotionValue(0);

  useEffect(() => {
    if (paused) return;
    const controls = animate(progress, direction === 'reverse' ? -100 : 100, {
      duration,
      ease: easing,
      repeat: Infinity,
      repeatType: 'loop',
    });
    return () => controls.stop();
  }, [progress, duration, easing, direction, paused]);

  const containerWidth = responsive ? '100%' : '100%';
  const containerHeight = responsive ? 'auto' : 'auto';

  const rawGradientId = useId();
  const gradientId = `orbit-grad-${rawGradientId.replace(/:/g, '')}`;
  const useGradient = !!pathGradient && pathGradient.length > 1;

  const isVideoSrc = (s: string) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(s);

  const items = (images ?? []).map((src, index) => {
    const label = `${altPrefix} ${index + 1}`;
    if (isVideoSrc(src)) {
      return (
        <video
          key={src + index}
          src={src}
          className="orbit-image orbit-video"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          draggable={false}
          aria-label={label}
          ref={(el) => { if (el) el.muted = true; }}
        />
      );
    }
    return (
      <img
        key={src + index}
        src={src}
        alt={label}
        draggable={false}
        className="orbit-image"
      />
    );
  });

  return (
    <div
      ref={containerRef}
      className={`orbit-container ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: responsive ? '1 / 1' : undefined,
      }}
    >
      <div
        className={
          responsive
            ? 'orbit-scaling-container orbit-scaling-container--responsive'
            : 'orbit-scaling-container'
        }
        style={{
          width: responsive ? baseWidth : '100%',
          height: responsive ? baseWidth : '100%',
          transform: responsive && scale !== null ? `translate(-50%, -50%) scale(${scale})` : undefined,
          visibility: responsive && scale === null ? 'hidden' : undefined,
        }}
      >
        <div className="orbit-rotation-wrapper" style={{ transform: `rotate(${rotation}deg)` }}>
          {showPath && (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${baseWidth} ${baseWidth}`}
              className="orbit-path-svg"
            >
              {useGradient && (
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    {pathGradient!.map((c, i) => (
                      <stop
                        key={i}
                        offset={`${(i / (pathGradient!.length - 1)) * 100}%`}
                        stopColor={c}
                      />
                    ))}
                  </linearGradient>
                </defs>
              )}
              <path
                d={path}
                fill="none"
                stroke={useGradient ? `url(#${gradientId})` : pathColor}
                strokeWidth={pathWidth / (scale ?? 1)}
              />
            </svg>
          )}

          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
              onClick={() => onItemClick?.(index)}
            />
          ))}
        </div>
      </div>

      {centerContent && <div className="orbit-center-content">{centerContent}</div>}
    </div>
  );
}
