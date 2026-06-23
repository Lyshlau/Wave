import { useCallback, useMemo, useState } from "react";
import type { DailyEntry, MoodAnswer, ReflectionPace, UserState } from "../types";
import {
  allRitualsComplete,
  createEmptyDailyEntry,
  formatDate,
  loadUserStateFromLocal,
  saveUserStateToLocal,
} from "../lib/storage";

export function useLocalWaveState() {
  const [localState, setLocalState] = useState<UserState>(() =>
    loadUserStateFromLocal(),
  );

  const persist = useCallback((next: UserState) => {
    setLocalState(next);
    saveUserStateToLocal(next);
  }, []);

  const persistEntry = useCallback((entry: DailyEntry) => {
    setLocalState((prev) => {
      const next = {
        ...prev,
        dailyEntries: { ...prev.dailyEntries, [entry.date]: entry },
      };
      saveUserStateToLocal(next);
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    const next = {
      ...localState,
      onboardingCompleted: true,
      challengeStartDate:
        localState.challengeStartDate ?? formatDate(new Date()),
    };
    persist(next);
  }, [localState, persist]);

  const toggleRitual = useCallback(
    (date: string, ritualId: string) => {
      const existing =
        localState.dailyEntries[date] ?? createEmptyDailyEntry(date);
      if (existing.isComplete || existing.isPartial) return;

      const updated: DailyEntry = {
        ...existing,
        rituals: {
          ...existing.rituals,
          [ritualId]: !existing.rituals[ritualId],
        },
      };
      persistEntry(updated);
    },
    [localState.dailyEntries, persistEntry],
  );

  const savePartialDay = useCallback(
    (date: string) => {
      const existing =
        localState.dailyEntries[date] ?? createEmptyDailyEntry(date);
      const updated: DailyEntry = {
        ...existing,
        isPartial: true,
        isComplete: false,
      };
      persistEntry(updated);
    },
    [localState.dailyEntries, persistEntry],
  );

  const completeDayWithReflection = useCallback(
    (date: string, mood: MoodAnswer, reflection: ReflectionPace) => {
      const existing =
        localState.dailyEntries[date] ?? createEmptyDailyEntry(date);
      const updated: DailyEntry = {
        ...existing,
        mood,
        reflection,
        isComplete: true,
        isPartial: false,
      };
      persistEntry(updated);
    },
    [localState.dailyEntries, persistEntry],
  );

  const getTodayEntry = useCallback(
    (date: string): DailyEntry => {
      return localState.dailyEntries[date] ?? createEmptyDailyEntry(date);
    },
    [localState.dailyEntries],
  );

  const completedDaysCount = useMemo(() => {
    return Object.values(localState.dailyEntries).filter(
      (e) => e.isComplete || e.isPartial,
    ).length;
  }, [localState.dailyEntries]);

  return {
    state: localState,
    isLoading: false,
    isConvexConnected: false,
    completeOnboarding,
    toggleRitual,
    savePartialDay,
    completeDayWithReflection,
    getTodayEntry,
    completedDaysCount,
    allRitualsComplete,
  };
}
