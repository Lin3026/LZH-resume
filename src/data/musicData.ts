import type { MusicTrack } from '../types/music';

/** 音乐作品数据 — 封面使用 picsum 占位图，音频文件留待用户替换 */
export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'track-01',
    title: '星河入梦',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music01/400/400',
    audioUrl: '',
    category: '单曲',
    genre: ['电子', '氛围'],
    releaseDate: '2025-06',
    duration: 232,
    lyrics: `[00:00.00]星河入梦 — 林志辉
[00:12.00]夜色降临 灯火渐熄
[00:18.00]闭上双眼 听见心底的声音
[00:24.00]星河坠落 落入梦的边际
[00:30.00]我在光影之间 寻觅你的痕迹
[00:36.00]风吹过耳畔 轻声低语
[00:42.00]时间在这一刻 停驻不去`,
    description: '一首融合电子与氛围音乐的单曲，灵感来自夏夜仰望星空的瞬间。',
  },
  {
    id: 'track-02',
    title: '城市脉搏',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music02/400/400',
    audioUrl: '',
    category: '单曲',
    genre: ['电子', '流行'],
    releaseDate: '2025-04',
    duration: 198,
    lyrics: `[00:00.00]城市脉搏 — 林志辉
[00:10.00]霓虹闪烁 车流不息
[00:16.00]城市的心跳 从未停息
[00:22.00]每个路口 每个转角
[00:28.00]都有故事在悄悄发生`,
    description: '以都市生活为背景的电子流行单曲。',
  },
  {
    id: 'track-03',
    title: '森林低语',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music03/400/400',
    audioUrl: '',
    category: '单曲',
    genre: ['自然', '轻音乐'],
    releaseDate: '2025-02',
    duration: 285,
    lyrics: `[00:00.00]森林低语 — 林志辉
[00:15.00]（纯音乐作品）
[00:30.00]听，风穿过树叶的声音
[01:00.00]那是大自然最古老的歌谣`,
    description: '以森林自然环境音为主要元素的轻音乐作品。',
  },
  {
    id: 'track-04',
    title: '午夜咖啡',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music04/400/400',
    audioUrl: '',
    category: '单曲',
    genre: ['爵士', 'Lo-Fi'],
    releaseDate: '2024-12',
    duration: 210,
    lyrics: `[00:00.00]午夜咖啡 — 林志辉
[00:08.00]凌晨三点 咖啡微凉
[00:14.00]窗外的雨 滴答作响
[00:20.00]老唱片机 缓缓旋转
[00:26.00]这一刻 世界只属于我`,
    description: '爵士融合 Lo-Fi 风格的深夜氛围单曲。',
  },
  {
    id: 'track-05',
    title: '远方的信',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music05/400/400',
    audioUrl: '',
    category: '专辑',
    genre: ['民谣', '流行'],
    releaseDate: '2024-09',
    duration: 254,
    lyrics: `[00:00.00]远方的信 — 林志辉
[00:15.00]写了一封很长很长的信
[00:22.00]寄往那个从未到过的远方
[00:29.00]那里有蓝天 白云 和无尽的海
[00:36.00]还有一个等待被找回的梦想`,
    description: '专辑《远方的信》同名主打歌，民谣流行风格。',
  },
  {
    id: 'track-06',
    title: '夏日尾声',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music06/400/400',
    audioUrl: '',
    category: '专辑',
    genre: ['流行', '摇滚'],
    releaseDate: '2024-09',
    duration: 276,
    lyrics: `[00:00.00]夏日尾声 — 林志辉
[00:12.00]蝉鸣渐弱 阳光温柔
[00:18.00]夏天即将走到尽头
[00:24.00]那些疯狂的 热烈的 青春的
[00:30.00]都留在最好的时候`,
    description: '专辑《远方的信》收录曲，流行摇滚风格。',
  },
  {
    id: 'track-07',
    title: '归途',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music07/400/400',
    audioUrl: '',
    category: '专辑',
    genre: ['流行', '抒情'],
    releaseDate: '2024-09',
    duration: 243,
    description: '专辑《远方的信》收录曲，抒情流行风格。',
  },
  {
    id: 'track-08',
    title: '日落大道',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music08/400/400',
    audioUrl: '',
    category: 'EP',
    genre: ['独立', '摇滚'],
    releaseDate: '2024-05',
    duration: 225,
    lyrics: `[00:00.00]日落大道 — 林志辉
[00:10.00]沿着日落大道一直走
[00:16.00]金色的光洒在肩头
[00:22.00]不用在意要去哪里
[00:28.00]路上本身就是目的`,
    description: 'EP《日落大道》同名主打，独立摇滚风格。',
  },
  {
    id: 'track-09',
    title: '月光碎片',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music09/400/400',
    audioUrl: '',
    category: 'EP',
    genre: ['独立', '电子'],
    releaseDate: '2024-05',
    duration: 198,
    description: 'EP《日落大道》收录曲，独立电子风格。',
  },
  {
    id: 'track-10',
    title: '晨光',
    artist: '林志辉',
    coverUrl: 'https://picsum.photos/seed/music10/400/400',
    audioUrl: '',
    category: 'EP',
    genre: ['轻音乐', '氛围'],
    releaseDate: '2024-05',
    duration: 310,
    description: 'EP《日落大道》收录曲，氛围轻音乐。',
  },
];

/** 所有分类 */
export const CATEGORIES: MusicCategory[] = ['单曲', '专辑', 'EP'];

/** 分类中文映射 */
export const CATEGORY_LABELS: Record<MusicCategory, string> = {
  '单曲': '单曲',
  '专辑': '专辑',
  'EP': 'EP',
};
