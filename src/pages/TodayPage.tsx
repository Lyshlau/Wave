import { useState } from "react";
import { RitualCard } from "../components/RitualCard";
import { ReflectionModal } from "../components/ReflectionModal";
import { useWaveState } from "../hooks/useWaveState";
import { RITUALS } from "../types";
import {
  countCompletedRituals,
  formatDate,
  getDayNumber,
} from "../lib/storage";

export function TodayPage() {
  const today = formatDate(new Date());
  const {
    state,
    toggleRitual,
    savePartialDay,
    completeDayWithReflection,
    getTodayEntry,
    allRitualsComplete: checkAllComplete,
  } = useWaveState();

  const entry = getTodayEntry(today);
  const completedCount = countCompletedRituals(entry);
  const allDone = checkAllComplete(entry);
  const dayFinished = entry.isComplete || entry.isPartial;
  const dayNumber = getDayNumber(state.challengeStartDate, today);

  const [showReflection, setShowReflection] = useState(false);
  const [showPartialConfirm, setShowPartialConfirm] = useState(false);

  const handleFinishRituals = () => {
    if (allDone) {
      setShowReflection(true);
    }
  };

  const handleSavePartial = () => {
    savePartialDay(today);
    setShowPartialConfirm(false);
  };

  const handleReflectionComplete = (
    mood: Parameters<typeof completeDayWithReflection>[1],
    reflection: Parameters<typeof completeDayWithReflection>[2],
  ) => {
    completeDayWithReflection(today, mood, reflection);
    setShowReflection(false);
  };

  return (
    <div>
      <header className="mb-8">
        <p className="text-olive font-medium text-sm uppercase tracking-wider mb-1">
          {dayNumber ? `Day ${dayNumber}` : "Today"}
        </p>
        <h1 className="font-display text-3xl text-olive-deep leading-tight">
          Your daily rituals
        </h1>
        <p className="text-olive mt-2 text-base">
          {dayFinished
            ? entry.isComplete
              ? "Beautiful — you've completed today."
              : "Saved as a partial day. That's still progress."
            : "Tick off each ritual as you go. No rush."}
        </p>
      </header>

      <div className="flex items-center justify-between mb-5">
        <span className="text-olive-deep font-semibold text-lg">
          {completedCount} of {RITUALS.length}
        </span>
        <div className="flex gap-1">
          {RITUALS.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-colors ${
                i < completedCount ? "bg-sage-dark" : "bg-sand"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {RITUALS.map((ritual) => (
          <RitualCard
            key={ritual.id}
            ritual={ritual}
            completed={entry.rituals[ritual.id] ?? false}
            disabled={dayFinished}
            onToggle={() => toggleRitual(today, ritual.id)}
          />
        ))}
      </div>

      {!dayFinished && (
        <div className="flex flex-col gap-3">
          {allDone ? (
            <button
              onClick={handleFinishRituals}
              className="btn-primary w-full text-base"
            >
              Complete day
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowPartialConfirm(true)}
                className="btn-secondary w-full text-base"
                disabled={completedCount === 0}
              >
                Save partial day
              </button>
              {completedCount > 0 && (
                <p className="text-olive text-sm text-center">
                  Finish all five rituals to reflect and complete your day
                </p>
              )}
            </>
          )}
        </div>
      )}

      {dayFinished && entry.isComplete && entry.reflection && (
        <div className="card p-5 mt-4">
          <p className="text-olive text-sm font-medium uppercase tracking-wider mb-2">
            Today's reflection
          </p>
          <p className="text-olive-deep font-display text-xl capitalize">
            {entry.reflection.replace("-", " ")}
          </p>
          {entry.mood && (
            <p className="text-olive text-sm mt-1 capitalize">
              Feeling {entry.mood}
            </p>
          )}
        </div>
      )}

      {showReflection && (
        <ReflectionModal
          onComplete={handleReflectionComplete}
          onClose={() => setShowReflection(false)}
        />
      )}

      {showPartialConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-olive-deep/40 backdrop-blur-sm"
            onClick={() => setShowPartialConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative bg-cream w-full sm:max-w-sm sm:mx-4 rounded-t-3xl sm:rounded-3xl p-6 shadow-xl border border-sand/60">
            <h2 className="font-display text-xl text-olive-deep mb-2">
              Save as partial day?
            </h2>
            <p className="text-olive text-sm mb-6 leading-relaxed">
              You've completed {completedCount} of {RITUALS.length} rituals.
              That's still progress — no reflection needed.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={handleSavePartial} className="btn-primary w-full">
                Save partial day
              </button>
              <button
                onClick={() => setShowPartialConfirm(false)}
                className="btn-secondary w-full"
              >
                Keep going
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
