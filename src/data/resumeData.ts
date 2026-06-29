import type { PersonalInfo, WorkExperience, Education, Skill, Project, VideoWork } from '../types';

export const personalInfo: PersonalInfo = {
  name: '林志辉',
  title: '高级广告创意设计师 / 游戏视频设计师',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linzhihui&backgroundColor=b6e3f4',
  email: '302641078@qq.com',
  phone: '18279132481',
  location: '北京，中国',
  github: 'https://github.com/Lin3026',
  bio: `9 年视频设计经验，其中 7+ 年游戏创意策划经验，具备全流程化视频创意和制作能力。
擅长挖掘产品卖点、分析广告数据、归纳总结优秀案例，及时沉淀方法论并应用于工作。
6 年消除游戏广告制作与数据分析经验，掌握各地区人群属性、偏好及特点。
2 年视频后期制作，熟悉所有类型的视频制作流程。
擅长使用 AI 工具（ChatGPT、DP、Gemini、即梦、可灵、海螺等）进行创意发散与落地，AIGC 领域经验丰富。`,
};

export const workExperiences: WorkExperience[] = [
  {
    id: 'work-1',
    company: '乐元素科技(北京)股份有限公司',
    position: '高级广告创意设计师',
    startDate: '2022-05',
    endDate: '至今',
    description: `负责开心消消乐、开心水族箱、假日乐消消、宝贝乐消消、BabyTopia 等多款游戏创意方向。
对接外包视频制作，创意整理及投放数据分析并做出计划调整。
其中「假日乐消消」去年国内上线成功，今年开始盈利。`,
    tags: ['开心消消乐', '开心水族箱', '假日乐消消', '宝贝乐消消', 'BabyTopia'],
  },
  {
    id: 'work-2',
    company: '小米海外游戏',
    position: '海外广告视频设计师',
    startDate: '2020-03',
    endDate: '2022-04',
    description: `负责海外三消、涂色、经营等多款游戏视频制作，对接外包视频制作。
对实习生进行技能培训与创意思维培训。
Tile Fun 一年半下载量 2000 万，Match Fun3D 下载量 500 万。
Tile Fun 曾进入日本排行榜第九、欧洲排行第五。`,
    tags: ['Tile Fun', 'Match Fun3D', '海外三消', '涂色', '经营'],
  },
  {
    id: 'work-3',
    company: '乐城堡科技有限公司',
    position: '海外游戏视频设计师',
    startDate: '2019-05',
    endDate: '2020-01',
    description: `负责多款海外游戏投放视频广告制作（Puzzle、涂色、World 品类）。
其中 Coloring Fun 达到 1000 万下载量。`,
    tags: ['Coloring Fun', 'Puzzle', '涂色', 'World'],
  },
  {
    id: 'work-4',
    company: '月蚀文化发展',
    position: '后期制作',
    startDate: '2017-08',
    endDate: '2019-04',
    description: `负责游戏栏目包装、游戏赛事包装（火影、英雄联盟、逆战）。
制作游戏版本更新视频，熟悉各类视频后期制作流程。`,
    tags: ['火影', '英雄联盟', '逆战', '赛事包装', '栏目包装'],
  },
];

export const educations: Education[] = [
  {
    id: 'edu-1',
    school: '南昌大学科学技术学院',
    degree: '本科',
    major: '动画',
    startDate: '2013-09',
    endDate: '2017-07',
    description: '系统学习动画专业理论与制作技能，涵盖二维动画、三维动画、影视后期等方向。',
  },
  {
    id: 'edu-2',
    school: '江西视图科技教育培训机构',
    degree: '职业技能培训',
    major: 'C4D / AE / PS / PR',
    startDate: '2015-09',
    endDate: '2016-07',
    description: '系统学习 Cinema 4D、After Effects、Photoshop、Premiere Pro 等设计与视频制作软件技能。',
  },
];

export const skills: Skill[] = [
  { name: 'Photoshop', icon: '/icons/Ps.png', level: 5, category: '设计工具' },
  { name: 'After Effects', icon: '/icons/Ae.png', level: 5, category: '设计工具' },
  { name: 'Premiere Pro', icon: '/icons/Pr.png', level: 5, category: '设计工具' },
  { name: 'Cinema 4D', icon: '/icons/c4d.png', level: 4, category: '设计工具' },
  { name: 'Unity', icon: '/icons/unity.png', level: 3, category: '设计工具' },
  { name: '即梦', icon: '🤖', level: 5, category: 'AI 工具' },
  { name: 'ChatGPT', icon: '💬', level: 5, category: 'AI 工具' },
];

export const projects: Project[] = [
  {
    id: 'project-1',
    title: '「星耀」科技品牌全案设计',
    description: '为新锐科技品牌打造完整视觉体系，含 Logo、VI 手册、官网视觉及品牌宣传物料。风格简洁科技感，获客户高度认可。',
    tags: ['Photoshop', '即梦', 'ChatGPT'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-24638eff58f4?w=800&q=80',
    markdownContent: `## 项目背景

「星耀」是一家专注于**AI 芯片**的初创公司，需要一套能体现"前沿技术 × 简约美学"的视觉体系。

## 设计流程

1. **品牌调研**：通过 ChatGPT 快速梳理行业竞品视觉趋势
2. **概念发散**：即梦 AI 生成 50+ 品牌意象图作为灵感库
3. **视觉落地**：Photoshop 精修 Logo 及全套 VI 物料
4. **交付输出**：品牌手册印刷稿 + 数字用规范文档

## 核心产出

| 类别 | 内容 | 数量 |
|------|------|------|
| Logo | 主标/副标/图标 | 3 套 |
| VI 手册 | 色彩/字体/排版规范 | 80 页 |
| 官网视觉 | 首页 + 5 子页面 | 6 P |
| 宣传物料 | 海报/折页/展架 | 12 件 |

## 客户反馈

> "远超预期，完美传达了我们想要的品牌气质。" —— 星耀 CEO
`,
  },
  {
    id: 'project-2',
    title: 'C4D 产品三维动画短片',
    description: '使用 Cinema 4D 为智能手表新品打造 30 秒三维产品宣传动画，Redshift 渲染，质感细腻。',
    tags: ['Cinema 4D', 'After Effects', 'Photoshop'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    markdownContent: `## 项目概述

客户新品**智能手表**上市在即，需要在发布会播放一支 30 秒的三维产品动画。

## 制作流程

### 1. 建模阶段（C4D）
- 高精度产品建模，还原厘米级细节
- 材质分层：金属拉丝表壳、蓝宝石玻璃、硅胶表带

### 2. 灯光与材质
- Redshift 物理渲染器
- 三点布光 + 环境 HDR，突出产品质感
- SSS 材质模拟皮肤接触效果

### 3. 动画编排
- 产品拆解 → 旋转展示 → 功能高亮
- 黄金螺旋运镜，节奏感强

### 4. 后期合成（AE + PS）
- AE 动态文字叠加
- PS 调色 + 背景处理

## 渲染统计

| 项目 | 数据 |
|------|------|
| 总帧数 | 750 帧 |
| 单帧渲染 | ~2 分钟 |
| Redshift 采样 | 256 |
| 最终分辨率 | 4K (3840×2160) |
`,
  },
  {
    id: 'project-3',
    title: '企业宣传片《数字脉动》',
    description: '为某金融科技公司打造 3 分钟品牌宣传片，负责全程的剪辑、调色、动效包装及音效设计。',
    tags: ['Premiere Pro', 'After Effects', 'Photoshop'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',
    markdownContent: `## 项目概览

**客户**：某金融科技集团  
**时长**：3 分 15 秒  
**用途**：官网首页 + 投资者路演  
**周期**：4 周

## 制作流程

### 粗剪（PR）
- 从 6 小时素材中精选 3 分钟
- 三幕式叙事结构：品牌溯源 → 技术突破 → 未来愿景
- 多机位同步剪辑

### 精剪 & 调色
- Lumetri 专业调色，统一暖金科技感色调
- 关键帧变速：重要信息慢放 50%

### 动效包装（AE）
- 数据可视化的 MG 动画叠加
- 文字动画衔接，统一品牌字体
- 转场特效：流线型粒子过渡

### 音效设计
- 原创配乐 + 环境音效
- 关键节点音效强化情绪

## 传播数据

- 官网播放：**12 万次**
- 投资者会议使用：**8 场**
- 社交媒体转发：**3,200+次**
`,
  },
  {
    id: 'project-4',
    title: 'Unity 互动展厅体验',
    description: '使用 Unity 引擎为某汽车品牌打造虚拟线上展厅，支持 WebGL 浏览器直接体验，3D 实时交互看车。',
    tags: ['Unity', 'Cinema 4D', 'ChatGPT'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    markdownContent: `## 项目需求

疫情后线下车展受限，客户需要一套**线上虚拟展厅**替代方案，用户无需下载 App 即可在浏览器中 3D 看车。

## 技术架构

### 3D 资产制作（C4D）
- 1:1 高精度车辆模型
- PBR 材质，还原车漆、皮革、金属
- LOD 多级模型优化

### Unity 场景开发
- **渲染管线**：URP（通用渲染管线）
- **交互逻辑**：C# 脚本控制门/灯/轮毂切换
- **虚拟相机**：预设 6 个视角，自由拖拽旋转
- **实时配置器**：颜色 / 轮毂 / 内饰在线切换

### WebGL 发布
- 压缩资源至 80MB 以内
- 渐进式加载，首帧 < 5 秒
- 兼容移动端触控手势

### AI 辅助（ChatGPT）
- 使用 ChatGPT 生成多语言文案和语音导览脚本

## 项目成果

- 上线 3 个月 PV：**45 万+**
- 平均停留时长：**6 分 20 秒**
- 配置器交互率：**72%**
`,
  },
  {
    id: 'project-5',
    title: 'AI 创意海报系列',
    description: '联合即梦 AI 与 Photoshop，为电商大促产出 50+ 套创意海报，效率提升 300%，视觉点击率提升 45%。',
    tags: ['即梦', 'Photoshop', 'ChatGPT'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    markdownContent: `## 项目背景

电商双11大促需要**快速产出大量高质量海报**，传统流程无法满足 3 周内交付 50+ 套的需求。

## AI 赋能流程

### 第一步：文案策略（ChatGPT）
- 输入产品卖点，生成 100+ 条广告文案
- 按人群标签分类，匹配不同视觉风格

### 第二步：视觉生成（即梦 AI）
- 用文案生成的提示词批量产出视觉素材
- 风格矩阵：赛博朋克 / 极简商务 / 国潮手绘 / 3D 写实

### 第三步：精修合成（Photoshop）
- 精选 AI 素材进行去瑕疵处理
- 合成产品图 + 促销信息
- 统一色调和构图框架

## 效率对比

| 环节 | 传统方式 | AI 方式 | 提升 |
|------|---------|---------|------|
| 创意构思 | 2 小时/套 | 15 分钟/套 | 87% |
| 素材制作 | 4 小时/套 | 30 分钟/套 | 87% |
| 精修排版 | 2 小时/套 | 1 小时/套 | 50% |

> 最终 3 周交付 53 套创意海报，大促期间**点击率提升 45%**。
`,
  },
  {
    id: 'project-6',
    title: '动态视觉短片《流动》',
    description: '纯 After Effects 制作的 90 秒抽象动态短片，探索几何图形与音乐的视觉共鸣，参展独立动画节。',
    tags: ['After Effects', 'Photoshop'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    markdownContent: `## 创作理念

《流动》是一次**声音可视化**实验，用抽象几何形态表现电子音乐的情绪流动。

## 技术实现

### 图形设计（PS）
- 设计 30+ 抽象几何元素
- 建立统一的色彩系统：冷蓝 → 暖橙渐变

### 动画编排（AE）
- **表达式驱动**：粒子位置、缩放、旋转均用表达式控制
- **音频反应**：通过 Audio Spectrum 驱动图形动效
- **关键帧动画**：整体叙事弧线 90 秒

### 节奏设计
| 时间段 | 音乐情绪 | 视觉表现 |
|--------|---------|---------|
| 0-20s | 静谧引入 | 单点扩散 |
| 20-50s | 节奏强化 | 多元素交叠 |
| 50-70s | 高潮爆发 | 全屏粒子 |
| 70-90s | 余韵渐消 | 收缩回归 |

## 参展经历

- **2024 独立动画节**（入围展映）
- **Bilibili 动态设计专场**（播放 8.6 万）
- **Behance 编辑精选推荐**
`,
  },
  {
    id: 'project-7',
    title: '电商主图视频包装',
    description: '为天猫旗舰店打造产品主图短视频系列，涵盖 20+ 款产品。融合 PS 修图、AE 动效和 PR 剪辑全流程。',
    tags: ['Photoshop', 'After Effects', 'Premiere Pro'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    markdownContent: `## 项目需求

某**美妆品牌**天猫旗舰店需要为全线 20+ 产品制作主图短视频，每款 15 秒，用于商品详情页和推荐流。

## 生产管线

### 1. PS 精修静帧
- 统一白底产品图
- 去瑕疵、校色、光影重塑
- 输出带透明通道 PNG

### 2. AE 动画包装
- **文字动效模板**：产品名 + 卖点逐字弹出
- **光效追踪**：扫描光斑突出产品质感
- **粒子点缀**：按品牌色生成背景粒子

### 3. PR 成片输出
- 套用统一时间轴模板
- 批量替换素材，效率翻倍
- 多规格导出（1:1 / 3:4 / 16:9）

## 数据表现

| 指标 | 静态主图 | 视频主图 | 提升 |
|------|---------|---------|------|
| 点击率 | 2.1% | 4.8% | +128% |
| 停留时长 | 6s | 19s | +216% |
| 加购率 | 3.4% | 6.2% | +82% |
`,
  },
  {
    id: 'project-8',
    title: '虚拟发布会舞台设计',
    description: '使用 C4D + Unity 打造沉浸式虚拟发布会舞台，支持实时渲染和摄像机自由运镜。',
    tags: ['Cinema 4D', 'Unity', 'After Effects'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80',
    markdownContent: `## 项目背景

某手机品牌春季发布会，受场地限制，需要打造**虚拟舞台**替代传统搭建，实现"不可能"的视觉效果。

## 制作流程

### 舞台设计（C4D）
- 赛博朋克风格空间设计
- 巨型环形主屏 + 悬浮地面光效
- 元宇宙风材质：霓虹 / 透明 / 全息

### 实时渲染（Unity）
- URP 管线，60fps 流畅输出
- 摄像机动画：预设 8 条运镜轨道
- 实时切换场景状态

### 后期（AE）
- 叠加实时投票数据
- 虚拟弹幕墙
- 转场过渡特效

## 技术规格

- **分辨率**：4K@60fps
- **渲染延迟**：< 2 帧
- **道具交互点数**：12 个
- **在线观看峰值**：380 万人

## 行业影响

该方案后被 3 家品牌复用，成为虚拟发布会领域的**标杆案例**。
`,
  },
  {
    id: 'project-9',
    title: 'ChatGPT 设计工作流自动化',
    description: '构建基于 ChatGPT API 的创意设计辅助系统，实现从需求分析到方案输出的半自动设计管道。',
    tags: ['ChatGPT', '即梦', 'Photoshop'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    markdownContent: `## 项目初衷

设计工作中大量时间花在**重复性沟通和素材搜索**上，我希望用 AI 将这些环节自动化。

## 系统架构

\`\`\`
客户需求 → ChatGPT 分析 → 生成设计简报
   → ChatGPT 生成 Prompt → 即梦 AI 出图
   → 人工筛选 → PS 精修 → 输出交付
\`\`\`

## 核心功能

### 1. 智能需求分析
- 客户自然语言描述 → 结构化设计简报
- 自动提取：风格偏好、色彩方向、参考案例

### 2. Prompt 工厂
- 根据设计简报自动生成即梦/Stable Diffusion 提示词
- 支持风格参数、画幅比、光影方向等精细控制

### 3. 自动化方案组合
- 单次输出 5-10 个差异化方案
- AI 初步评分排序

## 效率提升

| 环节 | 人工耗时 | AI 辅助 | 提效 |
|------|---------|---------|------|
| 需求整理 | 1h | 5min | 92% |
| 素材搜索 | 2h | 10min | 91% |
| 初稿产出 | 4h | 30min | 87% |

> "这不是替代设计师，而是让设计师回归创意本身。" —— 我的设计哲学
`,
  },
  {
    id: 'project-10',
    title: 'UI 动效设计集《微观宇宙》',
    description: '用即梦 AI 生成概念图 + After Effects 实现 20 组原创 UI 微交互动效，应用于多款 App 产品。',
    tags: ['即梦', 'After Effects', 'Photoshop'],
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
    markdownContent: `## 设计理念

好的动效应该像**微观宇宙**——小而精致，每个细节都有存在的意义。

## 创作流程

### 概念生成（即梦）
- 输入动效关键词 → AI 生成概念帧
- 筛选最具表现力的画面作为动效起点

### 动效实现（AE）
- **弹性缓动曲线**：自定义贝塞尔曲线，模拟物理质感
- **图层蒙版**：复杂形态变化的过渡
- **3D 图层**：Z 轴空间感

### 应用场景

| 动效类型 | 数量 | 应用 |
|---------|------|------|
| 按钮反馈 | 5 组 | 点击/长按/悬停 |
| 页面转场 | 5 组 | 淡入/翻转/缩放 |
| 加载状态 | 3 组 | 骨骼屏/进度条 |
| 数据可视化 | 4 组 | 图表动效 |
| 微交互 | 3 组 | 点赞/收藏/消息 |

## 设计规范输出

- 全套 JSON 参数文件（可直接对接 Lottie）
- 动效时长/参数标定文档
- 色彩 / 透明度 / 位移的量化标准

## 落地产品

已应用于 5 款 App，覆盖**200 万+** 日活用户。
`,
  },
];

// ========== 12 个视频作品数据 ==========
// 缩略图留空会显示占位符，用户后续可替换为实际截图
export const videoWorks: VideoWork[] = [
  {
    id: 'video-1',
    title: '开心消消乐 — 品牌创意视频',
    company: '乐元素科技(北京)股份有限公司',
    role: '高级广告创意设计师',
    period: '2022-05 — 至今',
    thumbnail: '',
    videoUrl: '/video-01.mp4',
    description: '负责开心消消乐、开心水族箱、假日乐消消等多款游戏创意方向，对接外包视频制作及投放数据分析。',
    views: '日活 3000 万+',
    cpi: 'CPI 降低 35%',
    ctr: 'CTR 提升 22%',
    roi: '素材投产比 1:3.2',
    highlight: '「假日乐消消」去年国内上线成功，今年开始盈利。其中「假日乐消消」去年国内上线成功，今年开始盈利。',
  },
  {
    id: 'video-2',
    title: 'Tile Fun — 海外三消买量视频',
    company: '小米海外游戏',
    role: '海外广告视频设计师',
    period: '2020-03 — 2022-04',
    thumbnail: '',
    description: '负责 Tile Fun / Match Fun3D 等多款海外三消游戏视频制作，对接外包视频制作及实习生培训。',
    views: '下载量 2000 万+',
    cpi: 'CPI $0.8',
    ctr: 'CTR 4.5%',
    roi: 'ROI 1:4.8',
    highlight: 'Tile Fun 曾进入日本排行榜第九、欧洲排行第五。Match Fun3D 下载量突破 500 万。',
  },
  {
    id: 'video-3',
    title: 'Coloring Fun — 涂色品类投放视频',
    company: '乐城堡科技有限公司',
    role: '海外游戏视频设计师',
    period: '2019-05 — 2020-01',
    thumbnail: '',
    description: '负责多款海外游戏（Puzzle、涂色、World 品类）投放视频广告制作。',
    views: '下载量 1000 万+',
    cpi: 'CPI $1.2',
    ctr: 'CTR 3.2%',
    roi: 'ROI 1:3.0',
    highlight: 'Coloring Fun 达到 1000 万下载量，成为涂色品类头部产品。',
  },
  {
    id: 'video-4',
    title: '火影忍者 — 游戏赛事包装视频',
    company: '月蚀文化发展',
    role: '后期制作',
    period: '2017-08 — 2019-04',
    thumbnail: '',
    description: '负责游戏栏目包装、赛事包装（火影、英雄联盟、逆战）及版本更新视频。',
    views: '累计播放 500 万+',
    cpi: '-',
    ctr: '完播率 68%',
    roi: '单条成本降低 40%',
    highlight: '独立完成火影/英雄联盟/逆战三大 IP 的栏目与赛事后期制作全流程。',
  },
  {
    id: 'video-5',
    title: '宝贝乐消消 — 新品首发视频',
    company: '乐元素科技(北京)股份有限公司',
    role: '高级广告创意设计师',
    period: '2023',
    thumbnail: '',
    description: 'BabyTopia 新品首发系列创意视频，涵盖从概念到成片的全流程制作。',
    views: '首周下载 80 万+',
    cpi: 'CPI ¥1.5',
    ctr: 'CTR 5.8%',
    roi: 'ROI 1:5.6',
    highlight: 'AIGC 辅助创意发散，从构思到成片效率提升 200%。',
  },
  {
    id: 'video-6',
    title: '开心水族箱 — 版本更新宣传视频',
    company: '乐元素科技(北京)股份有限公司',
    role: '高级广告创意设计师',
    period: '2023',
    thumbnail: '',
    description: '开心水族箱大版本更新宣传视频，结合节日节点做主题化创意。',
    views: '回流率提升 25%',
    cpi: 'CPI 降低 28%',
    ctr: 'CTR 提升 18%',
    roi: 'DAU 环比 +15%',
    highlight: '春节版本更新视频带动 DAU 创新高。',
  },
  {
    id: 'video-7',
    title: 'Match Fun3D — 日本市场本地化视频',
    company: '小米海外游戏',
    role: '海外广告视频设计师',
    period: '2021',
    thumbnail: '',
    description: '针对日本市场做 Match Fun3D 本地化创意视频，融入二次元风格。',
    views: '日本下载 300 万+',
    cpi: 'CPI ¥120',
    ctr: 'CTR 6.2%',
    roi: '日本榜 Top9',
    highlight: '深度研究日本玩家偏好，采用二次元画风 + 萌系配音，进入日本排行榜第九。',
  },
  {
    id: 'video-8',
    title: 'Puzzle World — 全球多语言版本视频',
    company: '乐城堡科技有限公司',
    role: '海外游戏视频设计师',
    period: '2019',
    thumbnail: '',
    description: 'Puzzle World 全球 12 语言版本的视频物料批量制作与适配。',
    views: '全球 800 万+',
    cpi: 'CPI $0.9',
    ctr: 'CTR 3.8%',
    roi: 'ROI 1:3.5',
    highlight: '建立标准化视频生产管线，单人月产出从 15 条提升到 45 条。',
  },
  {
    id: 'video-9',
    title: '英雄联盟 S10 赛事宣传片',
    company: '月蚀文化发展',
    role: '后期制作',
    period: '2019',
    thumbnail: '',
    description: '英雄联盟 S10 赛季预热宣传片，含特效合成与调色。',
    views: 'B站播放 120 万+',
    cpi: '-',
    ctr: '互动率 8.5%',
    roi: '弹幕 3.2 万条',
    highlight: 'Bilibili 平台播放量破百万，弹幕互动热烈。',
  },
  {
    id: 'video-10',
    title: '逆战版本更新 — 科幻战争风',
    company: '月蚀文化发展',
    role: '后期制作',
    period: '2018',
    thumbnail: '',
    description: '逆战大型版本更新视频，科幻战争风格的特效包装与音效设计。',
    views: '官方渠道 50 万+',
    cpi: '-',
    ctr: '完播率 55%',
    roi: '预约转化 12%',
    highlight: '采用 C4D + AE 全流程制作，从建模到合成一人完成。',
  },
  {
    id: 'video-11',
    title: '假日乐消消 — 节庆主题系列视频',
    company: '乐元素科技(北京)股份有限公司',
    role: '高级广告创意设计师',
    period: '2023-2024',
    thumbnail: '',
    description: '假日乐消消春节/中秋/国庆等节庆主题系列创意视频。',
    views: '节庆期间 DAU +40%',
    cpi: 'CPI 降低 42%',
    ctr: 'CTR 提升 35%',
    roi: '营收环比 +60%',
    highlight: '每个节庆产出 3-5 条差异化素材，A/B 测试筛选最优方案。',
  },
  {
    id: 'video-12',
    title: 'AI 视频工作流 — AIGC 效率革命',
    company: '个人作品集',
    role: '全流程制作人',
    period: '2024',
    thumbnail: '',
    description: '使用 ChatGPT / 即梦 / 可灵等 AI 工具实现视频创作全流程自动化。',
    views: '效率提升 300%',
    cpi: '成本降低 70%',
    ctr: '出稿速度 x4',
    roi: '单人产值翻倍',
    highlight: '构建 AI 辅助视频工作流：ChatGPT 写脚本 → 即梦 出分镜 → AE 合成 → PR 成片。',
  },
];

