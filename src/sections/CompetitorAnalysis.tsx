import { useEffect, useState, type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { competitorDocs, type CompetitorDoc } from './competitor/competitorDocs';
import './competitor/competitor.css';

const BASE = import.meta.env.BASE_URL;

// 图片：加载失败显示兜底占位（飞书外链失效 / 资源缺失都不会白屏）
function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div className="md-img-fallback">
        图片加载失败 / 资源待补充
        <br />
        {alt || src || ''}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      onError={() => setErr(true)}
    />
  );
}

// 视频链接：渲染为播放器；文件缺失则显示占位
function MarkdownVideo({ src, label }: { src: string; label: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return <div className="md-video-fallback">🎬 {label}（视频资源待补充）</div>;
  }
  return (
    <div className="md-video-wrap">
      <div className="md-video-label">▶ {label}</div>
      <video src={src} controls preload="metadata" onError={() => setErr(true)} />
    </div>
  );
}

function MarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (href && /\.(mp4|webm|ogg)(\?.*)?$/i.test(href)) {
    const label =
      typeof children === 'string' && children.trim()
        ? children.replace(/\.(mp4|webm|ogg)$/i, '')
        : '视频';
    return <MarkdownVideo src={href} label={label} />;
  }
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

const mdComponents: Components = {
  img({ src, alt }) {
    return <MarkdownImage src={src} alt={alt} />;
  },
  a({ href, children }) {
    return <MarkdownLink href={href} children={children} />;
  },
};

export default function CompetitorAnalysis() {
  const [active, setActive] = useState<CompetitorDoc | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // 汇总所有标签（去重）
  const allTags = Array.from(
    new Set(competitorDocs.flatMap((d) => d.tags)),
  ).sort();

  // 标签筛选：命中任一选中标签即显示（OR）
  const filtered = activeTags.length
    ? competitorDocs.filter((d) => d.tags.some((t) => activeTags.includes(t)))
    : competitorDocs;

  // 打开弹窗时拉取 Markdown 内容
  useEffect(() => {
    if (!active) {
      setContent('');
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`${BASE}${active.file}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.text();
      })
      .then((t) => {
        if (cancelled) return;
        // 飞书导出里 \[xxx.mp4\] 形式的视频备注，转成醒目标记
        const processed = t.replace(
          /\\\[([^\]]+\.mp4)\\\]/g,
          '**🎬 $1**',
        );
        setContent(processed);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setContent('# 加载失败\n\n文档内容未能读取，请稍后重试。');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  // Esc 关闭 + 滚动锁定（复用现有 lightbox 交互）
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  const toggleTag = (t: string) => {
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  return (
    <div className="relative z-10 px-4 sm:px-8 md:px-10 pt-24 pb-24">
      {/* Hero */}
      <div className="competitor-hero">
        <h1>竞品分析</h1>
        <p>持续追踪行业头部产品，沉淀竞品拆解与方法论</p>
      </div>

      {/* 标签筛选条 */}
      <div className="filter-bar">
        {allTags.map((t) => (
          <button
            key={t}
            className={`filter-tag${activeTags.includes(t) ? ' active' : ''}`}
            onClick={() => toggleTag(t)}
          >
            {t}
          </button>
        ))}
        {activeTags.length > 0 && (
          <button className="filter-clear" onClick={() => setActiveTags([])}>
            清除筛选
          </button>
        )}
      </div>

      {/* 文档卡片网格 */}
      <div className="doc-grid">
        {filtered.map((doc) => (
          <button
            key={doc.id}
            className="doc-card"
            onClick={() => setActive(doc)}
          >
            <div className="doc-card-title">{doc.title}</div>
            <div className="doc-card-tags">
              {doc.tags.map((t) => (
                <span key={t} className="doc-card-tag">
                  {t}
                </span>
              ))}
            </div>
            <p className="doc-card-summary">{doc.summary}</p>
            <div className="doc-card-meta">
              <span>{doc.date}</span>
              <span className="doc-card-foot">查看 →</span>
            </div>
          </button>
        ))}
      </div>

      {/* 阅读弹窗 */}
      {active && (
        <div className="doc-modal-overlay" onClick={() => setActive(null)}>
          <div className="doc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="doc-modal-head">
              <h3>{active.title}</h3>
              <button
                className="doc-modal-close"
                onClick={() => setActive(null)}
                aria-label="关闭"
              >
                ×
              </button>
            </div>
            <div className="doc-modal-body markdown-body">
              {loading ? (
                <div className="doc-loading">加载中…</div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
