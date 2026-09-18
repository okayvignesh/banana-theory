export function ProgressIndicator({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label={`Step ${step} of ${total}`}
      className="flex items-center justify-center gap-2"
    >
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const state =
          idx < step ? "done" : idx === step ? "active" : "future";
        return (
          <span
            key={i}
            aria-hidden
            className={
              "block h-1.5 rounded-full transition-all " +
              (state === "active"
                ? "bg-banana w-8"
                : state === "done"
                ? "bg-chocolate-soft w-4"
                : "bg-border w-4")
            }
          />
        );
      })}
    </div>
  );
}
