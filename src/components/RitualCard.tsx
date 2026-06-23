import type { Ritual } from "../types";

interface RitualCardProps {
  ritual: Ritual;
  completed: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function RitualCard({
  ritual,
  completed,
  disabled = false,
  onToggle,
}: RitualCardProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={completed}
      className={`w-full card p-4 flex items-center gap-4 text-left transition-all duration-200
        ${disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md active:scale-[0.99]"}
        ${completed ? "border-sage bg-sage/10" : ""}`}
    >
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors
          ${
            completed
              ? "bg-sage-dark border-sage-dark"
              : "border-olive-muted bg-transparent"
          }`}
        aria-hidden="true"
      >
        {completed && (
          <svg
            className="w-4 h-4 text-cream"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-base leading-snug ${
            completed ? "text-olive-deep" : "text-olive-deep"
          }`}
        >
          {ritual.label}
        </p>
        <p className="text-olive text-sm mt-0.5 leading-snug">
          {ritual.description}
        </p>
      </div>
    </button>
  );
}
