import { useState } from "react";
import { RitualCard } from "../components/RitualCard";
import { ReflectionModal } from "../components/ReflectionModal";
import { useWaveState } from "../hooks/useWaveState";
import { CHALLENGE_DAYS, RITUALS } from "../types";
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
  const displayDay =
    dayNumber && dayNumber > CHALLENGE_DAYS ? CHALLENGE_DAYS : dayNumber;

  const [showReflection, setShowReflection] = useState(false);
  const [showPartialConfirm, setShowPartialConfirm] = useState(false);

  const handleCompleteDay = () => {
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
      <header className="mb-10">
        <p className="text-olive-muted font-medium text-sm uppercase tracking-wider mb-1">
          {displayDay ? `Day ${displayDay}` : "Today"}
        </p>
        <h1 className="font-display text-3xl text-olive-deep leading-tight">
          Today's rituals
        </h1>
        <p className="text-olive mt-2 text-base">
          {dayFinished
            ? entry.isComplete
              ? "Day complete. You showed up."
              : "Saved as a partial day. Still progress."
            : "Check off each ritual as you go."}
        </p>
      </header>

      <div className="flex items-center justify-between mb-6">
        <span className="text-olive-deep font-medium text-sm">
          {completedCount} of {RITUALS.length}
        </span>
        <div className="flex gap-1">
          {RITUALS.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-7 rounded-full transition-colors ${
                i < completedCount ? "bg-sage-dark" : "bg-sand/60"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="mb-10">
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
              onClick={handleCompleteDay}
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
                <p className="text-olive-muted text-sm text-center">
                  Complete all five rituals to reflect and finish your day
                </p>
              )}
            </>
          )}
        </div>
      )}

      {dayFinished && entry.isComplete && entry.reflection && (
        <div className="mt-8 pt-6 border-t border-sand/30">
          <p className="text-olive-muted text-sm font-medium uppercase tracking-wider mb-2">
            Today's pace
          </p>
          <p className="text-olive-deep font-display text-xl capitalize">
            {entry.reflection.replace("-", " ")}
          </p>
          {entry.mood && (
            <p className="text-olive-muted text-sm mt-1 capitalize">
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
            className="absolute inset-0 bg-olive-deep/30 backdrop-blur-sm"
            onClick={() => setShowPartialConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative bg-cream w-full sm:max-w-sm sm:mx-4 rounded-t-3xl sm:rounded-3xl p-6">
            <h2 className="font-display text-xl text-olive-deep mb-2">
              Save as partial day?
            </h2>
            <p className="text-olive-muted text-sm mb-6 leading-relaxed">
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
