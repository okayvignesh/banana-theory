"use client";

import { OptionCard } from "@/components/ui/OptionCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { BrandImage } from "@/components/brand/BrandImage";
import { bananaAssets } from "@/lib/assets";
import type { Impression } from "@/lib/review-types";
import { ArrowLeft, Heart, Smile, Meh, Frown } from "lucide-react";

const OPTIONS: {
  value: Impression;
  title: string;
  description: string;
  fallback: React.ReactNode;
  asset: keyof typeof bananaAssets;
}[] = [
  {
    value: "banana-nomenal",
    title: "Banana-nomenal",
    description: "Absolutely loved it!",
    asset: "reactionLove",
    fallback: <Heart className="size-7 text-chocolate" />,
  },
  {
    value: "pretty-sweet",
    title: "Pretty sweet",
    description: "Really enjoyed it.",
    asset: "reactionSweet",
    fallback: <Smile className="size-7 text-chocolate" />,
  },
  {
    value: "not-bad",
    title: "Not bad",
    description: "Could be better.",
    asset: "reactionOk",
    fallback: <Meh className="size-7 text-chocolate" />,
  },
  {
    value: "needs-a-tweak",
    title: "Needs a tweak",
    description: "Tell us what to improve.",
    asset: "reactionMeh",
    fallback: <Frown className="size-7 text-chocolate" />,
  },
];

export function ImpressionStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: Impression | null;
  onChange: (v: Impression) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-chocolate leading-tight">
          How was your banana?
        </h2>
        <p className="text-cocoa">Choose the one that feels right.</p>
      </header>

      <div role="radiogroup" aria-label="First impression" className="grid gap-2.5">
        {OPTIONS.map((o) => (
          <OptionCard
            key={o.value}
            selected={value === o.value}
            onClick={() => onChange(o.value)}
            title={o.title}
            description={o.description}
            media={
              <BrandImage
                src={bananaAssets[o.asset]}
                alt=""
                width={48}
                height={48}
                className="object-contain"
                fallback={o.fallback}
              />
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-2 pt-2">
        <SecondaryButton onClick={onBack} className="!w-auto px-4" icon={<ArrowLeft className="size-4" />}>
          Back
        </SecondaryButton>
        <PrimaryButton onClick={onNext} disabled={!value}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
