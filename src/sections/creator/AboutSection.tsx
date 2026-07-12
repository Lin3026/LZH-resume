import ScrollFloat from './ScrollFloat';

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
      style={{ background: 'transparent' }}
    >
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
