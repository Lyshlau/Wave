import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Calendar,
  Leaf,
  Moon,
  RefreshCw,
  Sparkles,
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

export type ArchetypeId =
  | "wave"
  | "current"
  | "tide"
  | "river"
  | "ocean"
  | "tsunami";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  trait: string;
  message: string;
  hidden?: boolean;
}

export interface UserState {
  deviceId: string;
  challengeStartDate: string | null;
  onboardingCompleted: boolean;
  challengeReflectionViewed: boolean;
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

export const ARCHETYPES: Archetype[] = [
  {
    id: "wave",
    name: "The Wave",
    trait: "Returns consistently",
    message:
      "You learned the art of returning. Progress came from consistency, not perfection.",
  },
  {
    id: "current",
    name: "The Current",
    trait: "Momentum builder",
    message: "Once you found your flow, you trusted it.",
  },
  {
    id: "tide",
    name: "The Tide",
    trait: "Adaptive",
    message:
      "You learned to move with changing seasons rather than against them.",
  },
  {
    id: "river",
    name: "The River",
    trait: "Purposeful",
    message:
      "Your progress came through deliberate action and steady direction.",
  },
  {
    id: "ocean",
    name: "The Ocean",
    trait: "Balanced",
    message: "You created growth across multiple areas of your life.",
  },
  {
    id: "tsunami",
    name: "The Tsunami",
    trait: "Powerful but intense",
    message:
      "You moved with incredible energy. Your next season may be about rhythm rather than intensity.",
    hidden: true,
  },
];

export const ONBOARDING_SLIDES: {
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Life comes in waves",
    body: "Some days feel effortless. Some feel messy. Both count. Wave helps you see your progress, even when it doesn't feel like it.",
    icon: Waves,
  },
  {
    title: "A different kind of challenge",
    body: "For 75 days, complete five daily rituals: Move, Outside, Nourish, Ground and Grow. Small actions repeated consistently create meaningful change.",
    icon: Activity,
  },
  {
    title: "No restarting",
    body: "Miss a ritual. Miss a day. Miss a week. The challenge continues. Wave rewards returning, not perfection.",
    icon: RefreshCw,
  },
  {
    title: "Leave a trail",
    body: "Each day becomes part of your journey. Your calendar records the days you showed up — a visual reminder that progress is often greater than it feels.",
    icon: Calendar,
  },
  {
    title: "A pattern will emerge",
    body: "After 75 days, you'll receive a reflection on your journey. Not a score. Not a ranking. A reflection of how you showed up.",
    icon: Sparkles,
  },
];
