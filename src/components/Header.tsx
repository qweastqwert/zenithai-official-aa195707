
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PWAInstallButton from '@/components/PWAInstallButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 shadow-sm safe-area-inset-top">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between min-h-[64px]">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zenith-purple to-zenith-darkpurple flex items-center justify-center">
            <img 
              src="/lovable-uploads/289cf3ca-64e3-425c-8e29-1e27aae89509.png"
              alt="Zenith AI"
              className="w-6 h-6"
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-zenith-darkpurple">Zenith AI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link to="/" className="text-foreground hover:text-zenith-purple transition text-sm lg:text-base">Home</Link>
          <Link to="/meditation" className="text-foreground hover:text-zenith-purple transition text-sm lg:text-base">Meditation</Link>
          <Link to="/mood-tracking" className="text-foreground hover:text-zenith-purple transition text-sm lg:text-base">Mood Tracking</Link>
          <Link to="/breathing-exercises" className="text-foreground hover:text-zenith-purple transition text-sm lg:text-base">Breathing Exercises</Link>
          <Link to="/soothing-music" className="text-foreground hover:text-zenith-purple transition text-sm lg:text-base">Soothing Music</Link>
          <Link to="/resources" className="text-foreground hover:text-zenith-purple transition text-sm lg:text-base">Resources</Link>
        </nav>
        
        {/* PWA Install Button & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <PWAInstallButton />
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg animate-fade-in border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-1 p-4 pb-6">
            <Link 
              to="/" 
              className="py-3 px-4 hover:bg-zenith-softpurple rounded-md transition text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/meditation" 
              className="py-3 px-4 hover:bg-zenith-softpurple rounded-md transition text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Meditation
            </Link>
            <Link 
              to="/mood-tracking" 
              className="py-3 px-4 hover:bg-zenith-softpurple rounded-md transition text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Mood Tracking
            </Link>
            <Link 
              to="/breathing-exercises" 
              className="py-3 px-4 hover:bg-zenith-softpurple rounded-md transition text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Breathing Exercises
            </Link>
            <Link 
              to="/soothing-music" 
              className="py-3 px-4 hover:bg-zenith-softpurple rounded-md transition text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Soothing Music
            </Link>
            <Link 
              to="/resources" 
              className="py-3 px-4 hover:bg-zenith-softpurple rounded-md transition text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
