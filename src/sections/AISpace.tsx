import { type ReactNode } from 'react';

const BASE = import.meta.env.BASE_URL;

/**
 * 个人空间（home）新模板 —— AI 做视频的流程与案例分析
 *
 * 说明：本页为「空白模块占位」版本，方便先确认整体布局与节奏，
 * 之后再往各占位模块里填真实内容（视频、文案、流程节点等）。
 * 所有区块均为占位骨架，标注了每个模块该放什么。
 */

type SectionId =
  | 'hero'
  | 'preview'
  | 'cases';

// ============ 通用占位卡片 ============
function Placeholder({
  label,
  hint,
  className = '',
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`group relative rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-5 transition-colors hover:border-cyan-400/50 ${className}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-md bg-cyan-500/15 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
          占位
        </span>
        <span className="text-sm font-semibold text-white/85">{label}</span>
      </div>
      {hint && <p className="text-xs leading-relaxed text-white/45">{hint}</p>}
      {children}
    </div>
  );
}

// ============ 区块标题 ============
function SectionHeading({
  index,
  kicker,
  title,
  desc,
}: {
  index: string;
  kicker: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-10 text-center">
      <div className="mb-3 inline-flex items-center gap-2">
        <span className="text-xs font-mono text-cyan-400/80">{index}</span>
        <span className="h-px w-8 bg-gradient-to-r from-cyan-400/60 to-transparent" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
          {kicker}
        </span>
      </div>
      <h2
        className="font-black leading-none tracking-tight text-white"
        style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
      >
        {title}
      </h2>
      {desc && (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
          {desc}
        </p>
      )}
    </div>
  );
}

// ============ 流程步骤占位 ============
function StepCard({ no, title, hint }: { no: string; title: string; hint: string }) {
  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-sm font-bold text-slate-900">
          {no}
        </span>
        <span className="text-base font-semibold text-white/90">{title}</span>
      </div>
      <p className="text-xs leading-relaxed text-white/45">{hint}</p>
      <div className="mt-1 h-20 rounded-xl border border-dashed border-white/15 bg-black/20" />
    </div>
  );
}

// ============ 主页面 ============
export default function AISpace() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-24 sm:px-8">
      {/* ===== Hero ===== */}
      <section id="hero" className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <span className="mb-5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-medium text-cyan-300">
          AI 创作 · 流程与案例分析
        </span>
        <h1
          className="font-black leading-[1.05] tracking-tight text-white"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 5rem)' }}
        >
          AI 做视频
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60">
          这里会分享我从想法到成片的完整工作流，以及每个环节的实操案例与踩坑笔记。
          （此处为占位标题与简介，待替换为你的真实定位语。）
        </p>
        <div className="mt-8 h-12 w-7 rounded-full border-2 border-white/25">
          <span className="mx-auto mt-2 block h-2 w-1 rounded-full bg-cyan-400 animate-scroll-dot" />
        </div>
      </section>

      {/* ===== 成品预览（置顶） ===== */}
      <section id="preview" className="scroll-mt-24 py-16">
        <SectionHeading
          index="01"
          kicker="Showcase"
          title="成品预览"
          desc="先看效果。下方为 AI 做视频的成品展示，点击即可播放查看。"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-base font-semibold text-white/90">美得很之家</span>
            </div>
            <div className="flex items-center justify-center bg-black/40 h-[360px] sm:h-[420px]">
              <video
                src={`${BASE}ai-show-01.mp4`}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
              />
            </div>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-base font-semibold text-white/90">AI自制游戏剧情pv</span>
            </div>
            <div className="flex items-center justify-center bg-black/40 h-[360px] sm:h-[420px]">
              <video
                src={`${BASE}ai-show-02.mp4`}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
              />
            </div>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-base font-semibold text-white/90">衣帽间建造</span>
            </div>
            <div className="flex items-center justify-center bg-black/40 h-[360px] sm:h-[420px]">
              <video
                src={`${BASE}ai-show-03.mp4`}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
              />
            </div>
          </figure>
        </div>
      </section>

      {/* ===== 案例分析 ===== */}
      <section id="cases" className="scroll-mt-24 py-16">
        <SectionHeading
          index="02"
          kicker="Case Studies"
          title="案例分析"
          desc="从脚本到成片的视频生产流水线，按案例拆解每个环节的实操与踩坑。"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StepCard no="1" title="创意 & 脚本" hint="选题、口播文案、节奏。占位：脚本卡片。" />
          <StepCard no="2" title="分镜 & 画面" hint="拆解镜头、确定画面来源。占位：分镜表。" />
          <StepCard no="3" title="生成 & 配音" hint="图/视频生成 + 语音。占位：片段缩略图。" />
          <StepCard no="4" title="剪辑 & 包装" hint="合成、字幕、音效、调色。占位：时间线示意。" />
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Placeholder
              key={i}
              label={`案例 ${i}`}
              hint="封面图 + 标题 + 一句话亮点 + 标签。点击进入详情（详情页待设计）。"
              className="h-full"
            >
              <div className="mt-3 h-32 rounded-xl border border-dashed border-white/15 bg-black/20" />
            </Placeholder>
          ))}
        </div>
      </section>
    </div>
  );
}
