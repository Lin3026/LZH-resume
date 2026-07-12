import { useRef } from 'react';
import HeroSection from './HeroSection';
import MediaDomeSection from './MediaDomeSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import ProjectsSection from './ProjectsSection';
import WorksShowcaseSection from './WorksShowcaseSection';
import EducationSection from './EducationSection';
import ContactSection from './ContactSection';
import './creator.css';

interface CreatorPortfolioProps {
  onBack?: () => void;
}

export default function CreatorPortfolio({ onBack }: CreatorPortfolioProps) {
  // 共享 ref：用于「关于我」区块与下方时间轴的滚动联动
  const aboutRef = useRef<HTMLElement>(null);

  return (
    <div className="creator-page">
      {/* 返回个人空间 */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="fixed top-4 left-4 z-[70] flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#1a1a1a]/80 hover:text-[#1a1a1a] transition-colors"
          style={{
            background: 'rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            WebkitAppearance: 'none',
            appearance: 'none',
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回个人空间
        </button>
      )}

      <HeroSection />
      <MediaDomeSection />
      <AboutSection sectionRef={aboutRef} />
      <ServicesSection triggerRef={aboutRef} />
      <ProjectsSection />
      <WorksShowcaseSection />
      <EducationSection />
      <ContactSection />
    </div>
  );
}
