import type { Ritual } from "../types";
import { Check } from "lucide-react";

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
  const Icon = ritual.icon;

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={completed}
      className={`w-full flex items-center gap-4 py-4 text-left transition-opacity duration-200
        border-b border-sand/30 last:border-b-0
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 active:opacity-70"}`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors
          ${completed ? "bg-sage-dark/15 text-sage-dark" : "bg-cream-dark/60 text-olive-muted"}`}
        aria-hidden="true"
      >
        <Icon className="w-4 h-4" strokeWidth={1.75} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-base leading-snug text-olive-deep">
          {ritual.label}
        </p>
        <p className="text-olive-muted text-sm mt-0.5 leading-snug">
          {ritual.description}
        </p>
      </div>

      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors
          ${
            completed
              ? "bg-sage-dark text-cream"
              : "border border-sand/60 bg-transparent"
          }`}
        aria-hidden="true"
      >
        {completed && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
      </div>
    </button>
  );
}
