import type { DailyEntry, UserState } from "../types";
import { RITUALS } from "../types";

const STORAGE_KEY = "wave-user-state";
const DEVICE_ID_KEY = "wave-device-id";

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function createEmptyDailyEntry(date: string): DailyEntry {
  const rituals: Record<string, boolean> = {};
  for (const ritual of RITUALS) {
    rituals[ritual.id] = false;
  }
  return {
    date,
    rituals,
    reflection: null,
    mood: null,
    isComplete: false,
    isPartial: false,
  };
}

export function createDefaultUserState(): UserState {
  return {
    deviceId: getDeviceId(),
    challengeStartDate: null,
    onboardingCompleted: false,
    dailyEntries: {},
  };
}

export function loadUserStateFromLocal(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultUserState();
    const parsed = JSON.parse(raw) as UserState;
    return {
      ...createDefaultUserState(),
      ...parsed,
      deviceId: getDeviceId(),
    };
  } catch {
    return createDefaultUserState();
  }
}

export function saveUserStateToLocal(state: UserState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDayNumber(
  challengeStartDate: string | null,
  currentDate: string,
): number | null {
  if (!challengeStartDate) return null;
  const start = new Date(challengeStartDate + "T00:00:00");
  const current = new Date(currentDate + "T00:00:00");
  const diff = Math.floor(
    (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff + 1;
}

export function countCompletedRituals(entry: DailyEntry): number {
  return Object.values(entry.rituals).filter(Boolean).length;
}

export function allRitualsComplete(entry: DailyEntry): boolean {
  return countCompletedRituals(entry) === RITUALS.length;
}
