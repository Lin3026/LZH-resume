import { useState } from 'react';
import { videoWorks } from '../data/resumeData';
import type { VideoWork } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function VideoShowcase() {
  const [selectedVideo, setSelectedVideo] = useState<VideoWork | null>(null);

  return (
    <div className="relative w-full min-h-screen">
      {/* 整个页面就是一张背景图（初稿设计稿），不需要额外 UI 框 */}
      {/* 背景图由 body 的 background-image 提供 */}

      {/* 12 个视频点击区域 — 绝对定位覆盖在背景图的占位符上 */}
      {/* 图片尺寸: 256x1920 (宽高比 1:7.5) */}
      {/* 作品展示区域大约在图片的 52%~85% 纵向范围 */}
      <div className="relative mx-auto" style={{ maxWidth: '560px' }}>
        {videoWorks.map((video, i) => (
          <VideoSlot
            key={video.id}
            video={video}
            index={i}
            onClick={() => setSelectedVideo(video)}
          />
        ))}
      </div>

      {/* 视频详情弹窗 — 点击后弹出 */}
      <VideoDetailDialog
        video={selectedVideo}
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}

// ========== 单个视频槽位 ==========
// 用绝对定位精确覆盖背景图上的灰色占位符
function VideoSlot({
  video,
  index,
  onClick,
}: {
  video: VideoWork;
  index: number;
  onClick: () => void;
}) {
  // 计算行列 (3列 x 4行)
  const col = index % 3; // 0,1,2
  const row = Math.floor(index / 3); // 0,1,2,3

  // 基于初稿图中 12 个占位符的位置估算
  // 图片总高 1920px，作品展示区域约在 1000~1700px 范围
  // 用百分比定位，自适应不同屏幕宽度
  const slotStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${6 + col * 31.5}%`,       // 3 列均布，每列约 31.5% 宽度
    top: `${53 + row * 10.8}%`,         // 4 行，每行约 10.8% 高度间距
    width: '29%',
    height: '9.2%',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={slotStyle}
      className="
        bg-transparent hover:bg-white/25
        border-2 border-transparent hover:border-white/50
        backdrop-blur-[2px]
        group flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2
      "
      aria-label={`查看作品：${video.title}`}
    >
      {/* 默认态：透明，hover 时显示内容 */}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-bold text-sm md:text-base text-center px-2 drop-shadow-lg whitespace-nowrap overflow-hidden text-ellipsis">
        {video.company.split('(')[0]}
      </span>

      {/* hover 时显示播放图标 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div
          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 
                     flex items-center justify-center shadow-2xl
                     scale-75 group-hover:scale-100 transition-transform duration-300"
          style={{
            animation: index % 2 === 0 ? 'pulse-subtle 2s ease-in-out infinite' : undefined,
          }}
        >
          <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-500 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* 编号角标 */}
      <div className="absolute -top-2 -left-2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-bold text-xs md:text-sm flex items-center justify-center shadow-lg opacity-60 group-hover:opacity-100 transition-opacity border-2 border-white/80">
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-2 border-white/40 rounded-3xl p-0 dialog-scroll shadow-2xl shadow-black/20">
        {/* 弹窗头部 — 渐变色背景 */}
        <DialogHeader className="px-6 md:px-8 pt-6 pb-2 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 rounded-t-2xl">
          <DialogTitle className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight">
            🎬 {video.title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 md:px-8 pb-6 space-y-5">
          {/* 视频 / 缩略图预览区 */}
          <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center border-2 border-slate-200">
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            ) : video.videoUrl ? (
              <a href={video.videoUrl} target="_blank" rel="noopener noreferrer"
                 className="flex flex-col items-center gap-4 text-blue-500 hover:text-blue-700 transition-colors no-underline">
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

          {/* 基本信息 */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 space-y-2.5 border border-blue-100">
            <h4 className="text-base font-bold text-blue-800">📋 基本信息</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <div><span className="text-slate-500">公司</span> <strong className="text-blue-800 ml-1">{video.company}</strong></div>
              <div><span className="text-slate-500">角色</span> <strong className="text-blue-800 ml-1">{video.role}</strong></div>
              <div className="col-span-2"><span className="text-slate-500">时间</span> <strong className="text-cyan-700 ml-1">{video.period}</strong></div>
            </div>
          </div>

          {/* 简介 */}
          <div>
            <h4 className="text-base font-bold text-blue-800 mb-1.5">📝 简介</h4>
            <p className="text-blue-800/80 text-sm leading-relaxed whitespace-pre-line">{video.description}</p>
          </div>

          {/* 数据分析面板 */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-5 space-y-2.5 border border-orange-100">
            <h4 className="text-base font-bold text-orange-800">📊 数据分析</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <DataCard label="播放量/下载量" value={video.views || '-'} color="blue" />
              <DataCard label="CPI / 转化成本" value={video.cpi || '-'} color="green" />
              <DataCard label="CTR 点击率" value={video.ctr || '-'} color="purple" />
              <DataCard label="ROI 投产比" value={video.roi || '-'} color="amber" />
            </div>
          </div>

          {/* 核心亮点 */}
          <div className="bg-emerald-50/70 rounded-xl p-5 border border-emerald-100">
            <h4 className="text-base font-bold text-emerald-800 mb-1.5">✨ 核心亮点</h4>
            <p className="text-emerald-800/85 text-sm leading-relaxed whitespace-pre-line font-medium">{video.highlight}</p>
          </div>

          {/* 关闭提示 */}
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

// ========== 数据分析小卡片 ==========
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
