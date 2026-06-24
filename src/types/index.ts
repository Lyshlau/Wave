import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Calendar,
  Check,
  Leaf,
  Moon,
  Sun,
  Waves,
  Wind,
} from "lucide-react";

export type ReflectionPace = "wave" | "building-swell" | "tsunami";

export type MoodAnswer =
  | "calm"
  | "steady"
  | "energised"
  | "tired"
  | "overwhelmed";

export interface Ritual {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface DailyEntry {
  date: string;
  rituals: Record<string, boolean>;
  reflection: ReflectionPace | null;
  mood: MoodAnswer | null;
  isComplete: boolean;
  isPartial: boolean;
}

export interface UserState {
  deviceId: string;
  challengeStartDate: string | null;
  onboardingCompleted: boolean;
  dailyEntries: Record<string, DailyEntry>;
}

export const RITUALS: Ritual[] = [
  {
    id: "move",
    label: "Move",
    description: "Pilates, mobility, strength or intentional movement",
    icon: Activity,
  },
  {
    id: "outside",
    label: "Outside",
    description: "Walk, run, sunlight or time outdoors",
    icon: Sun,
  },
  {
    id: "nourish",
    label: "Nourish",
    description: "Hydration, protein and whole-food choices",
    icon: Leaf,
  },
  {
    id: "ground",
    label: "Ground",
    description: "Journaling, meditation or reflection",
    icon: Waves,
  },
  {
    id: "grow",
    label: "Grow",
    description: "Reading, learning or creating",
    icon: BookOpen,
  },
];

export const CHALLENGE_DAYS = 75;

export const LEGACY_RITUAL_ID_MAP: Record<string, string> = {
  "morning-skin": "move",
  movement: "move",
  hydration: "nourish",
  "mindful-moment": "ground",
  "evening-skin": "grow",
};

export const REFLECTION_OPTIONS: {
  value: ReflectionPace;
  label: string;
  description: string;
}[] = [
  {
    value: "wave",
    label: "Wave",
    description: "Steady and present — you showed up",
  },
  {
    value: "building-swell",
    label: "Building Swell",
    description: "Momentum building, energy rising",
  },
  {
    value: "tsunami",
    label: "Tsunami",
    description: "Full force — deep in the flow",
  },
];

export const MOOD_OPTIONS: {
  value: MoodAnswer;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "calm", label: "Calm", icon: Waves },
  { value: "steady", label: "Steady", icon: Leaf },
  { value: "energised", label: "Energised", icon: Sun },
  { value: "tired", label: "Tired", icon: Moon },
  { value: "overwhelmed", label: "Overwhelmed", icon: Wind },
];

export const ONBOARDING_SLIDES: {
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Welcome to Wave",
    body: "A calm space for your 75-day personal growth challenge. No pressure — just presence.",
    icon: Waves,
  },
  {
    title: "Five daily rituals",
    body: "Move, go outside, nourish, ground, and grow. Check each one off as you go.",
    icon: Check,
  },
  {
    title: "Reflect when ready",
    body: "After all five rituals, choose your pace: Wave, Building Swell, or Tsunami.",
    icon: Activity,
  },
  {
    title: "75 days of showing up",
    body: "Track your journey across the full challenge. Every day counts — even the quiet ones.",
    icon: Calendar,
  },
  {
    title: "Presence over perfection",
    body: "Miss a day? Pick up where you left off. Wave doesn't restart.",
    icon: Leaf,
  },
];
