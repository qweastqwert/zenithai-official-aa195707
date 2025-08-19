
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "@/contexts/MusicContext";
import PWAInstallDialog from "@/components/PWAInstallDialog";
import OfflineIndicator from "@/components/OfflineIndicator";

// Import pages that exist in the project
const Index = lazy(() => import("@/pages/Index"));
const MoodTracking = lazy(() => import("@/pages/MoodTracking"));
const Resources = lazy(() => import("@/pages/Resources"));
const Meditation = lazy(() => import("@/pages/Meditation"));
const BreathingExercises = lazy(() => import("@/pages/BreathingExercises"));
const SoothingMusic = lazy(() => import("@/pages/SoothingMusic"));
const NotFound = lazy(() => import("@/pages/NotFound"));

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
                <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><Index /></Suspense>} />
                <Route path="/mood" element={<Suspense fallback={<div>Loading...</div>}><MoodTracking /></Suspense>} />
                <Route path="/resources" element={<Suspense fallback={<div>Loading...</div>}><Resources /></Suspense>} />
                <Route path="/meditation" element={<Suspense fallback={<div>Loading...</div>}><Meditation /></Suspense>} />
                <Route path="/breathing" element={<Suspense fallback={<div>Loading...</div>}><BreathingExercises /></Suspense>} />
                <Route path="/music" element={<Suspense fallback={<div>Loading...</div>}><SoothingMusic /></Suspense>} />
                <Route path="*" element={<Suspense fallback={<div>Loading...</div>}><NotFound /></Suspense>} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </MusicProvider>
    </QueryClientProvider>
  );
};

export default App;
