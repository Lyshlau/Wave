import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Onboarding } from "./components/Onboarding";
import { TodayPage } from "./pages/TodayPage";
import { ProgressPage } from "./pages/ProgressPage";
import { JourneyPage } from "./pages/JourneyPage";
import { useWaveState } from "./hooks/useWaveState";

export default function App() {
  const { state, isLoading, completeOnboarding } = useWaveState();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-olive-deep mb-2">Wave</p>
          <p className="text-olive text-sm">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!state.onboardingCompleted) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<TodayPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="journey" element={<JourneyPage />} />
      </Route>
    </Routes>
  );
}
