import { useState, useRef, useEffect } from 'react';
import { videoWorks } from '../data/resumeData';
import type { VideoWork } from '../types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import oceanBg from '../assets/ocean-bg.jpg';
import detailBg from '../assets/detail-bg.jpg';

/**
 * 12 个视频槽位坐标（百分比，相对于背景图）
 * 作品展示区域，3列 x 4行
 */
const VIDEO_SLOTS = [
  // 第1行 (y=9810px)
  { left: 8.59,  top: 51.10, width: 25.00, height: 6.04 },
  { left: 37.11, top: 51.10, width: 25.00, height: 6.04 },
  { left: 65.63, top: 51.10, width: 25.00, height: 6.04 },
  // 第2行 (y=11060px)
  { left: 8.59,  top: 57.61, width: 25.00, height: 6.04 },
  { left: 37.11, top: 57.61, width: 25.00, height: 6.04 },
  { left: 65.63, top: 57.61, width: 25.00, height: 6.04 },
  // 第3行 (y=12310px)
  { left: 8.59,  top: 64.12, width: 25.00, height: 6.04 },
  { left: 37.11, top: 64.12, width: 25.00, height: 6.04 },
  { left: 65.63, top: 64.12, width: 25.00, height: 6.04 },
  // 第4行 (y=13560px)
  { left: 8.59,  top: 70.63, width: 25.00, height: 6.04 },
  { left: 37.11, top: 70.63, width: 25.00, height: 6.04 },
  { left: 65.63, top: 70.63, width: 25.00, height: 6.04 },
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
      {/* 背景图 — 铺满剩余宽度（自适应各设备），高度按原比例（2560x19197）自动计算 */}
      <div className="relative w-full">
          <img
            src={oceanBg}
            alt="作品集背景"
            className="block w-full h-auto select-none"
            draggable={false}
            style={{ pointerEvents: 'none' }}
          />

        {/* 12 个视频点击槽位 — 绝对定位覆盖在背景图的作品展示区域 */}
        {videoWorks.map((video, index) => {
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
  return (
    <button
      type="button"
      onClick={onClick}
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
      {/* 封面缩略图（如有） */}
      {video.thumbnail && (
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          draggable={false}
        />
      )}

      {/* hover 播放图标 */}
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
        <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

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

  // 视频在背景图中的位置（PS: x=360, y=140, 画布 1080×1920）
  // 视频实际尺寸 400×712（比例 0.5618，非标准9:16）
  // 宽 37.50% → 405px，高 = 405×(712/400) = 720.9px → 37.55% of 1920
  // 居中 left = (100 - 37.50) / 2 = 31.25%
  const videoLeft = 31.25;
  const videoTop = 6.25;
  const videoW = 37.50;
  const videoH = 37.55;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[360px] sm:max-w-[400px] md:max-w-[540px] max-h-[95vh] overflow-hidden p-0 rounded-2xl shadow-2xl border-0 bg-transparent [&>button]:hidden">
        {/* 背景底图 + 视频层，同比例 */}
        <div className="relative" style={{ aspectRatio: '1080/1920' }}>
          {/* 背景底图 — 详情页 */}
          <img
            src={detailBg}
            alt="视频详情"
            className="absolute inset-0 w-full h-full object-contain select-none"
            draggable={false}
          />

          {/* 视频播放区域 — 按 PS 坐标定位 */}
          <div
            className="absolute overflow-hidden video-slot-border"
            style={{
              left: `${videoLeft}%`,
              top: `${videoTop}%`,
              width: `${videoW}%`,
              height: `${videoH}%`,
              boxShadow: '0 0 16px rgba(255,255,255,0.3)',
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
