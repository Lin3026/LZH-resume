// 环球展示球面视频源（单一数据源）
// ⚠️ 重要：新增 / 删除 dome 视频时，本文件与 MediaDomeSection.tsx 的 MEDIA 数组需同步更新。
//    GameLoading 在「互动游戏」页用本列表做后台预取，提前把简历资源下载好，进个人空间即秒开。
const BASE = import.meta.env.BASE_URL;

export const DOME_VIDEO_SOURCES: string[] = [
  `${BASE}dome-1.mp4`,
  `${BASE}dome-3.mp4`,
  `${BASE}dome-4.mp4`,
  `${BASE}dome-5.mp4`,
  `${BASE}dome-6.mp4`,
  `${BASE}dome-7.mp4`,
  `${BASE}dome-8.mp4`,
  `${BASE}dome-9.mp4`,
  `${BASE}dome-10.mp4`,
  `${BASE}dome-11.mp4`,
  `${BASE}dome-12.mp4`,
  `${BASE}dome-13.mp4`,
  `${BASE}dome-14.mp4`,
  `${BASE}dome-15.mp4`,
  `${BASE}dome-16.mp4`,
  `${BASE}dome-17.mp4`,
  `${BASE}dome-18.mp4`,
  `${BASE}dome-19.mp4`,
  `${BASE}dome-20.mp4`,
  `${BASE}dome-placeholder.mp4`,
  `${BASE}dome-video-01.mp4`,
  `${BASE}dome-video-03.mp4`,
  `${BASE}dome-video-04.mp4`,
  `${BASE}dome-video-05.mp4`,
];
