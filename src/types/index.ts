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
    id: "morning-skin",
    label: "Morning skin ritual",
    description: "Cleanse, treat, and protect your skin",
  },
  {
    id: "movement",
    label: "Gentle movement",
    description: "Move your body with intention",
  },
  {
    id: "hydration",
    label: "Nourish & hydrate",
    description: "Water and mindful nourishment",
  },
  {
    id: "mindful-moment",
    label: "Mindful moment",
    description: "A few quiet breaths or stillness",
  },
  {
    id: "evening-skin",
    label: "Evening skin ritual",
    description: "Wind down with your evening care",
  },
];

export const CHALLENGE_DAYS = 75;

export const REFLECTION_OPTIONS: {
  value: ReflectionPace;
  label: string;
  description: string;
}[] = [
  {
    value: "wave",
    label: "Wave",
    description: "Gentle and steady — just showing up",
  },
  {
    value: "building-swell",
    label: "Building Swell",
    description: "Momentum is growing, energy rising",
  },
  {
    value: "tsunami",
    label: "Tsunami",
    description: "Full force — you're in the flow",
  },
];

export const MOOD_OPTIONS: { value: MoodAnswer; label: string; emoji: string }[] =
  [
    { value: "calm", label: "Calm", emoji: "🌊" },
    { value: "steady", label: "Steady", emoji: "🌿" },
    { value: "energised", label: "Energised", emoji: "✨" },
    { value: "tired", label: "Tired", emoji: "🌙" },
    { value: "overwhelmed", label: "Overwhelmed", emoji: "🌀" },
  ];

export const ONBOARDING_SLIDES = [
  {
    title: "Welcome to Wave",
    body: "A calm space for your daily wellness rituals. No pressure, no punishment — just presence.",
    icon: "🌊",
  },
  {
    title: "Complete your five daily rituals",
    body: "Tick off your rituals as you go. Each one takes just a moment — your whole day fits in under 30 seconds.",
    icon: "✓",
  },
  {
    title: "Reflect on your pace",
    body: "When you're ready, choose how today felt: Wave, Building Swell, or Tsunami. There's no wrong answer.",
    icon: "🌀",
  },
  {
    title: "Track your presence across 75 days",
    body: "Watch your journey unfold. Every day you show up counts — even the quiet ones.",
    icon: "📅",
  },
  {
    title: "Progress over perfection",
    body: "Miss a day? That's okay. Wave doesn't restart — you simply pick up where you left off.",
    icon: "🌿",
  },
];
