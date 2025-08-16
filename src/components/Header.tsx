
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zenith-purple to-zenith-darkpurple flex items-center justify-center">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
          <span className="text-2xl font-bold text-zenith-darkpurple">Zenith AI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground hover:text-zenith-purple transition">Home</Link>
          <Link to="/meditation" className="text-foreground hover:text-zenith-purple transition">Meditation</Link>
          <Link to="/mood-tracking" className="text-foreground hover:text-zenith-purple transition">Mood Tracking</Link>
          <Link to="/breathing-exercises" className="text-foreground hover:text-zenith-purple transition">Breathing Exercises</Link>
          <Link to="/soothing-music" className="text-foreground hover:text-zenith-purple transition">Soothing Music</Link>
          <Link to="/resources" className="text-foreground hover:text-zenith-purple transition">Resources</Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[76px] left-0 w-full bg-white shadow-md animate-fade-in">
          <div className="flex flex-col space-y-4 p-4">
            <Link 
              to="/" 
              className="py-2 px-4 hover:bg-zenith-softpurple rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/meditation" 
              className="py-2 px-4 hover:bg-zenith-softpurple rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Meditation
            </Link>
            <Link 
              to="/mood-tracking" 
              className="py-2 px-4 hover:bg-zenith-softpurple rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Mood Tracking
            </Link>
            <Link 
              to="/breathing-exercises" 
              className="py-2 px-4 hover:bg-zenith-softpurple rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Breathing Exercises
            </Link>
            <Link 
              to="/soothing-music" 
              className="py-2 px-4 hover:bg-zenith-softpurple rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Soothing Music
            </Link>
            <Link 
              to="/resources" 
              className="py-2 px-4 hover:bg-zenith-softpurple rounded-md transition"
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
