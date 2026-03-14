import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import PhilosophySection from '@/components/home/PhilosophySection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StatsSection from '@/components/home/StatsSection';
import ResourcesPreview from '@/components/home/ResourcesPreview';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [showFeatures]);

  const parallaxOffset = scrollY * 0.5;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground overflow-hidden">
        <HeroSection
          showFeatures={showFeatures}
          setShowFeatures={setShowFeatures}
          parallaxOffset={parallaxOffset}
        />

        {showFeatures && (
          <>
            <StatsSection />
            <PhilosophySection />
            <FeaturesSection />
            <ResourcesPreview />
          </>
        )}

        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
