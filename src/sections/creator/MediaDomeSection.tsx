import DomeGallery from './DomeGallery';

// GitHub Pages 子路径部署：用 BASE_URL 拼接 public 资源路径
const BASE = import.meta.env.BASE_URL;

/**
 * 媒体数据：混合「图片」与「视频」。
 * - type: 'image'  → 渲染 <img>
 * - type: 'video'  → 渲染 <video>（球面显示首帧，点击放大后自动播放）
 *
 * ⚠️ 视频目前为「本地占位」public/dome-placeholder.mp4（用户提供的 video-02.mp4）。
 *    想换成自己的视频，把文件放进 public/ 并改这里的 src 即可；
 *    增删媒体直接改这个数组，想换默认展示顺序也在这里调。
 */
const MEDIA: { src: string; alt: string; type: 'image' | 'video' }[] = [
  // ===== 图片（unsplash 占位，可替换为你的作品图）=====
  {
    src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: '抽象艺术',
    type: 'image',
  },
  {
    src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: '现代雕塑',
    type: 'image',
  },
  {
    src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: '数字艺术',
    type: 'image',
  },
  {
    src: 'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: '当代艺术',
    type: 'image',
  },
  {
    src: 'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fA%3D%3D',
    alt: '几何纹理',
    type: 'image',
  },
  {
    src: 'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fA%3D%3D',
    alt: '质感表面',
    type: 'image',
  },
  {
    src: 'https://pbs.twimg.com/media/Gyla7NnXMAAXSo_?format=jpg&name=large',
    alt: '社交媒体图',
    type: 'image',
  },
  // ===== 视频（本地占位：public/dome-placeholder.mp4，替换成你自己的视频即可）=====
  // 注意：这里只放 1 条视频。DomeGallery 会把所有媒体循环铺满整个球面，
  //   如果放多条相同视频，segments=32 时会产生几十甚至上百个 <video> 元素同时加载 metadata，
  //   极易导致页面卡顿 / 球面黑屏。想展示多段不同视频就放不同 src 的条目。
  {
    src: `${BASE}dome-placeholder.mp4`,
    alt: '作品视频',
    type: 'video',
  },
];

export default function MediaDomeSection() {
  return (
    <section
      style={{
        background: '#ffffff',
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
            color: '#000',
            WebkitTextFillColor: '#000',
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
            color: '#888',
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
          fit={0.78}
          minRadius={380}
          segments={24}
          dragDampening={2.4}
          grayscale={false}
        />
      </div>
    </section>
  );
}
