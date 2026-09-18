"use client";

import { OptionCard } from "@/components/ui/OptionCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { LOVED_OPTIONS, type LovedOption } from "@/lib/review-types";
import {
  ArrowLeft,
  Banana,
  Cookie,
  Nut,
  Sparkles,
  Candy,
  Leaf,
  Users,
  Camera,
  Heart,
  PartyPopper,
} from "lucide-react";
import type { ReactNode } from "react";

const ICON_MAP: Record<LovedOption, ReactNode> = {
  "The banana": <Banana className="size-6 text-chocolate" />,
  "The chocolate": <Cookie className="size-6 text-chocolate" />,
  "The toppings": <Nut className="size-6 text-chocolate" />,
  "The crunch": <Sparkles className="size-6 text-chocolate" />,
  "The sweetness": <Candy className="size-6 text-chocolate" />,
  "The freshness": <Leaf className="size-6 text-chocolate" />,
  "The staff": <Users className="size-6 text-chocolate" />,
  "The presentation": <Camera className="size-6 text-chocolate" />,
  "The overall taste": <Heart className="size-6 text-chocolate" />,
  "The experience": <PartyPopper className="size-6 text-chocolate" />,
};

export function LovedStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: LovedOption[];
  onChange: (v: LovedOption[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function toggle(opt: LovedOption) {
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-chocolate leading-tight">
          What did you love?
        </h2>
        <p className="text-cocoa">
          Pick everything that made your banana better.
        </p>
        {value.length > 0 ? (
          <p className="text-xs text-chocolate-soft font-semibold">
            {value.length} selected
          </p>
        ) : null}
      </header>

      <div
        role="group"
        aria-label="What you loved"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
      >
        {LOVED_OPTIONS.map((opt) => (
          <OptionCard
            key={opt}
            role="checkbox"
            compact
            selected={value.includes(opt)}
            onClick={() => toggle(opt)}
            title={opt}
            media={ICON_MAP[opt]}
          />
        ))}
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-2 pt-2">
        <SecondaryButton onClick={onBack} className="!w-auto px-4" icon={<ArrowLeft className="size-4" />}>
          Back
        </SecondaryButton>
        <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
      </div>
    </div>
  );
}
