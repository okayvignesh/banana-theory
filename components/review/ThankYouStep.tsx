"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BrandImage } from "@/components/brand/BrandImage";
import { bananaAssets } from "@/lib/assets";
import { PartyPopper } from "lucide-react";

export function ThankYouStep({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, scale: 0.96 }}
      animate={reduce ? {} : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="text-center flex flex-col items-center gap-6 py-4"
    >
      <div className="relative w-[220px] aspect-square">
        <BrandImage
          src={bananaAssets.thankYou}
          alt=""
          fill
          sizes="220px"
          className="object-contain"
          fallback={
            <div className="w-full h-full rounded-full bg-banana grid place-items-center">
              <PartyPopper className="size-24 text-chocolate" strokeWidth={1.5} />
            </div>
          }
        />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-4xl font-bold text-chocolate">
          Thanks a bunch!
        </h1>
        <p className="text-cocoa">Your feedback means a lot to us.</p>
        <p className="text-cocoa text-sm">See you for your next banana.</p>
      </div>

      <PrimaryButton onClick={onDone} icon={false}>
        Done
      </PrimaryButton>
    </motion.div>
  );
}
