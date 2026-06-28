import { useState } from 'react';
import { videoWorks } from '../data/resumeData';
import type { VideoWork } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import oceanBg from '../assets/ocean-bg.jpg';

/**
 * 12 个视频槽位坐标（百分比，相对于背景图）
 * 作品展示区域，3列 x 4行
 */
const VIDEO_SLOTS = [
  { left: 6,  top: 53.5, width: 28, height: 6 },
  { left: 36, top: 53.5, width: 28, height: 6 },
  { left: 66, top: 53.5, width: 28, height: 6 },

  { left: 6,  top: 61, width: 28, height: 6 },
  { left: 36, top: 61, width: 28, height: 6 },
  { left: 66, top: 61, width: 28, height: 6 },

  { left: 6,  top: 68.5, width: 28, height: 6 },
  { left: 36, top: 68.5, width: 28, height: 6 },
  { left: 66, top: 68.5, width: 28, height: 6 },

  { left: 6,  top: 76, width: 28, height: 6 },
  { left: 36, top: 76, width: 28, height: 6 },
  { left: 66, top: 76, width: 28, height: 6 },
];

export default function VideoShowcase() {
  const [selectedVideo, setSelectedVideo] = useState<VideoWork | null>(null);

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
              onClick={() => setSelectedVideo(video)}
            />
          );
        })}
      </div>

      {/* 视频详情弹窗 */}
      <VideoDetailDialog
        video={selectedVideo}
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
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
        borderRadius: '12px',
      }}
      className="
        bg-transparent hover:bg-white/20
        border-2 border-transparent hover:border-white/60
        backdrop-blur-sm
        group flex items-center justify-center
        transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-white/40
        cursor-pointer
        overflow-hidden
      "
      aria-label={`查看作品 ${index + 1}：${video.title}`}
    >
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
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-2 border-white/40 rounded-3xl p-0 dialog-scroll shadow-2xl">
        <DialogHeader className="px-6 md:px-8 pt-6 pb-2 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 rounded-t-2xl">
          <DialogTitle className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight">
            🎬 {video.title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 md:px-8 pb-6 space-y-5">
          <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center border-2 border-slate-200">
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            ) : video.videoUrl ? (
              <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 text-blue-500 hover:text-blue-700 transition-colors no-underline">
                <div className="w-20 h-20 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span className="font-bold text-base">点击观看视频 →</span>
              </a>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <svg className="w-16 h-16 opacity-30" viewBox="0 0 64 64" fill="none">
                  <rect x="10" y="14" width="44" height="36" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M30 28 L30 36 L38 32 Z" fill="currentColor"/>
                </svg>
                <span className="text-sm">视频素材待上传</span>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 space-y-2.5 border border-blue-100">
            <h4 className="text-base font-bold text-blue-800">📋 基本信息</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <div><span className="text-slate-500">公司</span> <strong className="text-blue-800 ml-1">{video.company}</strong></div>
              <div><span className="text-slate-500">角色</span> <strong className="text-blue-800 ml-1">{video.role}</strong></div>
              <div className="col-span-2"><span className="text-slate-500">时间</span> <strong className="text-cyan-700 ml-1">{video.period}</strong></div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-blue-800 mb-1.5">📝 简介</h4>
            <p className="text-blue-800/80 text-sm leading-relaxed whitespace-pre-line">{video.description}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-5 space-y-2.5 border border-orange-100">
            <h4 className="text-base font-bold text-orange-800">📊 数据分析</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <DataCard label="播放量/下载量" value={video.views || '-'} color="blue" />
              <DataCard label="CPI / 转化成本" value={video.cpi || '-'} color="green" />
              <DataCard label="CTR 点击率" value={video.ctr || '-'} color="purple" />
              <DataCard label="ROI 投产比" value={video.roi || '-'} color="amber" />
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-5 border border-emerald-100">
            <h4 className="text-base font-bold text-emerald-800 mb-1.5">✨ 核心亮点</h4>
            <p className="text-emerald-800/85 text-sm leading-relaxed whitespace-pre-line font-medium">{video.highlight}</p>
          </div>

          <div className="text-center pt-1">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs transition-colors">
              按 ESC 或点击外部关闭
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DataCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    blue:   { bg: 'bg-blue-100', text: 'text-blue-700' },
    green:  { bg: 'bg-green-100', text: 'text-green-700' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
    amber:  { bg: 'bg-amber-100', text: 'text-amber-700' },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className={`rounded-lg p-2.5 ${c.bg} ${c.text}`}>
      <div className="text-[11px] opacity-70 mb-0.5 truncate">{label}</div>
      <div className="text-base font-bold truncate">{value}</div>
    </div>
  );
}
