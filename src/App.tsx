import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "@/contexts/MusicContext";
import PWAInstallDialog from "@/components/PWAInstallDialog";
import OfflineIndicator from "@/components/OfflineIndicator";
import MeditationPage from "@/pages/MeditationPage";
import BreathingPage from "@/pages/BreathingPage";

const HomePage = lazy(() => import("@/pages/HomePage"));
const MoodTrackerPage = lazy(() => import("@/pages/MoodTrackerPage"));
const JournalPage = lazy(() => import("@/pages/JournalPage"));
const MindMatePage = lazy(() => import("@/pages/MindMatePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const AchievementsPage = lazy(() => import("@/pages/AchievementsPage"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicProvider>
        <TooltipProvider>
          <Toaster />
          <OfflineIndicator />
          <PWAInstallDialog />
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
              <Routes>
                <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense>} />
                <Route path="/mood" element={<Suspense fallback={<div>Loading...</div>}><MoodTrackerPage /></Suspense>} />
                <Route path="/journal" element={<Suspense fallback={<div>Loading...</div>}><JournalPage /></Suspense>} />
                <Route path="/meditation" element={<MeditationPage />} />
                <Route path="/breathing" element={<BreathingPage />} />
                <Route path="/mindmate" element={<Suspense fallback={<div>Loading...</div>}><MindMatePage /></Suspense>} />
                <Route path="/settings" element={<Suspense fallback={<div>Loading...</div>}><SettingsPage /></Suspense>} />
                <Route path="/achievements" element={<Suspense fallback={<div>Loading...</div>}><AchievementsPage /></Suspense>} />
                <Route path="*" element={<Suspense fallback={<div>Loading...</div>}><NotFoundPage /></Suspense>} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </MusicProvider>
    </QueryClientProvider>
  );
};

export default App;
