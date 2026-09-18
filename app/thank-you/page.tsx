"use client";

import { BananaLogo } from "@/components/brand/BananaLogo";
import { BrandDecorations } from "@/components/brand/BrandDecorations";
import { ThankYouStep } from "@/components/review/ThankYouStep";

export default function ThankYouPage() {
  return (
    <main className="relative min-h-dvh flex flex-col items-center px-4 pt-6 pb-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <BrandDecorations />
      </div>
      <div className="relative w-full max-w-[560px] flex flex-col gap-6">
        <BananaLogo />
        <section className="rounded-3xl bg-white/70 border border-border shadow-card p-5 sm:p-7">
          <ThankYouStep onDone={() => (window.location.href = "/")} />
        </section>
      </div>
    </main>
  );
}
