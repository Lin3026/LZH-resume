import DomeGallery from './DomeGallery';
import { useIsMobile } from '../../hooks/use-mobile';

// GitHub Pages 子路径部署：用 BASE_URL 拼接 public 资源路径
const BASE = import.meta.env.BASE_URL;

/**
 * 媒体数据：全部为「视频」。
 * 用户决策（2026-07-11）：老家分享「环球展示」方向 = 把所有图片换成视频；
 * 用户会陆续提供真实视频，项目原有的占位视频（dome-placeholder / dome-video-0X）保留不删。
 *
 * 📌 后续新增视频的标准流程（请沿用，方便持续补充）：
 *   1) 把文件拷进 public/，命名为 dome-N.mp4（N 对应用户原目录编号，便于追溯）；
 *   2) 在下方数组追加一项：{ src: `${BASE}dome-N.mp4`, alt: '环球视频 N', type: 'video' }；
 *   3) 视频统一保留在 git，不上外部 CDN。
 * DomeGallery 会把所有视频循环铺满整个球面（segments=24 下每段约出现 6~7 次）。
 */
const MEDIA: { src: string; alt: string; type: 'image' | 'video' }[] = [
  // ===== 真实视频（用户提供：public/dome-1.mp4 ~ dome-12.mp4，跳过 2.mp4）=====
  {
    src: `${BASE}dome-1.mp4`,
    alt: '环球视频 1',
    type: 'video',
  },
  {
    src: `${BASE}dome-3.mp4`,
    alt: '环球视频 3',
    type: 'video',
  },
  {
    src: `${BASE}dome-4.mp4`,
    alt: '环球视频 4',
    type: 'video',
  },
  {
    src: `${BASE}dome-5.mp4`,
    alt: '环球视频 5',
    type: 'video',
  },
  {
    src: `${BASE}dome-6.mp4`,
    alt: '环球视频 6',
    type: 'video',
  },
  {
    src: `${BASE}dome-7.mp4`,
    alt: '环球视频 7',
    type: 'video',
  },
  {
    src: `${BASE}dome-8.mp4`,
    alt: '环球视频 8',
    type: 'video',
  },
  {
    src: `${BASE}dome-9.mp4`,
    alt: '环球视频 9',
    type: 'video',
  },
  {
    src: `${BASE}dome-10.mp4`,
    alt: '环球视频 10',
    type: 'video',
  },
  {
    src: `${BASE}dome-11.mp4`,
    alt: '环球视频 11',
    type: 'video',
  },
  {
    src: `${BASE}dome-12.mp4`,
    alt: '环球视频 12',
    type: 'video',
  },
  // ===== 占位视频（项目原有，保留不删）=====
  {
    src: `${BASE}dome-placeholder.mp4`,
    alt: '占位视频',
    type: 'video',
  },
  {
    src: `${BASE}dome-video-01.mp4`,
    alt: '占位视频 01',
    type: 'video',
  },
  {
    src: `${BASE}dome-video-03.mp4`,
    alt: '占位视频 03',
    type: 'video',
  },
  {
    src: `${BASE}dome-video-04.mp4`,
    alt: '占位视频 04',
    type: 'video',
  },
  {
    src: `${BASE}dome-video-05.mp4`,
    alt: '占位视频 05',
    type: 'video',
  },
];

export default function MediaDomeSection() {
  const isMobile = useIsMobile();
  // 手机上放宽半径下限 + 缩小 fit，避免球体被 minRadius=380 顶得过大而裁切两侧
  const domeFit = isMobile ? 0.62 : 0.78;
  const domeMinRadius = isMobile ? 120 : 380;
  // 移动端拖拽更灵敏：默认 20px/度 → 手机降为 11px/度（手指滑动距离短，需更高灵敏度）
  const domeDragSensitivity = isMobile ? 11 : 20;
  return (
    <section
      id="dome"
      style={{
        background: 'transparent',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div className="text-center">
        <h2
          className="hero-heading text-center"
          style={{
            fontSize: 'clamp(2.5rem, 10vw, 120px)',
            paddingTop: '2.5rem',
            paddingBottom: '0.5rem',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          作品案例
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.08em',
          }}
        >
          点击可以预览
        </p>
      </div>
      {/* DomeGallery 需要一个有明确高度的容器（它内部 100% 撑满） */}
      <div style={{ flex: 1, minHeight: '70vh', height: '70vh', position: 'relative' }}>
        <DomeGallery
          images={MEDIA}
          fit={domeFit}
          minRadius={domeMinRadius}
          segments={24}
          dragDampening={2.4}
          dragSensitivity={domeDragSensitivity}
          grayscale={false}
        />
      </div>
    </section>
  );
}
