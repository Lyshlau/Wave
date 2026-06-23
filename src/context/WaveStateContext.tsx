import { createContext, useContext, type ReactNode } from "react";
import { useLocalWaveState } from "../hooks/useLocalWaveState";

export type WaveStateValue = ReturnType<typeof useLocalWaveState>;

const WaveStateContext = createContext<WaveStateValue | null>(null);

export function WaveStateProvider({
  value,
  children,
}: {
  value: WaveStateValue;
  children: ReactNode;
}) {
  return (
    <WaveStateContext.Provider value={value}>{children}</WaveStateContext.Provider>
  );
}

export function useWaveState(): WaveStateValue {
  const context = useContext(WaveStateContext);
  if (!context) {
    throw new Error("useWaveState must be used within WaveStateProvider");
  }
  return context;
}
