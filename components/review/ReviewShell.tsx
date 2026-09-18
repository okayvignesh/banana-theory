"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { BananaLogo } from "@/components/brand/BananaLogo";
import { BrandDecorations } from "@/components/brand/BrandDecorations";
import { ProgressIndicator } from "./ProgressIndicator";
import { WelcomeStep } from "./WelcomeStep";
import { ImpressionStep } from "./ImpressionStep";
import { LovedStep } from "./LovedStep";
import { PhotoStep } from "./PhotoStep";
import { RatingStep } from "./RatingStep";
import { ThankYouStep } from "./ThankYouStep";
import { emptyDraft, type Impression, type LovedOption, type PhotoType, type ReviewDraft } from "@/lib/review-types";

type StepKey = "welcome" | "impression" | "loved" | "photo" | "rating" | "thanks";
const STEPS: StepKey[] = ["welcome", "impression", "loved", "photo", "rating", "thanks"];
// progress dots only for the 4 answering screens (2..5)
const PROGRESS_TOTAL = 4;

export function ReviewShell() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<StepKey>("welcome");
  const [draft, setDraft] = useState<ReviewDraft>(emptyDraft);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idx = STEPS.indexOf(step);
  const progressIdx = Math.max(1, Math.min(PROGRESS_TOTAL, idx - 0)); // step 1 (impression) → 1

  const patch = useCallback((p: Partial<ReviewDraft>) => {
    setDraft((d) => ({ ...d, ...p }));
  }, []);

  const goto = useCallback((s: StepKey) => setStep(s), []);

  async function submit() {
    if (submitted || submitting) return; // prevent double-submit
    if (!draft.impression || draft.rating < 1) {
      setError("Please choose a star rating before submitting.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          impression: draft.impression,
          loved: draft.loved,
          photoUrl: draft.photoUrl,
          photoType: draft.photoType,
          rating: draft.rating,
          comment: draft.comment || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Submit failed");
      }
      setSubmitted(true);
      setStep("thanks");
    } catch (e) {
      setError(
        "Something went a little sideways. Your review is still here. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const anim = reduce
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <main className="relative min-h-dvh flex flex-col items-center px-4 pt-6 pb-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <BrandDecorations />
      </div>

      <div className="relative w-full max-w-[560px] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <BananaLogo />
          {step !== "welcome" && step !== "thanks" ? (
            <div className="text-xs text-cocoa font-medium">
              Step {progressIdx} of {PROGRESS_TOTAL}
            </div>
          ) : null}
        </div>

        {step !== "welcome" && step !== "thanks" ? (
          <ProgressIndicator step={progressIdx} total={PROGRESS_TOTAL} />
        ) : null}

        <section className="rounded-3xl bg-white/70 backdrop-blur-sm border border-border shadow-card p-5 sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              {...anim}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {step === "welcome" && (
                <WelcomeStep onStart={() => goto("impression")} />
              )}
              {step === "impression" && (
                <ImpressionStep
                  value={draft.impression}
                  onChange={(v: Impression) => patch({ impression: v })}
                  onNext={() => goto("loved")}
                  onBack={() => goto("welcome")}
                />
              )}
              {step === "loved" && (
                <LovedStep
                  value={draft.loved}
                  onChange={(v: LovedOption[]) => patch({ loved: v })}
                  onNext={() => goto("photo")}
                  onBack={() => goto("impression")}
                />
              )}
              {step === "photo" && (
                <PhotoStep
                  photoUrl={draft.photoUrl}
                  photoType={draft.photoType}
                  onChange={(p: { photoUrl?: string; photoType?: PhotoType }) => patch(p)}
                  onNext={() => goto("rating")}
                  onBack={() => goto("loved")}
                  onSkip={() => {
                    patch({ photoUrl: undefined, photoType: undefined });
                    goto("rating");
                  }}
                />
              )}
              {step === "rating" && (
                <RatingStep
                  rating={draft.rating}
                  comment={draft.comment}
                  onChange={(p) => patch(p)}
                  onSubmit={submit}
                  onBack={() => goto("photo")}
                  submitting={submitting}
                  error={error}
                />
              )}
              {step === "thanks" && (
                <ThankYouStep onDone={() => (window.location.href = "/")} />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <footer className="text-center text-xs text-cocoa pt-2">
          <span className="font-display italic">Happiness on a stick.</span>
        </footer>
      </div>
    </main>
  );
}
