import { useState } from "react";
import { Check, X } from "lucide-react";
import { useWaveState } from "../hooks/useWaveState";
import { CHALLENGE_DAYS, RITUALS } from "../types";
import {
  createEmptyDailyEntry,
  formatDate,
  formatDisplayDate,
  getDayNumber,
} from "../lib/storage";

type DayStatus = "complete" | "partial" | "today" | "missed" | "future";

interface DayInfo {
  day: number;
  status: DayStatus;
  date?: string;
}

export function JourneyPage() {
  const { state } = useWaveState();
  const today = formatDate(new Date());
  const dayNumber = getDayNumber(state.challengeStartDate, today);
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);

  const days: DayInfo[] = Array.from({ length: CHALLENGE_DAYS }, (_, i) => {
    const day = i + 1;
    if (!state.challengeStartDate) return { day, status: "future" as const };

    const start = new Date(state.challengeStartDate + "T00:00:00");
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = formatDate(date);
    const entry = state.dailyEntries[dateStr];

    if (entry?.isComplete)
      return { day, status: "complete" as const, date: dateStr };
    if (entry?.isPartial)
      return { day, status: "partial" as const, date: dateStr };
    if (dayNumber && day === dayNumber)
      return { day, status: "today" as const, date: dateStr };
    if (dayNumber && day < dayNumber)
      return { day, status: "missed" as const, date: dateStr };
    return { day, status: "future" as const, date: dateStr };
  });

  const statusColors: Record<DayStatus, string> = {
    complete: "bg-sage-dark text-cream",
    partial: "bg-sand text-olive-deep",
    today:
      "bg-sage text-cream ring-2 ring-sage-dark ring-offset-1 ring-offset-cream",
    missed: "bg-cream-dark text-olive-muted",
    future: "bg-cream-dark/40 text-olive-muted/50",
  };

  const selectedEntry = selectedDay?.date
    ? (state.dailyEntries[selectedDay.date] ??
      createEmptyDailyEntry(selectedDay.date))
    : null;

  return (
    <div>
      <header className="mb-10">
        <p className="text-olive-muted font-medium text-sm uppercase tracking-wider mb-1">
          75 days
        </p>
        <h1 className="font-display text-3xl text-olive-deep leading-tight">
          Journey
        </h1>
        <p className="text-olive mt-2 text-base">
          A calm record of your presence.
        </p>
      </header>

      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
        {[
          { label: "Complete", color: "bg-sage-dark" },
          { label: "Partial", color: "bg-sand" },
          { label: "Today", color: "bg-sage" },
          { label: "Missed", color: "bg-cream-dark" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className={`w-3 h-3 rounded-sm ${item.color}`}
              aria-hidden="true"
            />
            <span className="text-olive-muted text-xs font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-1.5"
        role="grid"
        aria-label="75-day journey calendar"
      >
        {days.map((dayInfo) => (
          <button
            key={dayInfo.day}
            type="button"
            role="gridcell"
            aria-label={`Day ${dayInfo.day}: ${dayInfo.status}`}
            disabled={dayInfo.status === "future"}
            onClick={() =>
              dayInfo.status !== "future" && setSelectedDay(dayInfo)
            }
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium
              transition-opacity
              ${statusColors[dayInfo.status]}
              ${dayInfo.status !== "future" ? "hover:opacity-80 cursor-pointer" : "cursor-default"}`}
          >
            {dayInfo.day}
          </button>
        ))}
      </div>

      <p className="text-olive-muted text-sm text-center mt-10 leading-relaxed">
        Missed a day? Pick up where you left off.
      </p>

      {selectedDay && selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-olive-deep/30 backdrop-blur-sm"
            onClick={() => setSelectedDay(null)}
            aria-hidden="true"
          />
          <div className="relative bg-cream w-full sm:max-w-sm sm:mx-4 rounded-t-3xl sm:rounded-3xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-olive-muted text-sm uppercase tracking-wider">
                  Day {selectedDay.day}
                </p>
                <h2 className="font-display text-xl text-olive-deep mt-0.5">
                  {selectedDay.date
                    ? formatDisplayDate(selectedDay.date)
                    : `Day ${selectedDay.day}`}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1 text-olive-muted hover:text-olive transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {RITUALS.map((ritual) => {
                const completed = selectedEntry.rituals[ritual.id] ?? false;
                const Icon = ritual.icon;
                return (
                  <div
                    key={ritual.id}
                    className="flex items-center gap-3 py-2"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center
                        ${completed ? "bg-sage-dark/15 text-sage-dark" : "bg-cream-dark/60 text-olive-muted/50"}`}
                    >
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </div>
                    <span
                      className={`text-sm flex-1 ${completed ? "text-olive-deep" : "text-olive-muted"}`}
                    >
                      {ritual.label}
                    </span>
                    {completed ? (
                      <Check
                        className="w-4 h-4 text-sage-dark"
                        strokeWidth={2}
                      />
                    ) : (
                      <span className="w-4 h-4" aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </div>

            {selectedDay.status === "missed" && (
              <p className="text-olive-muted text-sm mt-6 text-center">
                No rituals recorded this day.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
