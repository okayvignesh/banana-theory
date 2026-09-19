"use client";

import { Camera, LoaderCircle, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PhotoType } from "@/lib/review-types";

type Props = {
  photoType: PhotoType;
  onUploaded: (url: string) => void;
  onCleared: () => void;
  onBusyChange?: (busy: boolean) => void;
  currentUrl?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function ImageUploadCard({
  photoType,
  onUploaded,
  onCleared,
  onBusyChange,
  currentUrl,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  async function handleFile(file: File) {
    setError(null);
    if (!ALLOWED.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is a little too large. Please choose an image under 5 MB.");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("photoType", photoType);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text().catch(() => "Upload failed"));
      const data = (await res.json()) as { url: string };
      onUploaded(data.url);
    } catch (e) {
      setError("Upload didn't go through. Please try again.");
      setPreview(null);
      onCleared();
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setPreview(null);
    setError(null);
    onCleared();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      {preview ? (
        <div className="space-y-3">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Your upload"
              className={
                "w-full h-full object-cover transition-all " +
                (busy ? "blur-sm scale-[1.02]" : "")
              }
            />
            {busy ? (
              <div
                role="status"
                aria-live="polite"
                className="absolute inset-0 grid place-items-center bg-chocolate/60 backdrop-blur-[2px]"
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <LoaderCircle
                    className="size-8 animate-spin"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <div className="text-sm font-semibold">Uploading your photo…</div>
                  <div className="text-xs text-white/80">Hang tight, just a sec.</div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clear}
              disabled={busy}
              className="inline-flex items-center gap-2 text-sm text-chocolate font-semibold px-3 py-2 rounded-full border border-border hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="size-4" /> Remove
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 text-sm text-chocolate font-semibold px-3 py-2 rounded-full border border-border hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="size-4" /> Change
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-8 rounded-xl border-2 border-dashed border-border hover:border-chocolate-soft grid place-items-center gap-2 text-cocoa"
        >
          <Upload className="size-6 text-chocolate-soft" />
          <span className="text-sm font-medium">Tap to upload</span>
          <span className="text-xs">JPG · PNG · WebP · up to 5 MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {error ? (
        <p role="alert" className="text-danger text-sm mt-3">
          {error}
        </p>
      ) : null}
      <p className="text-xs text-cocoa mt-3">
        Your photo is only used to understand your feedback.
      </p>
    </div>
  );
}
