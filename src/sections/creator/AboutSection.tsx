import { FadeIn } from './components';
import ScrollFloat from './ScrollFloat';

const BASE = import.meta.env.BASE_URL;

// 四角装饰图标（用户提供的软件图标）
const ICON_AE = `${BASE}icon/ae.png`;
const ICON_PR = `${BASE}icon/pr.png`;
const ICON_PS = `${BASE}icon/ps.png`;
const ICON_JIMENG = `${BASE}icon/即梦.png`;

const ABOUT_PARAGRAPHS = [
  { text: '9年视频设计经验，其中7年多游戏创意经验，擅长挖掘产品卖点、分析广告数据、归纳总结优秀案例，并沉淀方法论，将它应用于工作中。', highlight: '9年' },
  { text: '7年游戏消除游戏广告制作和数据分析经验，掌握各地区人群属性、偏好及特点：了解各品类、各平台、各国家地区的素材特点和素材方向。', highlight: '7年' },
  { text: '2年使用 AI 工具（如 ChatGPT、Gemini、即梦、龙虾等）进行创意发散与落地，经验丰富且具备工作流经验。', highlight: '2年' },
];

export default function AboutSection({ sectionRef }: { sectionRef?: React.Ref<HTMLElement> }) {
  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-5 sm:px-8 md:px-10 py-20"
      style={{ background: '#ffffff' }}
    >
      {/* 四角装饰 3D 图形 */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1.5%] sm:left-[4.5%] md:left-[8.5%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none"
      >
        <img src={ICON_AE} alt="After Effects" className="w-full h-auto select-none" draggable={false} loading="lazy" />
      </FadeIn>
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[67px] sm:w-[93px] md:w-[120px] pointer-events-none"
      >
        <img src={ICON_PR} alt="Premiere Pro" className="w-full h-auto select-none" draggable={false} loading="lazy" />
      </FadeIn>
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[3.5%] sm:right-[6.5%] md:right-[10.5%] w-[72px] sm:w-[96px] md:w-[126px] pointer-events-none"
      >
        <img src={ICON_PS} alt="Photoshop" className="w-full h-auto select-none" draggable={false} loading="lazy" />
      </FadeIn>
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[87px] sm:w-[113px] md:w-[147px] pointer-events-none"
      >
        <img src={ICON_JIMENG} alt="即梦" className="w-full h-auto select-none" draggable={false} loading="lazy" />
      </FadeIn>

      {/* 标题 — ScrollFloat 逐字浮现 */}
      <div className="relative z-10 w-full flex justify-center -mt-[calc(3rem_+_2vh)] sm:-mt-[calc(4rem_+_2vh)] md:-mt-[calc(5rem_+_2vh)]">
        <ScrollFloat
          containerClassName="about-title"
          textClassName="about-title-text"
        >
          关于我
        </ScrollFloat>
      </div>

      {/* 逐字滚动浮现段落 — 三段文案分别呈现 */}
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 md:gap-9 mt-10 sm:mt-14 md:mt-16 w-full">
        {ABOUT_PARAGRAPHS.map((para, i) => (
          <ScrollFloat
            key={i}
            containerClassName="about-para"
            textClassName="about-para-text"
            highlight={para.highlight}
          >
            {para.text}
          </ScrollFloat>
        ))}
      </div>

    </section>
  );
}
