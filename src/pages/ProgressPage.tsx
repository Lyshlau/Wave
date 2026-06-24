import { useWaveState } from "../hooks/useWaveState";
import { CHALLENGE_DAYS } from "../types";
import {
  formatDate,
  getCompleteDaysCount,
  getCompletionPercentage,
  getCurrentStreak,
  getDayNumber,
  getTotalRitualsCompleted,
} from "../lib/storage";

export function ProgressPage() {
  const { state } = useWaveState();
  const today = formatDate(new Date());
  const dayNumber = getDayNumber(state.challengeStartDate, today);
  const currentDay = dayNumber ? Math.min(dayNumber, CHALLENGE_DAYS) : 0;

  const completeDays = getCompleteDaysCount(state.dailyEntries);
  const streak = getCurrentStreak(
    state.challengeStartDate,
    state.dailyEntries,
    today,
  );
  const totalRituals = getTotalRitualsCompleted(state.dailyEntries);
  const completionPercent = getCompletionPercentage(state.dailyEntries);

  return (
    <div>
      <header className="mb-10">
        <p className="text-olive-muted font-medium text-sm uppercase tracking-wider mb-1">
          Your challenge
        </p>
        <h1 className="font-display text-3xl text-olive-deep leading-tight">
          Progress
        </h1>
        <p className="text-olive mt-2 text-base">
          Presence over perfection.
        </p>
      </header>

      <div className="mb-10 text-center">
        <p className="font-display text-5xl text-olive-deep font-medium">
          {currentDay > 0 ? currentDay : "—"}
        </p>
        <p className="text-olive-muted text-sm mt-1">
          Day {currentDay > 0 ? currentDay : 0} of {CHALLENGE_DAYS}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <StatRow label="Current streak" value={streak} suffix="days" />
        <StatRow label="Days completed" value={completeDays} suffix="days" />
        <StatRow label="Total rituals completed" value={totalRituals} />
        <StatRow
          label="Completion"
          value={completionPercent}
          suffix="%"
        />
      </div>

      <p className="text-olive-muted text-sm text-center mt-12 leading-relaxed">
        Every ritual checked off is a step forward.
      </p>
    </div>
  );
}

function StatRow({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-baseline justify-between py-3 border-b border-sand/30">
      <p className="text-olive text-sm">{label}</p>
      <p className="font-display text-2xl text-olive-deep">
        {value}
        {suffix && (
          <span className="text-olive-muted text-sm font-sans ml-1">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}
