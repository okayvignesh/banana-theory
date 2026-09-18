"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BrandImage } from "@/components/brand/BrandImage";
import { bananaAssets } from "@/lib/assets";
import { Heart } from "lucide-react";

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center flex flex-col items-center gap-6 pt-2">
      <div className="relative w-full max-w-[320px] aspect-square">
        <BrandImage
          src={bananaAssets.hero}
          alt="A chocolate-dipped banana"
          fill
          priority
          sizes="(max-width: 768px) 320px, 400px"
          className="object-contain drop-shadow-[0_20px_30px_rgba(58,31,22,0.15)]"
          fallback={
            <div className="w-full h-full rounded-full bg-banana grid place-items-center">
              <Heart className="size-24 text-chocolate" strokeWidth={1.5} />
            </div>
          }
        />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-chocolate leading-tight">
          A little feedback.
          <br />
          <span className="text-chocolate-soft">A lot of happiness.</span>
        </h1>
        <p className="text-cocoa text-base max-w-[36ch] mx-auto">
          Tell us how your banana experience was. It only takes a minute.
        </p>
      </div>

      <PrimaryButton onClick={onStart}>Let&rsquo;s do it</PrimaryButton>
      <p className="text-xs text-cocoa">
        Your feedback helps us make every bite better.
      </p>
    </div>
  );
}
