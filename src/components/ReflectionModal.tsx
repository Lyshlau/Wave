import { useState } from "react";
import type { MoodAnswer, ReflectionPace } from "../types";
import { MOOD_OPTIONS, REFLECTION_OPTIONS } from "../types";

interface ReflectionModalProps {
  onComplete: (mood: MoodAnswer, reflection: ReflectionPace) => void;
  onClose: () => void;
}

type Step = "mood" | "reflection";

export function ReflectionModal({ onComplete, onClose }: ReflectionModalProps) {
  const [step, setStep] = useState<Step>("mood");
  const [selectedMood, setSelectedMood] = useState<MoodAnswer | null>(null);
  const [selectedReflection, setSelectedReflection] =
    useState<ReflectionPace | null>(null);

  const handleMoodSelect = (mood: MoodAnswer) => {
    setSelectedMood(mood);
    setStep("reflection");
  };

  const handleReflectionSelect = (reflection: ReflectionPace) => {
    setSelectedReflection(reflection);
    if (selectedMood) {
      onComplete(selectedMood, reflection);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reflection-title"
    >
      <div
        className="absolute inset-0 bg-olive-deep/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-cream w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-3xl p-6 pb-8 shadow-xl border border-sand/60">
        {step === "mood" ? (
          <>
            <h2
              id="reflection-title"
              className="font-display text-2xl text-olive-deep mb-1"
            >
              How do you feel?
            </h2>
            <p className="text-olive text-sm mb-6">
              Take a moment to check in with yourself
            </p>

            <div className="grid grid-cols-1 gap-2">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMoodSelect(option.value)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-sand/60
                             bg-white/60 hover:bg-white hover:border-sage transition-colors
                             text-left"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {option.emoji}
                  </span>
                  <span className="text-olive-deep font-medium">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep("mood")}
              className="text-olive-muted text-sm mb-4 hover:text-olive transition-colors"
            >
              ← Back
            </button>

            <h2
              id="reflection-title"
              className="font-display text-2xl text-olive-deep mb-1"
            >
              What's your pace today?
            </h2>
            <p className="text-olive text-sm mb-6">
              There's no right answer — just notice how today felt
            </p>

            <div className="grid grid-cols-1 gap-2">
              {REFLECTION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleReflectionSelect(option.value)}
                  className={`flex flex-col p-4 rounded-xl border transition-colors text-left
                    ${
                      selectedReflection === option.value
                        ? "bg-sage-dark border-sage-dark text-cream"
                        : "bg-white/60 border-sand/60 hover:bg-white hover:border-sage text-olive-deep"
                    }`}
                >
                  <span className="font-medium text-base">{option.label}</span>
                  <span
                    className={`text-sm mt-0.5 ${
                      selectedReflection === option.value
                        ? "text-cream/80"
                        : "text-olive"
                    }`}
                  >
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
