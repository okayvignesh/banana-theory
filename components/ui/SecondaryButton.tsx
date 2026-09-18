"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode };

export function SecondaryButton({
  children,
  icon,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={
        "inline-flex w-full h-13 min-h-[52px] items-center justify-center gap-2 rounded-full " +
        "bg-white text-chocolate font-semibold px-6 border border-border " +
        "transition-all active:scale-[0.98] hover:bg-cream " +
        "disabled:opacity-50 disabled:cursor-not-allowed " +
        className
      }
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
