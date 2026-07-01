import { useState, useRef, useEffect } from 'react';
import { videoWorks } from '../data/resumeData';
import type { VideoWork } from '../types';
import { getVideoDetail } from '../data/videoDetails';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import oceanBg from '../assets/ocean-bg.jpg';
import detailBg from '../assets/detail-bg.jpg';

/**
 * 10 个视频槽位坐标（百分比，相对于背景图 2560×15745）
 * 作品展示区域，2行 x 5列，视频框比例 400:712
 * 第1行 y=9800px, 第2行 y=10600px
 */
const VIDEO_SLOTS = [
  // 第1行 (y=9800px, top=62.24%)
  { left: 3.33,  top: 62.24, width: 16.00, height: 4.63 },
  { left: 22.67, top: 62.24, width: 16.00, height: 4.63 },
  { left: 42.00, top: 62.24, width: 16.00, height: 4.63 },
  { left: 61.33, top: 62.24, width: 16.00, height: 4.63 },
  { left: 80.67, top: 62.24, width: 16.00, height: 4.63 },
  // 第2行 (y=10600px, top=67.32%)
  { left: 3.33,  top: 67.32, width: 16.00, height: 4.63 },
  { left: 22.67, top: 67.32, width: 16.00, height: 4.63 },
  { left: 42.00, top: 67.32, width: 16.00, height: 4.63 },
  { left: 61.33, top: 67.32, width: 16.00, height: 4.63 },
  { left: 80.67, top: 67.32, width: 16.00, height: 4.63 },
];

export default function VideoShowcase({
  onDialogOpenChange,
}: {
  onDialogOpenChange: (open: boolean) => void;
}) {
  const [selectedVideo, setSelectedVideo] = useState<VideoWork | null>(null);

  const handleOpen = (video: VideoWork) => {
    setSelectedVideo(video);
    onDialogOpenChange(true);
  };
  const handleClose = () => {
    setSelectedVideo(null);
    onDialogOpenChange(false);
  };

  return (
    <div className="relative w-full">
      {/* 背景图 — 铺满剩余宽度（自适应各设备），高度按原比例（2560×15745）自动计算 */}
      <div className="relative w-full">
          <img
            src={oceanBg}
            alt="作品集背景"
            className="block w-full h-auto select-none"
            draggable={false}
            style={{ pointerEvents: 'none' }}
          />

      {/* 10 个视频点击槽位 — 绝对定位覆盖在背景图的作品展示区域 */}
      {videoWorks.slice(0, 10).map((video, index) => {
        const slot = VIDEO_SLOTS[index] || VIDEO_SLOTS[0];
        return (
          <VideoSlot
            key={video.id}
            video={video}
            index={index}
            slot={slot}
            onClick={() => handleOpen(video)}
          />
        );
      })}
      </div>

      {/* 视频详情弹窗 */}
      <VideoDetailDialog
        video={selectedVideo}
        open={!!selectedVideo}
        onClose={handleClose}
      />
    </div>
  );
}

// ========== 单个视频槽位 ==========
function VideoSlot({
  video,
  index,
  slot,
  onClick,
}: {
  video: VideoWork;
  index: number;
  slot: { left: number; top: number; width: number; height: number };
  onClick: () => void;
}) {
  const [previewing, setPreviewing] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 鼠标停留0.5秒后自动播放预览（静音）— 用轻量 previewUrl 替代完整 videoUrl
  const handleMouseEnter = () => {
    if (!video.previewUrl && !video.videoUrl) return;
    hoverTimer.current = setTimeout(() => {
      setPreviewing(true);
    }, 500);
  };

  // 鼠标离开 → 停止预览，恢复封面
  const handleMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (previewRef.current) {
      previewRef.current.pause();
      previewRef.current.currentTime = 0;
    }
    setPreviewing(false);
  };

  // 预览视频就绪后自动播放
  useEffect(() => {
    if (!previewing || !previewRef.current) return;
    const vid = previewRef.current;
    vid.muted = true;
    vid.play().catch(() => {});
  }, [previewing]);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        left: `${slot.left}%`,
        top: `${slot.top}%`,
        width: `${slot.width}%`,
        height: `${slot.height}%`,
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: '#ffffff',
        boxSizing: 'border-box',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 0 12px rgba(255,255,255,0.15)',
      }}
      className="
        video-slot-border
        bg-transparent hover:bg-white/20
        backdrop-blur-sm
        group flex items-center justify-center
        transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-white/40
        cursor-pointer
        overflow-hidden
      "
      aria-label={`查看作品 ${index + 1}：${video.title}`}
    >
      {/* 封面缩略图（hover预览时隐藏） */}
      {video.thumbnail && !previewing && (
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          draggable={false}
        />
      )}

      {/* hover 0.5秒后视频预览（静音自动播放）— 优先用轻量 previewUrl */}
      {previewing && (video.previewUrl || video.videoUrl) && (
        <video
          ref={previewRef}
          src={video.previewUrl || video.videoUrl}
          muted
          playsInline
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: 'block' }}
        />
      )}

      {/* hover 播放图标（预览时隐藏） */}
      {!previewing && (
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
          <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* 编号角标 */}
      <div className="absolute top-1.5 left-1.5 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-bold text-xs flex items-center justify-center shadow-lg opacity-50 group-hover:opacity-100 transition-opacity border-2 border-white/80">
        {index + 1}
      </div>
    </button>
  );
}

// ========== 视频详情弹窗 ==========
function VideoDetailDialog({
  video,
  open,
  onClose,
}: {
  video: VideoWork | null;
  open: boolean;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const iconTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 弹窗打开时自动播放（先尝试有声，被浏览器拦截则降级静音）
  useEffect(() => {
    if (!open || !video?.videoUrl || !videoRef.current) return;
    const vid = videoRef.current;
    const t = setTimeout(() => {
      vid.muted = false;
      vid.play().then(() => setIsPlaying(true)).catch(() => {
        vid.muted = true;
        vid.play().then(() => setIsPlaying(true)).catch(() => {});
      });
    }, 300);
    return () => clearTimeout(t);
  }, [open, video]);

  // 点击视频 → 切换播放/暂停 + 短暂显示图标（0.8秒淡出）
  const handleVideoClick = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
    setShowIcon(true);
    if (iconTimer.current) clearTimeout(iconTimer.current);
    iconTimer.current = setTimeout(() => setShowIcon(false), 800);
  };

  if (!video) return null;

  const detail = getVideoDetail(video.id);

  // 详情页固定高度 1890px，宽度自适应（最大540px）
  // 视频比例 400:712 — 宽=400/1080≈37.04%，高=712/1890≈37.67%
  // 文本坐标基于原1920px PS稿，换算链：1920→2305→1890 (×1920/2305×2305/1890=×1920/1890)
  const videoTop = 6.09;   // 原6.0% × (2305/1890)
  const videoH = 37.67;    // 712/1890
  const videoW = 37.04;
  const videoLeft = (100 - videoW) / 2; // ≈31.48

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[360px] sm:max-w-[400px] md:max-w-[540px] max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-0 bg-transparent [&>button]:hidden">
        {/* 背景底图 + 内容层，固定 1890px 高，可滚动，移动端自动适配 */}
        <div className="relative w-full" style={{ minHeight: '1890px' }}>
          {/* 背景底图 — 铺满整个1890px容器 */}
          <img
            src={detailBg}
            alt="视频详情"
            className="absolute inset-0 w-full h-full object-cover select-none"
            draggable={false}
          />

          {/* 视频播放区域 — 顶部天空区 */}
          <div
            className="absolute overflow-hidden video-slot-border"
            style={{
              left: `${videoLeft}%`,
              top: `${videoTop}%`,
              width: `${videoW}%`,
              height: `${videoH}%`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.4), 0 0 16px rgba(255,255,255,0.3)',
              backgroundColor: '#000',
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: '#ffffff',
              boxSizing: 'border-box',
            }}
          >
            {video.videoUrl ? (
              <div className="relative w-full h-full" onClick={handleVideoClick}>
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  poster={video.thumbnail || undefined}
                  playsInline
                  loop
                  preload="auto"
                  autoPlay
                  className="w-full h-full object-cover"
                  style={{ display: 'block' }}
                >
                  您的浏览器不支持视频播放
                </video>
                {/* 自定义播放/暂停图标 — 点击后显示0.8秒淡出，自动播放时无图标 */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                  style={{ opacity: showIcon ? 1 : 0 }}
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    {isPlaying ? (
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ) : video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 w-full h-full text-white/60">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 opacity-40" viewBox="0 0 64 64" fill="none">
                  <rect x="10" y="14" width="44" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="M30 28 L30 36 L38 32 Z" fill="currentColor" />
                </svg>
                <span className="text-xs">视频待上传</span>
              </div>
            )}
          </div>

          {/* 项目简介 — 换算后 top=50.83% (基于1890) */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: '9.26%',
              top: '50.83%',
              width: '81.48%',
              height: '14.30%',
            }}
          >
            <p className="text-[11px] sm:text-[13px] leading-snug text-blue-950/90">{detail.projectIntro}</p>
          </div>

          {/* 创意思路 — 换算后 top=65.11% (基于1890) */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: '9.26%',
              top: '65.11%',
              width: '81.48%',
              height: '15.08%',
            }}
          >
            <p className="text-[11px] sm:text-[13px] leading-snug text-blue-950/90">{detail.creativeThinking}</p>
          </div>

          {/* 数据分析 — 换算后 top=84.17% (基于1890) */}
          {/* CTR — x=170 → left=15.74% */}
          <div className="absolute" style={{ left: '15.74%', top: '84.17%', transform: 'translateX(-50%)' }}>
            <p className="text-[10px] sm:text-xs font-bold text-blue-900 leading-none whitespace-nowrap">{detail.metrics.ctr}</p>
          </div>
          {/* CVR — x=355 → left=32.87% */}
          <div className="absolute" style={{ left: '32.87%', top: '84.17%', transform: 'translateX(-50%)' }}>
            <p className="text-[10px] sm:text-xs font-bold text-blue-900 leading-none whitespace-nowrap">{detail.metrics.cvr}</p>
          </div>
          {/* 新增 — x=540 → left=50.00% */}
          <div className="absolute" style={{ left: '50.00%', top: '84.17%', transform: 'translateX(-50%)' }}>
            <p className="text-[10px] sm:text-xs font-bold text-blue-900 leading-none whitespace-nowrap">{detail.metrics.newUsers}</p>
          </div>
          {/* 首日付费率 — x=720 → left=66.67% */}
          <div className="absolute" style={{ left: '66.67%', top: '84.17%', transform: 'translateX(-50%)' }}>
            <p className="text-[10px] sm:text-xs font-bold text-blue-900 leading-none whitespace-nowrap">{detail.metrics.firstDayPayRate}</p>
          </div>
          {/* 首日ROI — x=911 → left=84.35% */}
          <div className="absolute" style={{ left: '84.35%', top: '84.17%', transform: 'translateX(-50%)' }}>
            <p className="text-[10px] sm:text-xs font-bold text-blue-900 leading-none whitespace-nowrap">{detail.metrics.firstDayRoi}</p>
          </div>

          {/* 底部文本行 — 换算后 top=89.14% (基于1890)，x=125 → left=11.57% */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: '11.57%',
              top: '89.14%',
              width: '79.17%',
              height: '6.00%',
            }}
          >
            <p className="text-[11px] sm:text-[13px] leading-snug text-blue-950/90">{detail.bottomNote || ''}</p>
          </div>

          {/* 右上角关闭按钮 — 48x48px 确保移动端易点击 */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
            aria-label="关闭"
            style={{ WebkitAppearance: 'none', appearance: 'none', touchAction: 'manipulation' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
