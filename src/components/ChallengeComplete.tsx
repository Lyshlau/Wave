import { determineArchetype, computeChallengeStats } from "../lib/archetypes";
import type { UserState } from "../types";
import { ShareCardActions } from "./ShareCard";

interface ChallengeCompleteProps {
  state: UserState;
  onContinue: () => void;
}

export function ChallengeComplete({ state, onContinue }: ChallengeCompleteProps) {
  const archetype = determineArchetype(
    state.challengeStartDate,
    state.dailyEntries,
  );
  const stats = computeChallengeStats(
    state.challengeStartDate,
    state.dailyEntries,
  );

  if (!stats) return null;

  return (
    <div className="fixed inset-0 z-50 bg-cream overflow-y-auto">
      <div className="min-h-full flex flex-col px-8 py-12 max-w-md mx-auto">
        <header className="mb-10 text-center">
          <h1 className="font-display text-[2rem] text-olive-deep leading-snug mb-5">
            Your journey is complete
          </h1>
          <p className="text-olive text-[0.95rem] leading-relaxed">
            For 75 days, you showed up in your own way. Some days fully. Some
            days partially. Some days not at all. But a pattern emerged.
          </p>
        </header>

        <section className="mb-10 text-center">
          <p className="text-olive-muted text-sm uppercase tracking-wider mb-3">
            Your reflection
          </p>
          <h2 className="font-display text-3xl text-olive-deep mb-4">
            You are {archetype.name}
          </h2>
          <p className="text-olive text-sm leading-relaxed mb-2">
            {archetype.trait}
          </p>
          <p className="text-olive text-[0.95rem] leading-relaxed italic">
            {archetype.message}
          </p>
        </section>

        <section className="mb-10">
          <p className="text-olive-muted text-sm uppercase tracking-wider mb-4 text-center">
            Your evidence
          </p>
          <div className="flex flex-col gap-4">
            <StatRow label="Days recorded" value={stats.daysRecorded} />
            <StatRow
              label="Full days completed"
              value={stats.fullDaysCompleted}
            />
            <StatRow
              label="Rituals completed"
              value={stats.ritualsCompleted}
            />
            <StatRow
              label="Most completed ritual"
              value={stats.mostCompletedRitual}
              isText
            />
            {stats.returnCount > 0 && (
              <StatRow label="Times you returned" value={stats.returnCount} />
            )}
          </div>
        </section>

        <section className="mb-10">
          <p className="text-olive-muted text-sm uppercase tracking-wider mb-4 text-center">
            Share your journey
          </p>
          <ShareCardActions
            archetype={archetype}
            daysRecorded={stats.daysRecorded}
          />
        </section>

        <button onClick={onContinue} className="btn-secondary w-full text-base">
          Continue
        </button>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  isText,
}: {
  label: string;
  value: number | string;
  isText?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-sand/30">
      <p className="text-olive text-sm">{label}</p>
      <p
        className={`text-olive-deep ${isText ? "font-sans text-sm" : "font-display text-xl"}`}
      >
        {value}
      </p>
    </div>
  );
}
