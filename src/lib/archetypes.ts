import type { Archetype, ArchetypeId, DailyEntry } from "../types";
import { ARCHETYPES, CHALLENGE_DAYS, RITUALS } from "../types";
import {
  countCompletedRituals,
  formatDate,
  getDayNumber,
} from "./storage";

export interface ChallengeStats {
  daysRecorded: number;
  fullDaysCompleted: number;
  partialDays: number;
  ritualsCompleted: number;
  ritualCounts: Record<string, number>;
  mostCompletedRitual: string;
  returnCount: number;
  longestStreak: number;
  completionRate: number;
  partialDayRatio: number;
  earlyRitualRate: number;
  lateRitualRate: number;
}

function hasActivity(entry: DailyEntry): boolean {
  return entry.isComplete || entry.isPartial || countCompletedRituals(entry) > 0;
}

function getEntriesInDayRange(
  challengeStartDate: string,
  dailyEntries: Record<string, DailyEntry>,
  startDay: number,
  endDay: number,
): DailyEntry[] {
  const entries: DailyEntry[] = [];
  const start = new Date(challengeStartDate + "T00:00:00");

  for (let day = startDay; day <= endDay; day++) {
    const date = new Date(start);
    date.setDate(date.getDate() + day - 1);
    const dateStr = formatDate(date);
    const entry = dailyEntries[dateStr];
    if (entry) entries.push(entry);
  }

  return entries;
}

function ritualRateForRange(
  challengeStartDate: string,
  dailyEntries: Record<string, DailyEntry>,
  startDay: number,
  endDay: number,
): number {
  const dayCount = endDay - startDay + 1;
  if (dayCount <= 0) return 0;

  const entries = getEntriesInDayRange(
    challengeStartDate,
    dailyEntries,
    startDay,
    endDay,
  );
  const completed = entries.reduce(
    (sum, entry) => sum + countCompletedRituals(entry),
    0,
  );
  return completed / (dayCount * RITUALS.length);
}

function getLongestStreak(
  challengeStartDate: string,
  dailyEntries: Record<string, DailyEntry>,
): number {
  let longest = 0;
  let current = 0;
  const start = new Date(challengeStartDate + "T00:00:00");

  for (let day = 1; day <= CHALLENGE_DAYS; day++) {
    const date = new Date(start);
    date.setDate(date.getDate() + day - 1);
    const dateStr = formatDate(date);
    const entry = dailyEntries[dateStr];

    if (entry?.isComplete) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function getReturnCount(
  challengeStartDate: string,
  dailyEntries: Record<string, DailyEntry>,
): number {
  let returns = 0;
  let wasAbsent = false;
  const start = new Date(challengeStartDate + "T00:00:00");

  for (let day = 1; day <= CHALLENGE_DAYS; day++) {
    const date = new Date(start);
    date.setDate(date.getDate() + day - 1);
    const dateStr = formatDate(date);
    const entry = dailyEntries[dateStr];
    const active = entry ? hasActivity(entry) : false;

    if (active && wasAbsent) {
      returns++;
    }

    wasAbsent = !active;
  }

  return returns;
}

export function computeChallengeStats(
  challengeStartDate: string | null,
  dailyEntries: Record<string, DailyEntry>,
): ChallengeStats | null {
  if (!challengeStartDate) return null;

  const entries = Object.values(dailyEntries).filter(hasActivity);
  const daysRecorded = entries.length;
  const fullDaysCompleted = entries.filter((e) => e.isComplete).length;
  const partialDays = entries.filter((e) => e.isPartial).length;
  const ritualsCompleted = entries.reduce(
    (sum, entry) => sum + countCompletedRituals(entry),
    0,
  );

  const ritualCounts: Record<string, number> = {};
  for (const ritual of RITUALS) {
    ritualCounts[ritual.id] = 0;
  }
  for (const entry of entries) {
    for (const ritual of RITUALS) {
      if (entry.rituals[ritual.id]) {
        ritualCounts[ritual.id]++;
      }
    }
  }

  const mostCompletedRitual =
    RITUALS.reduce((best, ritual) =>
      ritualCounts[ritual.id] > ritualCounts[best.id] ? ritual : best,
    ).label;

  const completionRate = ritualsCompleted / (CHALLENGE_DAYS * RITUALS.length);
  const partialDayRatio = daysRecorded > 0 ? partialDays / daysRecorded : 0;
  const earlyRitualRate = ritualRateForRange(
    challengeStartDate,
    dailyEntries,
    1,
    25,
  );
  const lateRitualRate = ritualRateForRange(
    challengeStartDate,
    dailyEntries,
    51,
    75,
  );

  return {
    daysRecorded,
    fullDaysCompleted,
    partialDays,
    ritualsCompleted,
    ritualCounts,
    mostCompletedRitual,
    returnCount: getReturnCount(challengeStartDate, dailyEntries),
    longestStreak: getLongestStreak(challengeStartDate, dailyEntries),
    completionRate,
    partialDayRatio,
    earlyRitualRate,
    lateRitualRate,
  };
}

function isBalancedRitualPattern(
  ritualCounts: Record<string, number>,
  totalRituals: number,
): boolean {
  if (totalRituals === 0) return false;

  const counts = RITUALS.map((r) => ritualCounts[r.id]);
  const mean = totalRituals / RITUALS.length;
  const maxDeviation = Math.max(...counts.map((c) => Math.abs(c - mean)));

  return maxDeviation <= mean * 0.25;
}

function isReflectivePattern(ritualCounts: Record<string, number>): boolean {
  const growGround = ritualCounts.grow + ritualCounts.ground;
  const moveOutsideNourish =
    ritualCounts.move + ritualCounts.outside + ritualCounts.nourish;

  if (growGround === 0) return false;

  const reflectiveShare = growGround / (growGround + moveOutsideNourish);
  return reflectiveShare >= 0.42 && growGround >= moveOutsideNourish * 0.55;
}

export function determineArchetype(
  challengeStartDate: string | null,
  dailyEntries: Record<string, DailyEntry>,
): Archetype {
  const stats = computeChallengeStats(challengeStartDate, dailyEntries);
  if (!stats) return ARCHETYPES[0];

  const {
    daysRecorded,
    completionRate,
    partialDayRatio,
    longestStreak,
    earlyRitualRate,
    lateRitualRate,
    ritualCounts,
    ritualsCompleted,
    returnCount,
  } = stats;

  const archetypeId = classifyArchetype({
    daysRecorded,
    completionRate,
    partialDayRatio,
    longestStreak,
    earlyRitualRate,
    lateRitualRate,
    ritualCounts,
    ritualsCompleted,
    returnCount,
  });

  return ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0];
}

interface ClassificationInput {
  daysRecorded: number;
  completionRate: number;
  partialDayRatio: number;
  longestStreak: number;
  earlyRitualRate: number;
  lateRitualRate: number;
  ritualCounts: Record<string, number>;
  ritualsCompleted: number;
  returnCount: number;
}

function classifyArchetype(input: ClassificationInput): ArchetypeId {
  const {
    daysRecorded,
    completionRate,
    partialDayRatio,
    longestStreak,
    earlyRitualRate,
    lateRitualRate,
    ritualCounts,
    ritualsCompleted,
    returnCount,
  } = input;

  if (
    earlyRitualRate >= 0.6 &&
    lateRitualRate < earlyRitualRate * 0.55 &&
    earlyRitualRate - lateRitualRate >= 0.2
  ) {
    return "tsunami";
  }

  if (completionRate >= 0.65 && longestStreak >= 10) {
    return "current";
  }

  if (partialDayRatio >= 0.3 && daysRecorded >= 20) {
    return "tide";
  }

  if (isReflectivePattern(ritualCounts) && ritualsCompleted >= 30) {
    return "river";
  }

  if (
    isBalancedRitualPattern(ritualCounts, ritualsCompleted) &&
    ritualsCompleted >= 40
  ) {
    return "ocean";
  }

  if (returnCount >= 2 || (daysRecorded >= 15 && completionRate >= 0.35)) {
    return "wave";
  }

  return "wave";
}

export function isChallengeComplete(
  challengeStartDate: string | null,
  currentDate: string,
): boolean {
  const dayNumber = getDayNumber(challengeStartDate, currentDate);
  return dayNumber !== null && dayNumber > CHALLENGE_DAYS;
}
