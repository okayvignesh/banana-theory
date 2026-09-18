"use client";

import Image, { ImageProps } from "next/image";
import { useState, type ReactNode } from "react";

type Props = Omit<ImageProps, "onError"> & {
  fallback?: ReactNode;
};

// Missing-file safe wrapper: if the asset 404s, render the fallback so the UI stays intact.
export function BrandImage({ fallback, alt, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed && fallback) return <>{fallback}</>;
  return <Image {...props} alt={alt} onError={() => setFailed(true)} />;
}
