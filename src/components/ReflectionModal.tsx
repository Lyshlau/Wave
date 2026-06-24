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
        className="absolute inset-0 bg-olive-deep/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-cream w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-3xl p-6 pb-8">
        {step === "mood" ? (
          <>
            <h2
              id="reflection-title"
              className="font-display text-2xl text-olive-deep mb-1"
            >
              How do you feel?
            </h2>
            <p className="text-olive-muted text-sm mb-6">
              Take a moment to check in
            </p>

            <div className="grid grid-cols-1 gap-1">
              {MOOD_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleMoodSelect(option.value)}
                    className="flex items-center gap-3 py-3.5 px-1 rounded-xl
                               hover:bg-cream-dark/50 transition-colors text-left"
                  >
                    <Icon
                      className="w-5 h-5 text-sage-dark"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span className="text-olive-deep font-medium">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep("mood")}
              className="text-olive-muted text-sm mb-4 hover:text-olive transition-colors"
            >
              Back
            </button>

            <h2
              id="reflection-title"
              className="font-display text-2xl text-olive-deep mb-1"
            >
              What was your pace today?
            </h2>
            <p className="text-olive-muted text-sm mb-6">
              No right answer — just notice how today felt
            </p>

            <div className="grid grid-cols-1 gap-1">
              {REFLECTION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleReflectionSelect(option.value)}
                  className={`flex flex-col py-3.5 px-1 rounded-xl transition-colors text-left
                    ${
                      selectedReflection === option.value
                        ? "bg-sage-dark/10"
                        : "hover:bg-cream-dark/50"
                    }`}
                >
                  <span className="font-medium text-base text-olive-deep">
                    {option.label}
                  </span>
                  <span className="text-sm mt-0.5 text-olive-muted">
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
