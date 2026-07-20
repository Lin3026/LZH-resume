// 作品详情弹窗 — 匹配参考图结构：标题 + 视频 + 项目介绍 / 创意思路 / 数据分析

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export interface WorkDetailData {
  title: string;
  videoUrl: string;
  posterUrl?: string;
  projectIntro: string;
  creativeConcept: string;
  metrics?: { label: string; value: string }[];
  analysisText?: string;
  /** 视频方向：'portrait' 竖版（默认），'landscape' 横版。用于单条视频覆盖默认比例 */
  orientation?: 'portrait' | 'landscape';
}

interface WorkDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: WorkDetailData | null;
}

export default function WorkDetailModal({ open, onOpenChange, data }: WorkDetailModalProps) {
  const [videoKey, setVideoKey] = useState(0);

  // 每次打开新作品时重置视频，确保从头播放
  useEffect(() => {
    if (open && data) {
      setVideoKey((k) => k + 1);
    }
  }, [open, data?.videoUrl]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    },
    [onOpenChange]
  );

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          !max-w-[480px] sm:!max-w-[520px] md:!max-w-[560px]
          !bg-gradient-to-b from-sky-50 via-blue-50/90 to-white
          !rounded-3xl !p-0 !overflow-hidden
          !border-none !shadow-2xl
          max-h-[88vh] overflow-y-auto
        "
        onKeyDown={handleKeyDown}
      >
        {/* ====== 标题栏 ====== */}
        <div className="relative flex items-center justify-center pt-6 pb-4 px-6">
          <h2 className="text-lg sm:text-xl font-black tracking-wide text-blue-600 select-none">
            ✦ 视频详情 ✦
          </h2>
          {/* 关闭按钮 */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4
                       w-9 h-9 flex items-center justify-center
                       rounded-full bg-white/80 backdrop-blur-sm
                       shadow-md text-gray-500 hover:text-gray-800
                       transition-colors cursor-pointer"
            aria-label="关闭"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ====== 视频播放区（默认竖版；orientation='landscape' 时单独横版） ====== */}
        <div className="px-5 pb-4 flex justify-center">
          <div
            className={`relative rounded-2xl overflow-hidden bg-black shadow-lg w-full ${
              data.orientation === 'landscape' ? 'max-w-[420px]' : 'max-w-[280px]'
            }`}
          >
            <video
              key={videoKey}
              src={data.videoUrl}
              poster={data.posterUrl}
              autoPlay
              loop
              playsInline
              controls
              preload="metadata"
              className={`w-full block rounded-2xl ${
                data.orientation === 'landscape'
                  ? 'aspect-[16/9] object-contain'
                  : 'aspect-[9/16] object-cover'
              }`}
            />
          </div>
        </div>

        {/* ====== 内容卡片区 ====== */}
        <div className="px-4 pb-7 space-y-3">

          {/* 项目介绍 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-100/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">
                <span>📋</span>
                <span>项目介绍</span>
              </span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">
              {data.projectIntro}
            </p>
          </div>

          {/* 创意思路 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-amber-100/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-white text-xs font-bold">
                <span>💡</span>
                <span>创意思路</span>
              </span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">
              {data.creativeConcept}
            </p>
          </div>

          {/* 数据分析 */}
          {(data.metrics && data.metrics.length > 0) && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-100/60">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                  <span>📊</span>
                  <span>数据分析</span>
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {data.metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="text-xs text-gray-400 mb-0.5">{m.label}</div>
                    <div className="text-base sm:text-lg font-black text-blue-600">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 分析文案 */}
          {data.analysisText && (
            <p className="text-sm leading-relaxed text-gray-600 px-1">
              {data.analysisText}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
