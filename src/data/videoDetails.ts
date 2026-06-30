/**
 * 视频详情页文本模板
 * 
 * 在这里填写每个视频的详情页文案，方便本地上编辑。
 * 每个条目对应一个 videoWorks 中的视频（通过 id 关联）。
 * 
 * 字段说明：
 * - projectIntro: 项目简介（对应背景图上的「项目简介」区域）
 * - creativeThinking: 创意思路（对应背景图上的「创意思路」区域）
 * - metrics: 数据分析（对应背景图上的「数据分析」区域）
 */

export interface VideoDetailData {
  id: string;
  projectIntro: string;
  creativeThinking: string;
  metrics: {
    ctr: string;        // 点击率
    cvr: string;        // 转化率
    newUsers: string;   // 新增用户数
    firstDayPayRate: string;  // 首日付费率
    firstDayRoi: string;      // 首日ROI
  };
}

export const videoDetails: Record<string, VideoDetailData> = {
  'video-1': {
    id: 'video-1',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
  'video-2': {
    id: 'video-2',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
  'video-3': {
    id: 'video-3',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
  'video-4': {
    id: 'video-4',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
  'video-5': {
    id: 'video-5',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
  'video-6': {
    id: 'video-6',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
  'video-7': {
    id: 'video-7',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
  'video-8': {
    id: 'video-8',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
  'video-9': {
    id: 'video-9',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
  'video-10': {
    id: 'video-10',
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  },
};

/**
 * 获取视频详情，如果没有对应数据则返回默认测试数据
 */
export function getVideoDetail(id: string): VideoDetailData {
  return videoDetails[id] || {
    id,
    projectIntro: '测试文字',
    creativeThinking: '测试文字',
    metrics: {
      ctr: '5%',
      cvr: '60%',
      newUsers: '2500',
      firstDayPayRate: '2%',
      firstDayRoi: '3%',
    },
  };
}
