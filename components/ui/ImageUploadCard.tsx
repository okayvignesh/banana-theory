"use client";

import { Camera, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import type { PhotoType } from "@/lib/review-types";

type Props = {
  photoType: PhotoType;
  onUploaded: (url: string) => void;
  onCleared: () => void;
  currentUrl?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function ImageUploadCard({
  photoType,
  onUploaded,
  onCleared,
  currentUrl,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              className="w-full h-full object-cover"
            />
            {busy ? (
              <div className="absolute inset-0 grid place-items-center bg-chocolate/40 text-white text-sm">
                Uploading…
              </div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 text-sm text-chocolate font-semibold px-3 py-2 rounded-full border border-border hover:bg-cream"
            >
              <Trash2 className="size-4" /> Remove
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 text-sm text-chocolate font-semibold px-3 py-2 rounded-full border border-border hover:bg-cream"
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
