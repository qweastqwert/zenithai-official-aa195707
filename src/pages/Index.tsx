
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Clock, BookOpen, Star, Users, Shield, Sparkles, Crown, Gem, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { resources } from '@/data/resources';
import ResourceCard from '@/components/ResourceCard';

const Index = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Reveal elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [showFeatures]);

  const parallaxOffset = scrollY * 0.5;

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-white dark:bg-gray-900">
        {/* Left Ad Space - Hidden on mobile, visible on tablet/desktop */}
        <aside className="hidden lg:block w-40 xl:w-48 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="sticky top-24 p-4">
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              Ad Space
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {/* Hero Section with Parallax - Mobile Optimized */}
          <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-3 sm:px-4 min-h-screen flex items-center justify-center">
            {/* Animated background elements - Reduced for mobile */}
            <div 
              className="absolute inset-0 opacity-15 sm:opacity-30"
              style={{ transform: `translateY(${parallaxOffset}px)` }}
            >
              <div className="absolute top-1/4 left-1/4 w-40 sm:w-72 h-40 sm:h-72 bg-gradient-to-r from-yellow-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-56 sm:w-96 h-56 sm:h-96 bg-gradient-to-r from-purple-600/20 to-indigo-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto text-center relative z-10">
              <div className="max-w-4xl mx-auto">
                {/* Zenith AI logo - Mobile optimized */}
                <div className="mb-8 sm:mb-10 royal-fade-in">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center shadow-xl sm:shadow-2xl premium-glow">
                    <img 
                      src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png"
                      alt="Zenith AI Logo"
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  </div>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 sm:mb-10 royal-gradient-text royal-fade-in px-3" style={{ animationDelay: '0.2s' }}>
                  Your Majestic Path to
                  <br />
                  <span className="font-playfair italic">Mental Wellness</span>
                </h1>
                
                <p className="text-xl sm:text-2xl mb-10 sm:mb-12 text-gray-700 dark:text-gray-300 royal-fade-in font-light leading-relaxed px-4" style={{ animationDelay: '0.4s' }}>
                  Experience the pinnacle of AI-powered mental wellness with meditation, mood tracking, 
                  and personalized resources crafted for your journey to inner peace and emotional mastery.
                </p>
                
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-10 sm:mb-12 royal-fade-in px-4" style={{ animationDelay: '0.6s' }}>
                  <Button 
                    asChild 
                    className="zenith-button-primary text-lg sm:text-xl font-semibold px-10 sm:px-12 py-5 sm:py-6 shadow-xl sm:shadow-2xl w-full sm:w-auto min-h-[56px]"
                    onClick={() => setShowFeatures(true)}
                  >
                    <Link to="/chat">
                      <Crown className="mr-3 h-6 w-6" />
                      Begin Your Elite Journey
                    </Link>
                  </Button>
                  {showFeatures && (
                    <>
                      <Button 
                        asChild 
                        className="zenith-button-secondary text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 animate-slide-in-left w-full sm:w-auto min-h-[48px]"
                        style={{ animationDelay: '0.2s' }}
                      >
                        <Link to="/resources">
                          <BookOpen className="mr-2 h-5 w-5" />
                          Premium Library
                        </Link>
                      </Button>
                      <Button 
                        asChild 
                        className="zenith-button-secondary text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 animate-slide-in-right w-full sm:w-auto min-h-[48px]"
                        style={{ animationDelay: '0.4s' }}
                      >
                        <Link to="/meditation">
                          <Gem className="mr-2 h-5 w-5" />
                          Sacred Meditation
                        </Link>
                      </Button>
                    </>
                  )}
                </div>

                {/* Elite Trust Indicators - Mobile optimized */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm sm:text-lg text-gray-600 dark:text-gray-400 royal-fade-in px-3" style={{ animationDelay: '0.8s' }}>
                  <div className="flex flex-col sm:flex-row items-center gap-3 luxury-hover">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <span className="font-medium text-sm sm:text-base text-center sm:text-left">Supreme Privacy</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 luxury-hover">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <span className="font-medium text-sm sm:text-base text-center sm:text-left">AI Excellence</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 luxury-hover">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <span className="font-medium text-sm sm:text-base text-center sm:text-left">Personalized</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 luxury-hover">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <span className="font-medium text-sm sm:text-base text-center sm:text-left">Zenith Method</span>
                  </div>
                </div>

                {/* Premium Stats - Mobile optimized */}
                {showFeatures && (
                  <div className="mt-16 sm:mt-20 p-6 sm:p-8 luxury-glass rounded-2xl reveal-on-scroll mx-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                      <div className="luxury-hover">
                        <div className="text-4xl sm:text-5xl font-bold royal-gradient-text mb-3 sm:mb-4">10,000+</div>
                        <div className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium">Elite Souls Transformed</div>
                      </div>
                      <div className="luxury-hover">
                        <div className="text-4xl sm:text-5xl font-bold royal-gradient-text mb-3 sm:mb-4">500+</div>
                        <div className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium">Sacred Sessions</div>
                      </div>
                      <div className="luxury-hover">
                        <div className="text-4xl sm:text-5xl font-bold royal-gradient-text mb-3 sm:mb-4">50+</div>
                        <div className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium">Wisdom Chronicles</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Premium Hero Image with Parallax - Mobile optimized */}
              <div className="mt-16 sm:mt-20 relative reveal-on-scroll px-3">
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"
                  style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
                ></div>
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Majestic meditation in serene mountain landscape at golden hour"
                  className="w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl luxury-glass"
                  style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center animate-pulse premium-glow shadow-xl sm:shadow-2xl">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <img 
                        src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png"
                        alt="Zenith AI"
                        className="w-12 h-12 sm:w-16 sm:h-16"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section - Mobile optimized */}
          {showFeatures && (
            <>
              <section className="py-20 sm:py-24 luxury-glass reveal-on-scroll">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 royal-gradient-text font-playfair px-3">
                      Exclusive Wellness Chambers
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed px-4">
                      Discover exquisite tools meticulously crafted to elevate your mental wellness journey 
                      with the grace of AI guidance and the wisdom of time-honored techniques.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 px-3">
                    <Card className="zenith-card luxury-hover reveal-on-scroll border-none bg-gradient-to-br from-white via-white to-purple-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/20">
                      <CardContent className="p-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 flex items-center justify-center mb-6 premium-glow">
                          <Brain className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 royal-gradient-text font-playfair">Sacred Meditation</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                          Transcend stress and elevate focus with our curated collection of guided meditation 
                          experiences, each designed to unlock your inner tranquility and mental clarity.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="zenith-card luxury-hover reveal-on-scroll border-none bg-gradient-to-br from-white via-white to-pink-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-pink-900/20" style={{ animationDelay: '0.2s' }}>
                      <CardContent className="p-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 flex items-center justify-center mb-6 premium-glow">
                          <Clock className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 royal-gradient-text font-playfair">Emotional Mastery</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                          Chart your emotional landscape and discover profound insights into the patterns 
                          that shape your daily experience and personal growth journey.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="zenith-card luxury-hover reveal-on-scroll border-none bg-gradient-to-br from-white via-white to-blue-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-blue-900/20" style={{ animationDelay: '0.4s' }}>
                      <CardContent className="p-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 flex items-center justify-center mb-6 premium-glow">
                          <BookOpen className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 royal-gradient-text font-playfair">Wisdom Treasury</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                          Access our meticulously curated treasury of articles, guides, and resources 
                          for mental wellbeing, sourced from the finest minds in wellness and psychology.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>
              
              {/* Resources Preview - Premium Edition */}
              <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/10 reveal-on-scroll">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 gap-6">
                    <div className="px-3">
                      <h2 className="text-3xl sm:text-4xl font-bold royal-gradient-text font-playfair mb-3">Exclusive Collection</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl">Handpicked treasures to illuminate your wellness journey</p>
                    </div>
                    <Link 
                      to="/resources" 
                      className="royal-gradient-text hover:text-yellow-600 dark:hover:text-yellow-400 font-semibold text-lg transition-all duration-500 flex items-center gap-2 luxury-hover px-3 sm:px-0"
                    >
                      Explore Treasury <Zap className="h-5 w-5" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-3">
                    {resources.slice(0, 3).map((resource, index) => (
                      <div key={resource.id} className="reveal-on-scroll" style={{ animationDelay: `${index * 0.2}s` }}>
                        <ResourceCard resource={resource} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Ad Space Below Main Content - Hidden on mobile */}
          <section className="hidden sm:block py-8 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4">
              <div className="w-full max-w-4xl mx-auto h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                Ad Space
              </div>
            </div>
          </section>
          
          {/* Premium CTA Section - Mobile optimized */}
          <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 py-16 sm:py-24 relative overflow-hidden">
            {/* Animated background elements - Reduced for mobile */}
            <div className="absolute inset-0 opacity-10 sm:opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400/10 via-transparent to-purple-600/10"></div>
              <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>
            
            <div className="container mx-auto px-4 text-center relative z-10 reveal-on-scroll">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8 sm:mb-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center mb-6 sm:mb-8 premium-glow">
                    <img 
                      src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png"
                      alt="Zenith AI Logo"
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  </div>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 text-white font-playfair px-3">
                  Ascend to Your Ultimate Wellness Throne
                </h2>
                <p className="text-lg sm:text-2xl mb-10 sm:mb-12 text-purple-100 leading-relaxed font-light px-4">
                  Embark upon the first step toward transcendent mental well-being with our 
                  elegantly crafted tools and majestic AI-powered guidance.
                </p>
                <Button 
                  asChild 
                  className="zenith-button-primary text-lg sm:text-xl font-semibold px-12 sm:px-16 py-5 sm:py-8 shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 w-full sm:w-auto min-h-[60px]"
                >
                  <Link to="/chat">
                    <Crown className="mr-3 h-6 w-6" />
                    Claim Your Premium Wellness Crown
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Right Ad Space - Hidden on mobile, visible on tablet/desktop */}
        <aside className="hidden lg:block w-40 xl:w-48 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <div className="sticky top-24 p-4">
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              Ad Space
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
};

export default Index;
