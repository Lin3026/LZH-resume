import { FadeIn } from './components';

interface ContactItem {
  label: string;
  value: string;
  href?: string;
  icon: 'mail' | 'phone' | 'location';
}

const CONTACTS: ContactItem[] = [
  { label: '邮箱', value: '302641078@qq.com', href: 'mailto:302641078@qq.com', icon: 'mail' },
  { label: '电话', value: '18279132481', href: 'tel:18279132481', icon: 'phone' },
  { label: '所在地', value: '北京', icon: 'location' },
];

function ContactIcon({ type }: { type: ContactItem['icon'] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (type === 'mail') {
    return (
      <svg {...common}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    );
  }
  if (type === 'phone') {
    return (
      <svg {...common}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ContactCard({ item, index }: { item: ContactItem; index: number }) {
  const inner = (
    <>
      <span className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-white">
        <ContactIcon type={item.icon} />
      </span>
      <span className="block text-xs sm:text-sm uppercase tracking-widest text-white/55 mb-1">
        {item.label}
      </span>
      <span
        className="block font-bold text-white break-all"
        style={{ fontSize: 'clamp(1.05rem, 2.4vw, 1.5rem)' }}
      >
        {item.value}
      </span>
    </>
  );

  return (
    <FadeIn delay={index * 0.1} y={30} className="h-full">
      {item.href ? (
        <a
          href={item.href}
          className="group flex flex-col h-full rounded-[28px] sm:rounded-[36px] border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
        >
          {inner}
        </a>
      ) : (
        <div className="flex flex-col h-full rounded-[28px] sm:rounded-[36px] border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
          {inner}
        </div>
      )}
    </FadeIn>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-10 bg-[#0a0a0a] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-4 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-28 pb-24"
    >
      <FadeIn delay={0} y={40} className="mb-14 sm:mb-20">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          联系方式
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {CONTACTS.map((item, i) => (
          <ContactCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
