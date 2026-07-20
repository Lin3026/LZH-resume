import { useState, useCallback } from 'react';
import { FadeIn } from './components';
import ScrollFloat from './ScrollFloat';
import OrbitMedia from './OrbitMedia';
import WorkDetailModal, { type WorkDetailData } from './WorkDetailModal';
import GalaxyCore from '../../components/GalaxyCore';

const BASE = import.meta.env.BASE_URL;

// 8 个作品数据：缩略图（轨道展示）+ 视频/文案（弹窗展示）
const WORKS: {
  thumbnail: string;
  detail: WorkDetailData;
}[] = [
  {
    thumbnail: `${BASE}dome-24.mp4`,
    detail: {
      title: '冰喇叭 · 创意消除',
      videoUrl: `${BASE}dome-24.mp4`,
      projectIntro:
        '游戏：假日乐消消乐，用户人群女性占比较多，核心年龄层 25-35 岁。',
      creativeConcept:
        '主要突出的是连续消除的爽感，这种是录屏没有办法体现的节奏。用动态特效强化消除反馈，配合欢快音效，让用户在短短几秒内感受到「想玩一把」的冲动。',
      metrics: [
        { label: 'CTR', value: '5%' },
        { label: 'CVR', value: '60%' },
        { label: '新增', value: '2500' },
        { label: '首日付费率', value: '2%' },
        { label: '首日ROI', value: '3%' },
      ],
      analysisText:
        'ctr和转化率都高于平均水平，而且持续每天都有付费，证明抓到了核心用户群体。后续可针对高转化素材风格进行系列化产出。',
    },
  },
  {
    thumbnail: `${BASE}video-02.mp4`,
    detail: {
      title: 'Tile Fun 海外投放素材',
      videoUrl: `${BASE}video-02.mp4`,
      posterUrl: `${BASE}video-02-cover.jpg`,
      projectIntro:
        '游戏：假日乐消消乐，用户人群女性占比较多，核心年龄层 25-35 岁。',
      creativeConcept:
        '利用抖音火起来的语音作为视频的口播文案，开头3秒直接把用户吸引住，后续用搞笑对话进行视频的节奏的推进。',
      metrics: [
        { label: 'CTR', value: '4.2%' },
        { label: 'CVR', value: '55%' },
        { label: '新增', value: '1800' },
        { label: '首日付费率', value: '1.8%' },
        { label: '首日ROI', value: '2.5%' },
      ],
    },
  },
  {
    thumbnail: `${BASE}video-03.mp4`,
    detail: {
      title: 'Coloring Fun 创意视频',
      videoUrl: `${BASE}video-03.mp4`,
      posterUrl: `${BASE}video-03-cover.jpg`,
      projectIntro:
        '游戏：假日乐消消乐，用户人群女性占比较多，核心年龄层 25-35 岁。',
      creativeConcept:
        '利用抖音火起来的语音作为视频的口播文案，开头3秒直接把用户吸引住，后续用搞笑对话进行视频的节奏的推进。',
      metrics: [
        { label: 'CTR', value: '3.8%' },
        { label: 'CVR', value: '48%' },
        { label: '新增', value: '1200' },
        { label: '首日付费率', value: '1.5%' },
        { label: '首日ROI', value: '2.0%' },
      ],
    },
  },
  {
    thumbnail: `${BASE}video-04.mp4`,
    detail: {
      title: '赛事包装 · 英雄联盟',
      videoUrl: `${BASE}video-04.mp4`,
      posterUrl: `${BASE}video-04-cover.jpg`,
      projectIntro:
        '游戏：假日乐消消乐，用户人群女性占比较多，核心年龄层 25-35 岁。',
      creativeConcept:
        '利用抖音火起来的语音作为视频的口播文案，开头3秒直接把用户吸引住，后续用搞笑对话进行视频的节奏的推进。',
      metrics: [
        { label: '播放量', value: '50w+' },
        { label: '互动率', value: '8.2%' },
        { label: '完播率', value: '65%' },
        { label: '分享数', value: '3200' },
        { label: '涨粉', value: '8000' },
      ],
      analysisText:
        '赛事包装素材的完播率和分享数据显著高于平均水平，说明快节奏+慢放的组合在电竞赛事场景下具有强传播性。',
    },
  },
  {
    thumbnail: `${BASE}video-05.mp4`,
    detail: {
      title: '火影忍者手游宣传',
      videoUrl: `${BASE}video-05.mp4`,
      posterUrl: `${BASE}video-05-cover.jpg`,
      projectIntro:
        '开心消消乐，十几年长青老游戏，用户群覆盖全年龄段，男女比例接近平衡。',
      creativeConcept:
        '将经典忍术招式与现代动效结合，通过「查克拉爆发」视觉符号串联全片。开场用经典台词唤醒粉丝记忆，中段展示战斗画面，结尾引出下载引导。',
      metrics: [
        { label: 'CTR', value: '6.1%' },
        { label: 'CVR', value: '52%' },
        { label: '新增', value: '3500' },
        { label: '首日付费率', value: '2.8%' },
        { label: '首日ROI', value: '3.5%' },
      ],
    },
  },
  // 后续 3 个位置预留，提供真实作品后替换
  {
    thumbnail: `${BASE}dome-15.mp4`, // 暂用视频帧作缩略图
    detail: {
      title: '环球展示 · 作品 06',
      videoUrl: `${BASE}dome-15.mp4`,
      posterUrl: `${BASE}dome-15.mp4`,
      projectIntro:
        '开心水族箱，十几年养成老游戏，用户群25–40 岁，女性偏多，基本都是老用户回归',
      creativeConcept: '待补充创意思路…',
      orientation: 'landscape',
    },
  },
  {
    thumbnail: `${BASE}resume-2020.mp4`,
    detail: {
      title: '林志辉 · 个人简历视频（2020）',
      videoUrl: `${BASE}resume-2020.mp4`,
      posterUrl: `${BASE}resume-2020.mp4`,
      projectIntro: '个人简历介绍视频，展示职业经历与核心能力。',
      creativeConcept: '待补充创意思路…',
      orientation: 'landscape',
    },
  },
  {
    thumbnail: `${BASE}dome-video-08.mp4`,
    detail: {
      title: '环球展示 · 作品 08',
      videoUrl: `${BASE}dome-video-08.mp4`,
      projectIntro: '待补充项目介绍…',
      creativeConcept: '待补充创意思路…',
      orientation: 'landscape',
    },
  },
];

export default function WorksShowcaseSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isModalOpen = selectedIndex !== null;

  const handleItemClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  return (
    <section
      id="showcase"
      className="relative z-10 px-4 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-12 pb-24"
    >
      <div className="mb-2 sm:mb-3">
        <ScrollFloat containerClassName="section-float-title">
          视频解析
        </ScrollFloat>
      </div>

      <FadeIn delay={0.1} y={20} className="mb-4 sm:mb-6 group">
        <p className="text-center font-medium tracking-wide text-gradient" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)' }}>
          点击轨道上的视频，查看视频详情
          <span className="ml-2 inline-block align-middle text-[#22d3ee] transition-transform duration-300 group-hover:translate-x-1">→</span>
        </p>
      </FadeIn>

      <div className="relative mx-auto -mt-20 sm:-mt-28 lg:-mt-36" style={{ maxWidth: 1000 }}>
        <OrbitMedia
          images={WORKS.map((w) => w.thumbnail)}
          shape="ellipse"
          responsive
          baseWidth={1400}
          radiusX={640}
          radiusY={240}
          itemSize={190}
          rotation={-6}
          duration={75}
          showPath
          pathWidth={4}
          pathGradient={['#22d3ee', '#a855f7', '#f472b6', '#facc15', '#22d3ee']}
          centerContent={<GalaxyCore size={704} tilt={-6} squash={240 / 640} />}
          onItemClick={handleItemClick}
        />
      </div>

      {/* 弹窗 */}
      <WorkDetailModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleModalClose();
        }}
        data={isModalOpen ? WORKS[selectedIndex!].detail : null}
      />
    </section>
  );
}
