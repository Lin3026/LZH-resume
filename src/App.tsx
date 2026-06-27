import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import WorkTimeline from './sections/WorkTimeline';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import WorkContentSection from './sections/WorkContentSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';
import MouseTrailParticles from './hooks/MouseTrailParticles';
import MouseClickRipple from './hooks/MouseClickRipple';
import ScrollParticles from './hooks/ScrollParticles';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen text-white bg-transparent">
      <ScrollParticles />
      <MouseTrailParticles />
      <MouseClickRipple />
      <Navbar />
      {/* 顶部留白 1200px，露出背景图起始部分 */}
      <div style={{ height: '1200px' }} aria-hidden="true" />
      <main className="relative z-20">
        <HeroSection />
        <WorkTimeline />
        <WorkContentSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}
