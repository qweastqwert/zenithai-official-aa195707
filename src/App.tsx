
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useUICustomization } from "@/hooks/useUICustomization";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useProfileSync } from "@/hooks/useProfileSync";
import { useAchievements } from "@/hooks/useAchievements";
import { useEffect, useState } from "react";
import { NotificationService } from "@/services/notificationService";
import { MusicProvider } from "@/contexts/MusicContext";
import MusicMinibar from "@/components/MusicMinibar";
import AchievementNotification from "@/components/achievements/AchievementNotification";
import PWAInstallDialog from "@/components/PWAInstallDialog";
import Index from "./pages/Index";
import MeditationPage from "./pages/Meditation";
import MoodTrackingPage from "./pages/MoodTracking";
import ResourcesPage from "./pages/Resources";
import ArticleView from "./pages/ArticleView";
import BreathingExercisesPage from "./pages/BreathingExercises";
import SoothingMusicPage from "./pages/SoothingMusic";
import SleepTrackingPage from "./pages/SleepTracking";
import CommunityPage from "./pages/Community";
import AdminPage from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ChatInterface from "./components/ChatInterface";
import MoodTracker from "./components/MoodTracker";
import Journal from "./components/Journal";
import IntroAnimation from "./components/IntroAnimation";
import AuthForm from "./components/auth/AuthForm";
import OnboardingForm from "./components/OnboardingForm";

const queryClient = new QueryClient();

const AppContent = () => {
  // Initialize theme and UI customization
  useTheme();
  useUICustomization();
  useProfileSync(); // Ensure profile exists for OAuth users
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { hasProfile, loading: profileLoading } = useProfile();
  const { getNewlyUnlocked } = useAchievements();
  const [showIntro, setShowIntro] = useState(true);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  useEffect(() => {
    // Initialize notification service
    NotificationService.getInstance();

    // Listen for notification events
    const handleShowMoodTracker = () => setShowMoodTracker(true);
    const handleShowJournal = () => setShowJournal(true);

    window.addEventListener('show-mood-tracker', handleShowMoodTracker);
    window.addEventListener('show-journal', handleShowJournal);

    // Check if user has seen intro before OR if user is already authenticated
    const hasSeenIntro = localStorage.getItem('zenith-intro-seen');
    if (hasSeenIntro || isAuthenticated) {
      setShowIntro(false);
    }

    return () => {
      window.removeEventListener('show-mood-tracker', handleShowMoodTracker);
      window.removeEventListener('show-journal', handleShowJournal);
    };
  }, [isAuthenticated]);

  // Check for newly unlocked achievements
  useEffect(() => {
    if (isAuthenticated) {
      const checkForNewAchievements = () => {
        const newlyUnlocked = getNewlyUnlocked();
        const shownAchievements: string[] = JSON.parse(localStorage.getItem('zenith-shown-achievements') || '[]');
        
        // Find the most recent achievement that hasn't been shown
        const achievementToShow = newlyUnlocked.find(achievement => 
          !shownAchievements.includes(achievement.id)
        );
        
        if (achievementToShow) {
          setCurrentAchievement(achievementToShow);
          shownAchievements.push(achievementToShow.id);
          localStorage.setItem('zenith-shown-achievements', JSON.stringify(shownAchievements));
        }
      };

      // Check once on load, then stop polling aggressively
      const timeout = setTimeout(checkForNewAchievements, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [getNewlyUnlocked, isAuthenticated]);

  // Handle intro completion
  const handleIntroComplete = () => {
    localStorage.setItem('zenith-intro-seen', 'true');
    setShowIntro(false);
  };

  // Show intro animation first
  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  // Show auth form if not authenticated
  if (!authLoading && !isAuthenticated) {
    return <AuthForm onSuccess={() => {}} />;
  }

  // Show onboarding if authenticated but no profile
  if (!profileLoading && isAuthenticated && !hasProfile) {
    return <OnboardingForm onComplete={() => {}} />;
  }

  // Show loading while checking auth/profile
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zenith-softpurple via-white to-zenith-lightblue">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zenith-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <div className="pb-20">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/meditation" element={<MeditationPage />} />
            <Route path="/mood-tracking" element={<MoodTrackingPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/article/:id" element={<ArticleView />} />
            <Route path="/breathing-exercises" element={<BreathingExercisesPage />} />
            <Route path="/soothing-music" element={<SoothingMusicPage />} />
            <Route path="/sleep-tracking" element={<SleepTrackingPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>

      <MusicMinibar />
      <PWAInstallDialog />

      {/* Achievement Notification */}
      <AchievementNotification 
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />

      {/* Notification-triggered modals */}
      {showMoodTracker && (
        <MoodTracker 
          showPromptOnly={true}
          onPromptComplete={() => setShowMoodTracker(false)}
        />
      )}
      
      {showJournal && (
        <Journal onClose={() => setShowJournal(false)} />
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MusicProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </MusicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
