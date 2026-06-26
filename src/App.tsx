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
    <div className="min-h-screen bg-slate-900 text-white">
      <ScrollParticles />
      <MouseTrailParticles />
      <MouseClickRipple />
      <Navbar />
      <main className="relative z-20">
        <HeroSection />
        <WorkTimeline />
        <EducationSection />
        <SkillsSection />
        <WorkContentSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}
