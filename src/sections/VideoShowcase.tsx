import { useState } from 'react';
import { videoWorks } from '../data/resumeData';
import type { VideoWork } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ========== 主组件：作品展示区 ==========
export default function VideoShowcase() {
  const [selectedVideo, setSelectedVideo] = useState<VideoWork | null>(null);

  return (
    <section id="works" className="py-16 md:py-24 relative">
      {/* 标题区域 — 参考初稿图风格 */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 text-center mb-12 md:mb-20">
        {/* 大标题 */}
        <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          style={{
            WebkitTextStroke: '2px rgba(59,130,246,0.8)',
            paintOrder: 'stroke fill',
          }}
        >
          作品展示
        </h2>
        {/* 副标题丝带 */}
        <div className="relative inline-block mx-auto">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 rounded-full transform rotate-[1deg] shadow-lg shadow-blue-500/30" />
          <p className="relative z-10 px-10 py-2 text-white font-bold tracking-wider text-lg drop-shadow-sm">
            ★ 点击查看详情 ★
          </p>
        </div>
      </div>

      {/* 12 个视频卡片 — 3列 x 4行 网格 */}
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {videoWorks.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => setSelectedVideo(video)}
            />
          ))}
        </div>
      </div>

      {/* 视频详情弹窗 */}
      <VideoDetailDialog
        video={selectedVideo}
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
}

// ========== 视频卡片组件 ==========
function VideoCard({ video, onClick }: { video: VideoWork; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-white/80 border-2 border-blue-200/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 ocean-card cursor-pointer text-left"
    >
      {/* 缩略图区域（或占位符） */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center overflow-hidden">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* 占位符 — 灰色背景 + 播放图标 */
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <svg className="w-14 h-14 opacity-40" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2"/>
              <path d="M26 22 L26 42 L44 32 Z" fill="currentColor" />
            </svg>
            <span className="text-sm font-medium">点击预览</span>
          </div>
        )}
        {/* Hover 时显示的播放遮罩 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
            <svg className="w-7 h-7 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 文字信息区域 */}
      <div className="p-4 md:p-5">
        <h3 className="text-base md:text-lg font-bold text-blue-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-cyan-700 font-medium">
          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0" />
          <span>{video.company}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-cyan-500 mt-1">
          <span>📅</span>
          <span>{video.period}</span>
        </div>
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 border-2 border-blue-300 rounded-3xl p-0 dialog-scroll shadow-2xl">
        <DialogHeader className="px-6 md:px-8 pt-6 pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl">
          <DialogTitle className="text-2xl md:text-3xl font-black text-blue-900">
            🎬 {video.title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 md:px-8 pb-6 space-y-6">
          {/* 视频 / 缩略图预览区 */}
          <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center border border-blue-100">
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            ) : video.videoUrl ? (
              <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-blue-500 hover:text-blue-700 transition-colors">
                <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span className="font-semibold">点击观看视频 →</span>
              </a>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <svg className="w-20 h-20 opacity-30" viewBox="0 0 64 64" fill="none">
                  <rect x="10" y="14" width="44" height="36" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M30 28 L30 36 L38 32 Z" fill="currentColor"/>
                </svg>
                <span className="text-sm">视频待上传</span>
              </div>
            )}
          </div>

          {/* 基本信息 */}
          <div className="bg-blue-50/60 rounded-xl p-5 space-y-3 border border-blue-100">
            <h4 className="text-lg font-bold text-blue-800">📋 基本信息</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">公司：</span><span className="font-semibold text-blue-800">{video.company}</span></div>
              <div><span className="text-slate-500">角色：</span><span className="font-semibold text-blue-800">{video.role}</span></div>
              <div className="col-span-2"><span className="text-slate-500">时间：</span><span className="font-semibold text-cyan-700">{video.period}</span></div>
            </div>
          </div>

          {/* 简介 */}
          <div>
            <h4 className="text-lg font-bold text-blue-800 mb-2">📝 简介</h4>
            <p className="text-blue-800/85 text-base leading-relaxed whitespace-pre-line">
              {video.description}
            </p>
          </div>

          {/* 数据分析面板 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 space-y-3 border border-orange-100">
            <h4 className="text-lg font-bold text-orange-800">📊 数据分析</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DataCard label="播放量/下载量" value={video.views || '-'} color="blue" />
              <DataCard label="CPI / 转化成本" value={video.cpi || '-'} color="green" />
              <DataCard label="CTR 点击率" value={video.ctr || '-'} color="purple" />
              <DataCard label="ROI 投产比" value={video.roi || '-'} color="amber" />
            </div>
          </div>

          {/* 核心亮点 */}
          <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-100">
            <h4 className="text-lg font-bold text-emerald-800 mb-2">✨ 核心亮点</h4>
            <p className="text-emerald-800/85 text-base leading-relaxed whitespace-pre-line font-medium">
              {video.highlight}
            </p>
          </div>

          {/* 关闭按钮提示 */}
          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
            >
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
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return (
    <div className={`rounded-lg p-3 border ${colorMap[color] || colorMap.blue}`}>
      <div className="text-xs opacity-70 mb-1">{label}</div>
      <div className="text-base md:text-lg font-bold truncate">{value}</div>
    </div>
  );
}
