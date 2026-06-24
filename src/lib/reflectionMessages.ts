import type { DailyEntry, MoodAnswer } from "../types";
import { RITUALS } from "../types";
import {
  countCompletedRituals,
  formatDate,
  getCompleteDaysCount,
  getDayNumber,
} from "./storage";

export interface CompletionMessageContext {
  challengeStartDate: string | null;
  dailyEntries: Record<string, DailyEntry>;
  today: string;
  dayNumber: number | null;
  isPartial: boolean;
  mood?: MoodAnswer | null;
}

const EARLY_JOURNEY_MESSAGES = [
  "You've begun. That's all any journey asks of you.",
  "One day at a time becomes a pattern before you realise it.",
  "A small action completed today. Evidence added.",
  "Day by day, you're creating something worth returning to.",
];

const BUILDING_MOMENTUM_MESSAGES = [
  "Patterns are beginning to emerge.",
  "You're building trust through repetition.",
  "The challenge isn't becoming easier. You're becoming more familiar with it.",
  "Progress is often quieter than it feels.",
];

const MID_JOURNEY_MESSAGES = [
  "Some days have been easier than others. They all belong here.",
  "You're no longer starting. You're continuing.",
  "The calendar is filling with evidence of your effort.",
  "Showing up repeatedly has a way of changing how we see ourselves.",
];

const LATE_JOURNEY_MESSAGES = [
  "A lot has happened since Day 1.",
  "The journey is becoming visible.",
  "You're carrying more evidence than you think.",
  "Consistency is not a straight line. It's a return.",
];

const RETURN_1_DAY_MESSAGES = [
  "Welcome back. The journey continues.",
  "A missed day doesn't erase what came before it.",
  "Progress wasn't waiting for perfection.",
];

const RETURN_2_6_DAYS_MESSAGES = [
  "Life happened. You're here now.",
  "The challenge was never about never missing.",
  "Returning counts.",
  "Every return strengthens the pattern.",
];

const RETURN_7_PLUS_DAYS_MESSAGES = [
  "Welcome back.",
  "The journey remained open.",
  "Some chapters are quieter than others.",
  "Progress begins again each time we return.",
];

const PARTIAL_COMPLETION_MESSAGES = [
  "Not every day looks the same. This one still counts.",
  "Something is always better than nothing.",
  "Part of the journey was recorded today.",
  "Progress can be partial and still be meaningful.",
];

const MOOD_MESSAGES: Record<MoodAnswer, string[]> = {
  calm: ["Some progress feels peaceful."],
  steady: ["Take a moment to acknowledge what you did today."],
  energised: ["Momentum often begins with a single completed day."],
  tired: ["Showing up looks different on tired days."],
  overwhelmed: ["Awareness is part of the journey too."],
};

function hasActivity(entry: DailyEntry): boolean {
  return entry.isComplete || entry.isPartial || countCompletedRituals(entry) > 0;
}

function hashSeed(...values: (string | number)[]): number {
  const str = values.join("|");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickFromPool(pool: string[], seed: number): string {
  return pool[seed % pool.length];
}

function getConsecutiveMissedDaysBefore(
  challengeStartDate: string,
  dailyEntries: Record<string, DailyEntry>,
  today: string,
): number {
  const todayDayNum = getDayNumber(challengeStartDate, today);
  if (!todayDayNum || todayDayNum <= 1) return 0;

  let missed = 0;
  const current = new Date(today + "T00:00:00");

  for (let i = 1; i < todayDayNum; i++) {
    const date = new Date(current);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    const dayNum = getDayNumber(challengeStartDate, dateStr);

    if (!dayNum || dayNum < 1) break;

    const entry = dailyEntries[dateStr];
    if (!entry || !hasActivity(entry)) {
      missed++;
    } else {
      break;
    }
  }

  return missed;
}

function getReturnCountBeforeToday(
  challengeStartDate: string,
  dailyEntries: Record<string, DailyEntry>,
  today: string,
): number {
  let returns = 0;
  let wasAbsent = false;
  const start = new Date(challengeStartDate + "T00:00:00");
  const todayDate = new Date(today + "T00:00:00");

  for (let day = 1; ; day++) {
    const date = new Date(start);
    date.setDate(date.getDate() + day - 1);
    if (date >= todayDate) break;

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

function getRitualCounts(
  dailyEntries: Record<string, DailyEntry>,
  includeToday: boolean,
  today: string,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ritual of RITUALS) {
    counts[ritual.id] = 0;
  }

  for (const [date, entry] of Object.entries(dailyEntries)) {
    if (!includeToday && date === today) continue;
    if (!hasActivity(entry)) continue;

    for (const ritual of RITUALS) {
      if (entry.rituals[ritual.id]) {
        counts[ritual.id]++;
      }
    }
  }

  return counts;
}

function getStrongestRitual(
  ritualCounts: Record<string, number>,
): { id: string; label: string; count: number } | null {
  let best: { id: string; label: string; count: number } | null = null;

  for (const ritual of RITUALS) {
    const count = ritualCounts[ritual.id];
    if (!best || count > best.count) {
      best = { id: ritual.id, label: ritual.label, count };
    }
  }

  if (!best || best.count < 5) return null;
  return best;
}

function getJourneyPhaseMessages(dayNumber: number | null): string[] {
  if (!dayNumber || dayNumber < 1) return EARLY_JOURNEY_MESSAGES;
  if (dayNumber <= 10) return EARLY_JOURNEY_MESSAGES;
  if (dayNumber <= 30) return BUILDING_MOMENTUM_MESSAGES;
  if (dayNumber <= 60) return MID_JOURNEY_MESSAGES;
  return LATE_JOURNEY_MESSAGES;
}

function getReturnMessages(missedDays: number): string[] | null {
  if (missedDays === 1) return RETURN_1_DAY_MESSAGES;
  if (missedDays >= 2 && missedDays <= 6) return RETURN_2_6_DAYS_MESSAGES;
  if (missedDays >= 7) return RETURN_7_PLUS_DAYS_MESSAGES;
  return null;
}

function getDynamicMessage(
  context: CompletionMessageContext,
  missedDays: number,
  returnCountBeforeToday: number,
): string | null {
  const { challengeStartDate, dailyEntries, today, dayNumber } = context;
  if (!challengeStartDate) return null;

  const seed = hashSeed(today, dayNumber ?? 0);
  const daysRecorded = getCompleteDaysCount(dailyEntries);
  const todayEntry = dailyEntries[today];
  const todayComplete = todayEntry?.isComplete ?? false;
  const effectiveDaysRecorded = todayComplete
    ? daysRecorded
    : daysRecorded + (context.isPartial ? 0 : 1);

  if (missedDays > 0) {
    const returnNumber = returnCountBeforeToday + 1;
    if (returnNumber === 3) {
      return "This is your third return. Each one matters.";
    }
    if (returnNumber >= 5 && seed % 3 === 0) {
      return `This is your ${ordinal(returnNumber)} return. Each one matters.`;
    }
  }

  const milestoneDays = [10, 20, 30, 40, 50, 60, 70];
  if (milestoneDays.includes(effectiveDaysRecorded)) {
    return `You've recorded ${effectiveDaysRecorded} days so far. More happened than you remember.`;
  }

  if (effectiveDaysRecorded >= 15 && seed % 4 === 0) {
    return `You've shown up on ${effectiveDaysRecorded} days across this journey.`;
  }

  const ritualCounts = getRitualCounts(dailyEntries, !todayComplete, today);
  const todayRituals = todayEntry?.rituals ?? {};
  for (const ritual of RITUALS) {
    if (todayRituals[ritual.id]) {
      ritualCounts[ritual.id]++;
    }
  }

  const strongest = getStrongestRitual(ritualCounts);
  if (strongest && strongest.count >= 10 && seed % 5 === 0) {
    const total = Object.values(ritualCounts).reduce((sum, c) => sum + c, 0);
    const share = strongest.count / total;
    if (share >= 0.28) {
      return `${strongest.label} has become one of your strongest rituals.`;
    }
  }

  return null;
}

function ordinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const mod100 = n % 100;
  const suffix =
    mod100 >= 11 && mod100 <= 13 ? "th" : suffixes[n % 10] ?? "th";
  return `${n}${suffix}`;
}

export function getCompletionMessage(context: CompletionMessageContext): string {
  const { challengeStartDate, today, dayNumber, isPartial, mood } = context;
  const seed = hashSeed(today, dayNumber ?? 0, isPartial ? "partial" : "full");

  if (isPartial) {
    return pickFromPool(PARTIAL_COMPLETION_MESSAGES, seed);
  }

  const missedDays =
    challengeStartDate != null
      ? getConsecutiveMissedDaysBefore(
          challengeStartDate,
          context.dailyEntries,
          today,
        )
      : 0;

  const returnCountBeforeToday =
    challengeStartDate != null
      ? getReturnCountBeforeToday(
          challengeStartDate,
          context.dailyEntries,
          today,
        )
      : 0;

  const dynamic = getDynamicMessage(
    context,
    missedDays,
    returnCountBeforeToday,
  );
  if (dynamic) return dynamic;

  const returnMessages = getReturnMessages(missedDays);
  if (returnMessages) {
    return pickFromPool(returnMessages, seed);
  }

  if (mood) {
    return MOOD_MESSAGES[mood][0];
  }

  const journeyPool = getJourneyPhaseMessages(dayNumber);
  return pickFromPool(journeyPool, seed);
}
