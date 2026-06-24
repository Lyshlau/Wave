import type { DailyEntry, UserState } from "../types";
import { CHALLENGE_DAYS, LEGACY_RITUAL_ID_MAP, RITUALS } from "../types";

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

export function migrateRituals(
  rituals: Record<string, boolean>,
): Record<string, boolean> {
  const migrated: Record<string, boolean> = {};
  for (const ritual of RITUALS) {
    migrated[ritual.id] = rituals[ritual.id] ?? false;
  }
  for (const [legacyId, newId] of Object.entries(LEGACY_RITUAL_ID_MAP)) {
    if (rituals[legacyId]) {
      migrated[newId] = true;
    }
  }
  return migrated;
}

export function migrateDailyEntry(entry: DailyEntry): DailyEntry {
  return {
    ...entry,
    rituals: migrateRituals(entry.rituals),
  };
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
    challengeReflectionViewed: false,
    dailyEntries: {},
  };
}

export function migrateUserState(state: UserState): UserState {
  const dailyEntries: Record<string, DailyEntry> = {};
  for (const [date, entry] of Object.entries(state.dailyEntries)) {
    dailyEntries[date] = migrateDailyEntry(entry);
  }
  return {
    ...state,
    challengeReflectionViewed: state.challengeReflectionViewed ?? false,
    dailyEntries,
  };
}

export function loadUserStateFromLocal(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultUserState();
    const parsed = JSON.parse(raw) as UserState;
    return migrateUserState({
      ...createDefaultUserState(),
      ...parsed,
      deviceId: getDeviceId(),
    });
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
  return RITUALS.filter((r) => entry.rituals[r.id]).length;
}

export function allRitualsComplete(entry: DailyEntry): boolean {
  return countCompletedRituals(entry) === RITUALS.length;
}

export function getCompleteDaysCount(
  dailyEntries: Record<string, DailyEntry>,
): number {
  return Object.values(dailyEntries).filter((e) => e.isComplete).length;
}

export function getTotalRitualsCompleted(
  dailyEntries: Record<string, DailyEntry>,
): number {
  return Object.values(dailyEntries).reduce(
    (sum, entry) => sum + countCompletedRituals(entry),
    0,
  );
}

export function getCompletionPercentage(
  dailyEntries: Record<string, DailyEntry>,
): number {
  const total = getTotalRitualsCompleted(dailyEntries);
  const possible = CHALLENGE_DAYS * RITUALS.length;
  return Math.round((total / possible) * 100);
}

export function getCurrentStreak(
  challengeStartDate: string | null,
  dailyEntries: Record<string, DailyEntry>,
  today: string,
): number {
  if (!challengeStartDate) return 0;

  let streak = 0;
  const current = new Date(today + "T00:00:00");

  for (let i = 0; i < CHALLENGE_DAYS; i++) {
    const date = new Date(current);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    const dayNum = getDayNumber(challengeStartDate, dateStr);

    if (!dayNum || dayNum < 1 || dayNum > CHALLENGE_DAYS) break;

    const entry = dailyEntries[dateStr];
    if (entry?.isComplete) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }

  return streak;
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
