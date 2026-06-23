import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import type { DailyEntry, MoodAnswer, ReflectionPace, UserState } from "../types";
import {
  allRitualsComplete,
  createDefaultUserState,
  createEmptyDailyEntry,
  formatDate,
  getDeviceId,
  loadUserStateFromLocal,
  saveUserStateToLocal,
} from "../lib/storage";
import { isConvexAvailable } from "../lib/convex";
import { api } from "../../convex/_generated/api";

function entriesToRecord(
  entries: DailyEntry[],
): Record<string, DailyEntry> {
  const record: Record<string, DailyEntry> = {};
  for (const entry of entries) {
    record[entry.date] = entry;
  }
  return record;
}

export function useWaveState() {
  const deviceId = useMemo(() => getDeviceId(), []);
  const [localState, setLocalState] = useState<UserState>(() =>
    loadUserStateFromLocal(),
  );
  const [isLoading, setIsLoading] = useState(isConvexAvailable);

  const convexProfile = useQuery(
    api.userState.getProfile,
    isConvexAvailable ? { deviceId } : "skip",
  );
  const convexEntries = useQuery(
    api.userState.getDailyEntries,
    isConvexAvailable ? { deviceId } : "skip",
  );

  const upsertProfile = useMutation(api.userState.upsertProfile);
  const upsertDailyEntry = useMutation(api.userState.upsertDailyEntry);

  useEffect(() => {
    if (!isConvexAvailable) return;
    if (convexProfile === undefined || convexEntries === undefined) return;

    if (convexProfile) {
      const merged: UserState = {
        deviceId,
        challengeStartDate: convexProfile.challengeStartDate,
        onboardingCompleted: convexProfile.onboardingCompleted,
        dailyEntries: entriesToRecord(
          convexEntries.map((e: {
            date: string;
            rituals: Record<string, boolean>;
            reflection: DailyEntry["reflection"];
            mood: DailyEntry["mood"];
            isComplete: boolean;
            isPartial: boolean;
          }) => ({
            date: e.date,
            rituals: e.rituals,
            reflection: e.reflection,
            mood: e.mood,
            isComplete: e.isComplete,
            isPartial: e.isPartial,
          })),
        ),
      };
      setLocalState(merged);
      saveUserStateToLocal(merged);
    } else {
      const current = loadUserStateFromLocal();
      void upsertProfile({
        deviceId,
        challengeStartDate: current.challengeStartDate,
        onboardingCompleted: current.onboardingCompleted,
      });
      for (const entry of Object.values(current.dailyEntries)) {
        void upsertDailyEntry({ deviceId, ...entry });
      }
    }
    setIsLoading(false);
  }, [convexProfile, convexEntries, deviceId, upsertProfile, upsertDailyEntry]);

  const persist = useCallback(
    (next: UserState) => {
      setLocalState(next);
      saveUserStateToLocal(next);
      if (isConvexAvailable) {
        void upsertProfile({
          deviceId,
          challengeStartDate: next.challengeStartDate,
          onboardingCompleted: next.onboardingCompleted,
        });
      }
    },
    [deviceId, upsertProfile],
  );

  const persistEntry = useCallback(
    (entry: DailyEntry) => {
      setLocalState((prev) => {
        const next = {
          ...prev,
          dailyEntries: { ...prev.dailyEntries, [entry.date]: entry },
        };
        saveUserStateToLocal(next);
        return next;
      });
      if (isConvexAvailable) {
        void upsertDailyEntry({ deviceId, ...entry });
      }
    },
    [deviceId, upsertDailyEntry],
  );

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
    isLoading,
    isConvexConnected: isConvexAvailable,
    completeOnboarding,
    toggleRitual,
    savePartialDay,
    completeDayWithReflection,
    getTodayEntry,
    completedDaysCount,
    allRitualsComplete,
  };
}

export function useDefaultUserState(): UserState {
  return createDefaultUserState();
}
