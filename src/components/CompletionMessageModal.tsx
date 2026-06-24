interface CompletionMessageModalProps {
  message: string;
  onDismiss: () => void;
}

export function CompletionMessageModal({
  message,
  onDismiss,
}: CompletionMessageModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-message-title"
    >
      <div
        className="absolute inset-0 bg-olive-deep/30 backdrop-blur-sm"
        onClick={onDismiss}
        aria-hidden="true"
      />

      <div className="relative bg-cream w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-3xl p-6 pb-8">
        <p className="text-olive-muted text-sm font-medium uppercase tracking-wider mb-4">
          For you
        </p>

        <p
          id="completion-message-title"
          className="font-display text-2xl text-olive-deep leading-relaxed"
        >
          {message}
        </p>

        <button onClick={onDismiss} className="btn-primary w-full mt-8">
          Continue
        </button>
      </div>
    </div>
  );
}
