"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  icon?: ReactNode | false;
};

export function PrimaryButton({
  children,
  loading,
  icon,
  className = "",
  disabled,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;
  const rightIcon =
    icon === false ? null : loading ? (
      <LoaderCircle className="size-5 animate-spin" aria-hidden />
    ) : (
      icon ?? <ArrowRight className="size-5" aria-hidden />
    );

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={
        "inline-flex w-full h-13 min-h-[52px] items-center justify-center gap-2 rounded-full " +
        "bg-chocolate text-white font-semibold px-6 " +
        "transition-all active:scale-[0.98] hover:bg-chocolate-dark " +
        "disabled:opacity-50 disabled:cursor-not-allowed shadow-soft " +
        className
      }
    >
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}
