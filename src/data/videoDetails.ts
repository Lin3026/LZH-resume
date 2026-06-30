/**
 * 视频详情页文本模板
 * 
 * 在这里填写每个视频的详情页文案，方便本地上编辑。
 * 每个条目对应一个 videoWorks 中的视频（通过 id 关联）。
 * 
 * 字段说明（坐标基于PS画布 1080×1920）：
 * - projectIntro:     项目简介文本 → PS: x=100, y=960（top 50.00%）
 * - creativeThinking: 创意思路文本 → PS: x=100, y=1230（top 64.06%）
 * - metrics:          数据分析，5个数值 → PS: y=1590（top 82.81%）
 *     ctr:              CTR          → x=170（left 15.74%）
 *     cvr:              CVR          → x=355（left 32.87%）
 *     newUsers:         新增         → x=540（left 50.00%）
 *     firstDayPayRate:  首日付费率   → x=720（left 66.67%）
 *     firstDayRoi:      首日ROI      → x=911（left 84.35%）
 * - bottomNote:       底部备注文本（可选）→ PS: x=100, y=1684（top 87.71%）
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
  bottomNote?: string;  // 底部备注文本（可选）
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
