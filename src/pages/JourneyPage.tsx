import { useWaveState } from "../hooks/useWaveState";
import { CHALLENGE_DAYS } from "../types";
import { formatDate, getDayNumber } from "../lib/storage";

export function JourneyPage() {
  const { state } = useWaveState();
  const today = formatDate(new Date());
  const dayNumber = getDayNumber(state.challengeStartDate, today);

  const days = Array.from({ length: CHALLENGE_DAYS }, (_, i) => {
    const day = i + 1;
    if (!state.challengeStartDate) return { day, status: "future" as const };

    const start = new Date(state.challengeStartDate + "T00:00:00");
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = formatDate(date);
    const entry = state.dailyEntries[dateStr];

    if (entry?.isComplete) return { day, status: "complete" as const, date: dateStr };
    if (entry?.isPartial) return { day, status: "partial" as const, date: dateStr };
    if (dayNumber && day === dayNumber) return { day, status: "today" as const, date: dateStr };
    if (dayNumber && day < dayNumber) return { day, status: "missed" as const, date: dateStr };
    return { day, status: "future" as const, date: dateStr };
  });

  const statusColors = {
    complete: "bg-sage-dark text-cream",
    partial: "bg-sand text-olive-deep",
    today: "bg-sage text-cream ring-2 ring-sage-dark ring-offset-1 ring-offset-cream",
    missed: "bg-cream-dark text-olive-muted border border-sand",
    future: "bg-cream-dark/50 text-olive-muted/60",
  };

  return (
    <div>
      <header className="mb-8">
        <p className="text-olive font-medium text-sm uppercase tracking-wider mb-1">
          75 days
        </p>
        <h1 className="font-display text-3xl text-olive-deep leading-tight">
          Your journey
        </h1>
        <p className="text-olive mt-2 text-base">
          A calm record of your presence. No restarts, no punishment.
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {[
          { label: "Complete", color: "bg-sage-dark" },
          { label: "Partial", color: "bg-sand" },
          { label: "Today", color: "bg-sage" },
          { label: "Missed", color: "bg-cream-dark border border-sand" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 mr-3">
            <div className={`w-3 h-3 rounded-sm ${item.color}`} aria-hidden="true" />
            <span className="text-olive text-xs font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-1.5"
        role="grid"
        aria-label="75-day journey calendar"
      >
        {days.map(({ day, status }) => (
          <div
            key={day}
            role="gridcell"
            aria-label={`Day ${day}: ${status}`}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold
              ${statusColors[status]}`}
          >
            {day}
          </div>
        ))}
      </div>

      <p className="text-olive text-sm text-center mt-8 leading-relaxed">
        Missed a day? Just pick up where you left off.
        <br />
        Progress over perfection.
      </p>
    </div>
  );
}
