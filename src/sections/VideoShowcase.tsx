import { useState, useRef, useEffect } from 'react';
import { videoWorks } from '../data/resumeData';
import type { VideoWork } from '../types';
import { getVideoDetail } from '../data/videoDetails';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import oceanBg from '../assets/终稿1.jpg';
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
// 页面内容区：1080×1890（视频、文字等元素设计于此区域内）
// 背景图：1080×2305（比内容区高415px，不压缩不裁剪，产生自然滚动空间）
// 百分比基于 1080×2305（背景图全尺寸），内容元素集中在顶部 1890/2305≈82% 区域
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

  // 弹窗打开时自动播放
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[540px] max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-0 bg-transparent [&>button]:hidden">
        {/* 容器比例 = 背景图比例 1080:2305，不裁剪不压缩 */}
        <div
          className="relative w-full"
          style={{ aspectRatio: '1080 / 2305' }}
        >
          {/* 背景底图 — 完整显示 1080×2305，不裁剪 */}
          <img
            src={detailBg}
            alt="视频详情"
            className="absolute inset-0 w-full h-full select-none"
            draggable={false}
          />

          {/* 视频播放区域 — (基于 2305 高度换算) top=115/2305=4.99%, h=712/2305=30.89% */}
          <div
            className="absolute"
            style={{
              left: '31.48%',
              top: '4.99%',
              width: '37.04%',
              height: '30.89%',
              boxShadow: '0 2px 12px rgba(0,0,0,0.4), 0 0 16px rgba(255,255,255,0.3)',
              backgroundColor: '#000',
              border: '3px solid #fff',
              overflow: 'hidden',
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
                    className="w-full h-full"
                    style={{ display: 'block', objectFit: 'cover' }}
                  >
                    您的浏览器不支持视频播放
                  </video>
                  {/* 自定义播放/暂停图标 */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                    style={{ opacity: showIcon ? 1 : 0 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      {isPlaying ? (
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-8 h-8 opacity-40" viewBox="0 0 64 64" fill="none">
                    <rect x="10" y="14" width="44" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
                    <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M30 28 L30 36 L38 32 Z" fill="currentColor" />
                  </svg>
                  <span className="text-xs">视频待上传</span>
                </div>
              )}
            </div>

            {/* 项目简介 — top=945/2305=40.99%, h=270/2305=11.71% */}
          <div
            className="absolute overflow-hidden"
            style={{ left: '9.26%', top: '40.99%', width: '81.48%', height: '11.71%' }}
          >
            <p style={{ fontSize: 13, lineHeight: 1.4, color: 'rgba(23, 37, 84, 0.9)' }}>{detail.projectIntro}</p>
          </div>

          {/* 创意思路 — top=1210/2305=52.49%, h=285/2305=12.36% */}
          <div
            className="absolute overflow-hidden"
            style={{ left: '9.26%', top: '52.49%', width: '81.48%', height: '12.36%' }}
          >
            <p style={{ fontSize: 13, lineHeight: 1.4, color: 'rgba(23, 37, 84, 0.9)' }}>{detail.creativeThinking}</p>
          </div>

          {/* 数据分析 — 5个数值，top=1563/2305=67.81% */}
          <div className="absolute" style={{ left: '15.74%', top: '67.81%', transform: 'translateX(-50%)' }}>
            <p style={{ fontSize: 12, fontWeight: 'bold', color: '#1e3a8a', whiteSpace: 'nowrap' }}>{detail.metrics.ctr}</p>
          </div>
          <div className="absolute" style={{ left: '32.87%', top: '67.81%', transform: 'translateX(-50%)' }}>
            <p style={{ fontSize: 12, fontWeight: 'bold', color: '#1e3a8a', whiteSpace: 'nowrap' }}>{detail.metrics.cvr}</p>
          </div>
          <div className="absolute" style={{ left: '50.00%', top: '67.81%', transform: 'translateX(-50%)' }}>
            <p style={{ fontSize: 12, fontWeight: 'bold', color: '#1e3a8a', whiteSpace: 'nowrap' }}>{detail.metrics.newUsers}</p>
          </div>
          <div className="absolute" style={{ left: '66.67%', top: '67.81%', transform: 'translateX(-50%)' }}>
            <p style={{ fontSize: 12, fontWeight: 'bold', color: '#1e3a8a', whiteSpace: 'nowrap' }}>{detail.metrics.firstDayPayRate}</p>
          </div>
          <div className="absolute" style={{ left: '84.35%', top: '67.81%', transform: 'translateX(-50%)' }}>
            <p style={{ fontSize: 12, fontWeight: 'bold', color: '#1e3a8a', whiteSpace: 'nowrap' }}>{detail.metrics.firstDayRoi}</p>
          </div>

          {/* 底部文本 — top=1656/2305=71.84%, x=125=11.57%, h=95/2305=4.12% */}
          <div
            className="absolute overflow-hidden"
            style={{ left: '11.57%', top: '71.84%', width: '79.17%', height: '4.12%' }}
          >
            <p style={{ fontSize: 13, lineHeight: 1.4, color: 'rgba(23, 37, 84, 0.9)' }}>{detail.bottomNote || ''}</p>
          </div>

          {/* 右上角关闭按钮 — top=16/2305=0.69% */}
          <button
            type="button"
            onClick={onClose}
            className="absolute z-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
            style={{
              top: '0.69%',
              right: '1.48%',
              width: '4.44%',
              height: '2.08%',
              minWidth: 40,
              minHeight: 40,
              border: 'none',
              cursor: 'pointer',
              WebkitAppearance: 'none',
              appearance: 'none',
              touchAction: 'manipulation',
            }}
            aria-label="关闭"
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
