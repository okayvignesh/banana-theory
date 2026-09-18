"use client";

import { Check } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  selected: boolean;
  onClick: () => void;
  role?: "radio" | "checkbox";
  title: string;
  description?: string;
  media?: ReactNode;
  compact?: boolean;
};

export function OptionCard({
  selected,
  onClick,
  role = "radio",
  title,
  description,
  media,
  compact,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      role={role}
      aria-checked={selected}
      className={
        "group relative w-full text-left rounded-2xl border transition-all " +
        "flex items-center gap-3 " +
        (compact ? "p-3 " : "p-4 ") +
        "min-h-[64px] " +
        (selected
          ? "bg-banana border-chocolate shadow-soft "
          : "bg-white border-border hover:border-chocolate-soft ")
      }
    >
      {media ? (
        <div
          className={
            "shrink-0 rounded-xl bg-cream grid place-items-center overflow-hidden " +
            (compact ? "size-10" : "size-12")
          }
        >
          {media}
        </div>
      ) : null}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-chocolate leading-tight truncate">
          {title}
        </div>
        {description ? (
          <div className="text-sm text-cocoa mt-0.5 leading-snug">
            {description}
          </div>
        ) : null}
      </div>
      <div
        className={
          "shrink-0 size-6 rounded-full grid place-items-center transition-all " +
          (selected
            ? "bg-chocolate text-white"
            : "border border-border text-transparent")
        }
        aria-hidden
      >
        <Check className="size-4" strokeWidth={3} />
      </div>
    </button>
  );
}
