"use client";

import { Star } from "lucide-react";
import { useState } from "react";

type Props = {
  value: number;
  onChange: (n: number) => void;
};

export function StarRating({ value, onChange }: Props) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div
      role="radiogroup"
      aria-label="Rate your banana"
      className="flex items-center justify-center gap-2"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            className="p-2 rounded-full transition-transform active:scale-90"
          >
            <Star
              className={
                "size-9 transition-colors " +
                (filled ? "fill-star text-star" : "text-border")
              }
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
