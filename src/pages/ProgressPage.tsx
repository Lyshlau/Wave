import { useWaveState } from "../hooks/useWaveState";
import { CHALLENGE_DAYS, REFLECTION_OPTIONS, RITUALS } from "../types";
import { countCompletedRituals, getDayNumber, formatDate } from "../lib/storage";

export function ProgressPage() {
  const { state, completedDaysCount } = useWaveState();
  const today = formatDate(new Date());
  const dayNumber = getDayNumber(state.challengeStartDate, today);
  const currentDay = dayNumber ? Math.min(dayNumber, CHALLENGE_DAYS) : 0;
  const progressPercent = Math.round((currentDay / CHALLENGE_DAYS) * 100);

  const completeDays = Object.values(state.dailyEntries).filter(
    (e) => e.isComplete,
  ).length;
  const partialDays = Object.values(state.dailyEntries).filter(
    (e) => e.isPartial,
  ).length;

  const reflectionCounts = REFLECTION_OPTIONS.map((opt) => ({
    ...opt,
    count: Object.values(state.dailyEntries).filter(
      (e) => e.reflection === opt.value,
    ).length,
  }));

  const todayEntry = state.dailyEntries[today];
  const todayRitualCount = todayEntry
    ? countCompletedRituals(todayEntry)
    : 0;

  return (
    <div>
      <header className="mb-8">
        <p className="text-olive font-medium text-sm uppercase tracking-wider mb-1">
          Your journey
        </p>
        <h1 className="font-display text-3xl text-olive-deep leading-tight">
          Progress
        </h1>
        <p className="text-olive mt-2 text-base">
          Presence over perfection — every day counts.
        </p>
      </header>

      <div className="card p-6 mb-6 text-center">
        <div className="relative w-36 h-36 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#E8DCC8"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#5E6D54"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progressPercent * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl text-olive-deep font-semibold">
              {currentDay}
            </span>
            <span className="text-olive text-sm">of {CHALLENGE_DAYS}</span>
          </div>
        </div>
        <p className="text-olive-deep font-medium">
          Day {currentDay} of your 75-day journey
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Complete" value={completeDays} />
        <StatCard label="Partial" value={partialDays} />
        <StatCard label="Today" value={`${todayRitualCount}/${RITUALS.length}`} />
      </div>

      {reflectionCounts.some((r) => r.count > 0) && (
        <div className="card p-5">
          <h2 className="text-olive-deep font-medium text-base mb-4">
            Your pace so far
          </h2>
          <div className="flex flex-col gap-3">
            {reflectionCounts.map((r) => (
              <div key={r.value} className="flex items-center justify-between">
                <span className="text-olive text-sm">{r.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-sand rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage-dark rounded-full"
                      style={{
                        width: `${completeDays > 0 ? (r.count / completeDays) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-olive-deep font-semibold text-sm w-4 text-right">
                    {r.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-olive text-sm text-center mt-8 leading-relaxed">
        {completedDaysCount} days of showing up.
        <br />
        That's what matters.
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-4 text-center">
      <p className="font-display text-2xl text-olive-deep font-semibold">
        {value}
      </p>
      <p className="text-olive text-xs font-medium uppercase tracking-wider mt-1">
        {label}
      </p>
    </div>
  );
}
