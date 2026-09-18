"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { StarRating } from "@/components/ui/StarRating";
import { ArrowLeft } from "lucide-react";

const MAX_LEN = 500;

export function RatingStep({
  rating,
  comment,
  onChange,
  onSubmit,
  onBack,
  submitting,
  error,
}: {
  rating: number;
  comment: string;
  onChange: (patch: { rating?: number; comment?: string }) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  error?: string | null;
}) {
  const followUp =
    rating === 0
      ? "Want to tell us more?"
      : rating <= 3
      ? "What could we improve?"
      : "What made you smile?";

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-chocolate leading-tight">
          One last thing
        </h2>
        <p className="text-cocoa">How many stars would you give your banana?</p>
      </header>

      <div className="py-4">
        <StarRating value={rating} onChange={(n) => onChange({ rating: n })} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="comment"
          className="block font-semibold text-chocolate text-sm"
        >
          {followUp}
        </label>
        <textarea
          id="comment"
          value={comment}
          maxLength={MAX_LEN}
          onChange={(e) => onChange({ comment: e.target.value })}
          placeholder="Tell us what made your experience sweet..."
          className="w-full min-h-[110px] rounded-2xl border border-border bg-white p-3 text-chocolate placeholder:text-cocoa/70 focus:border-chocolate-soft outline-none resize-y"
        />
        <div className="flex justify-end text-xs text-cocoa">
          {comment.length}/{MAX_LEN}
        </div>
      </div>

      {error ? (
        <p role="alert" aria-live="polite" className="text-danger text-sm">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-[auto,1fr] gap-2 pt-2">
        <SecondaryButton
          onClick={onBack}
          disabled={submitting}
          className="!w-auto px-4"
          icon={<ArrowLeft className="size-4" />}
        >
          Back
        </SecondaryButton>
        <PrimaryButton
          onClick={onSubmit}
          loading={submitting}
          disabled={rating === 0}
        >
          Submit review
        </PrimaryButton>
      </div>
      {rating === 0 ? (
        <p className="text-xs text-cocoa text-center">
          Please choose a star rating before submitting.
        </p>
      ) : null}
    </div>
  );
}
