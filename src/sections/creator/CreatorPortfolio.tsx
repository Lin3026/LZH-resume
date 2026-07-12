import { useRef } from 'react';
import HeroSection from './HeroSection';
import MediaDomeSection from './MediaDomeSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import ProjectsSection from './ProjectsSection';
import WorksShowcaseSection from './WorksShowcaseSection';
import EducationSection from './EducationSection';
import ContactSection from './ContactSection';
import CreatorSidebar from './CreatorSidebar';
import './creator.css';

interface CreatorPortfolioProps {}

export default function CreatorPortfolio() {
  // 共享 ref：用于「关于我」区块与下方时间轴的滚动联动
  const aboutRef = useRef<HTMLElement>(null);

  return (
      <div className="creator-page pt-10">
      <HeroSection />
      <MediaDomeSection />
      <AboutSection sectionRef={aboutRef} />
      <ServicesSection triggerRef={aboutRef} />
      <ProjectsSection />
      <WorksShowcaseSection />
      <EducationSection />
      <ContactSection />
      <CreatorSidebar />
    </div>
  );
}
