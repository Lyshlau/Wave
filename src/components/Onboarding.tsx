import { useState } from "react";
import { ONBOARDING_SLIDES } from "../types";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [slide, setSlide] = useState(0);
  const current = ONBOARDING_SLIDES[slide];
  const isLast = slide === ONBOARDING_SLIDES.length - 1;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-10 pb-8 max-w-md mx-auto w-full">
        <div className="mb-14" aria-hidden="true">
          <Icon className="w-10 h-10 text-sage-dark" strokeWidth={1.25} />
        </div>

        <h1 className="font-display text-[2rem] text-olive-deep text-center mb-5 leading-snug">
          {current.title}
        </h1>

        <p className="text-olive text-center text-[0.95rem] leading-relaxed">
          {current.body}
        </p>

        <div
          className="flex gap-2.5 mt-14"
          role="tablist"
          aria-label="Onboarding progress"
        >
          {ONBOARDING_SLIDES.map((_, i) => (
            <div
              key={i}
              role="tab"
              aria-selected={i === slide}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === slide ? "w-8 bg-sage-dark" : "w-1.5 bg-sand"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-8 pb-12 flex flex-col gap-3 max-w-md mx-auto w-full">
        {isLast ? (
          <button onClick={onComplete} className="btn-primary w-full text-base">
            Begin Day 1
          </button>
        ) : (
          <button
            onClick={() => setSlide((s) => s + 1)}
            className="btn-primary w-full text-base"
          >
            Continue
          </button>
        )}

        {!isLast && (
          <button
            onClick={onComplete}
            className="text-olive-muted text-sm text-center py-2 hover:text-olive transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
