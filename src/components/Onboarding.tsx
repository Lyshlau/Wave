import { useState } from "react";
import { ONBOARDING_SLIDES } from "../types";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [slide, setSlide] = useState(0);
  const current = ONBOARDING_SLIDES[slide];
  const isLast = slide === ONBOARDING_SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
        <div className="text-5xl mb-8" aria-hidden="true">
          {current.icon}
        </div>

        <h1 className="font-display text-3xl text-olive-deep text-center mb-4 leading-tight">
          {current.title}
        </h1>

        <p className="text-olive text-center text-base leading-relaxed max-w-sm">
          {current.body}
        </p>

        <div className="flex gap-2 mt-10" role="tablist" aria-label="Onboarding progress">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div
              key={i}
              role="tab"
              aria-selected={i === slide}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide
                  ? "w-6 bg-sage-dark"
                  : "w-1.5 bg-sand"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-8 pb-10 flex flex-col gap-3">
        {isLast ? (
          <button onClick={onComplete} className="btn-primary w-full text-base">
            Get started
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
