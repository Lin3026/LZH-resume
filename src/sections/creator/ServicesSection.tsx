import { FadeIn } from './components';

interface Service {
  no: string;
  name: string;
  desc: string;
}

const SERVICES: Service[] = [
  {
    no: '01',
    name: '3D 建模',
    desc: '根据客户具体需求，创作精细的物件、角色或场景模型，适用于游戏、产品与可视化展示。',
  },
  {
    no: '02',
    name: '渲染',
    desc: '以照片级的高品质渲染呈现设计，通过定制光照、纹理与材质，将概念真实还原。',
  },
  {
    no: '03',
    name: '动效设计',
    desc: '富有张力与故事感的动态动画与动效图形，为品牌、产品与数字体验注入活力。',
  },
  {
    no: '04',
    name: '品牌设计',
    desc: '打造协调统一的视觉识别系统——从标志到完整品牌体系，传递清晰而令人难忘的形象。',
  },
  {
    no: '05',
    name: '网页设计',
    desc: '设计简洁、现代且以转化为导向的网站，注重版式、字体排印与用户体验。',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-white px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]"
      style={{ color: '#0C0C0C' }}
    >
      <h2
        className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)', color: '#0C0C0C' }}
      >
        工作经历
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col">
        {SERVICES.map((s, i) => (
          <FadeIn
            key={s.no}
            delay={i * 0.1}
            y={30}
            className={`flex items-start gap-6 sm:gap-10 py-8 sm:py-10 md:py-12${
              i < SERVICES.length - 1 ? ' border-b' : ''
            }`}
            style={
              i < SERVICES.length - 1
                ? { borderColor: 'rgba(12, 12, 12, 0.15)' }
                : undefined
            }
          >
            <div
              className="font-black leading-none shrink-0"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)', color: '#0C0C0C' }}
            >
              {s.no}
            </div>
            <div className="flex flex-col pt-2 sm:pt-4">
              <h3
                className="font-medium uppercase mb-3"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)', color: '#0C0C0C' }}
              >
                {s.name}
              </h3>
              <p
                className="font-light leading-relaxed max-w-2xl"
                style={{
                  fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                  opacity: 0.6,
                  color: '#0C0C0C',
                }}
              >
                {s.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
