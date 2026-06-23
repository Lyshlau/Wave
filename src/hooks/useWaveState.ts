export { useWaveState } from "../context/WaveStateContext";
export { useLocalWaveState } from "./useLocalWaveState";
export { useConvexWaveState } from "./useConvexWaveState";
export { createDefaultUserState } from "../lib/storage";

import { createDefaultUserState } from "../lib/storage";

export function useDefaultUserState() {
  return createDefaultUserState();
}
