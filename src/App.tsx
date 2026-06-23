import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Onboarding } from "./components/Onboarding";
import { TodayPage } from "./pages/TodayPage";
import { ProgressPage } from "./pages/ProgressPage";
import { JourneyPage } from "./pages/JourneyPage";
import { useLocalWaveState } from "./hooks/useLocalWaveState";
import { useConvexWaveState } from "./hooks/useConvexWaveState";
import { isConvexAvailable } from "./lib/convex";
import { ConvexProvider } from "./providers/ConvexProvider";
import {
  WaveStateProvider,
  type WaveStateValue,
} from "./context/WaveStateContext";

function AppShell({
  state,
  isLoading,
  completeOnboarding,
}: Pick<WaveStateValue, "state" | "isLoading" | "completeOnboarding">) {
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

function WaveApp({ wave }: { wave: WaveStateValue }) {
  return (
    <WaveStateProvider value={wave}>
      <AppShell
        state={wave.state}
        isLoading={wave.isLoading}
        completeOnboarding={wave.completeOnboarding}
      />
    </WaveStateProvider>
  );
}

function LocalApp() {
  const wave = useLocalWaveState();
  return <WaveApp wave={wave} />;
}

function ConvexApp() {
  const wave = useConvexWaveState();
  return <WaveApp wave={wave} />;
}

export default function App() {
  if (isConvexAvailable) {
    return (
      <ConvexProvider>
        <ConvexApp />
      </ConvexProvider>
    );
  }

  return <LocalApp />;
}
