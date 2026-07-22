export interface CompetitorDoc {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  date: string;
  file: string; // 相对 public 的路径，如 'competitor/dnf.md'
}

export const competitorDocs: CompetitorDoc[] = [
  {
    id: 'dnf',
    title: '地下城与勇士：起源',
    tags: ['MMO', '横版格斗', '腾讯', '买量', '宣发'],
    summary:
      '研发背景、角色 / 养成 / PK 系统拆解，公测宣发与买量策略、素材分析，并对比竞品晶核。',
    date: '2024',
    file: 'competitor/dnf.md',
  },
  {
    id: 'eliminate',
    title: '消除类竞品分析',
    tags: ['三消', 'SLG', '海外', '买量'],
    summary:
      'Puzzles & Survival / Bubble Shooter Star / Tile Match 三款消除类产品的素材、渠道与用户特征分析。',
    date: '2022',
    file: 'competitor/eliminate.md',
  },
  {
    id: 'cat',
    title: '猫咪二重奏分析',
    tags: ['音乐', '休闲', '买量'],
    summary: '猫咪二重奏的投放趋势、国家分布、下载量与用户画像（性别 / 年龄）分析。',
    date: '2023',
    file: 'competitor/cat.md',
  },
  {
    id: 'tm3d',
    title: 'Triple Match 3D 素材分析',
    tags: ['三消', '3D', '素材分析', '投放', '海外'],
    summary:
      '投放周期一年、渠道 FB/Unity/Admob，用户女6男4、45+占60%；素材按下载最多 / 投放最长 / 创意UE / 消除+家装 / 解压音效分类拆解。',
    date: '2026',
    file: 'competitor/tm3d.md',
  },
];
