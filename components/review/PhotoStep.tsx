"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { ImageUploadCard } from "@/components/ui/ImageUploadCard";
import type { PhotoType } from "@/lib/review-types";
import { ArrowLeft, Banana, Users } from "lucide-react";

export function PhotoStep({
  photoUrl,
  photoType,
  onChange,
  onNext,
  onBack,
  onSkip,
}: {
  photoUrl?: string;
  photoType?: PhotoType;
  onChange: (patch: { photoUrl?: string; photoType?: PhotoType }) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const [choice, setChoice] = useState<PhotoType | null>(
    photoType ?? (photoUrl ? "banana" : null)
  );
  const [uploading, setUploading] = useState(false);

  function pick(t: PhotoType) {
    setChoice(t);
    onChange({ photoType: t });
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-chocolate leading-tight">
          Share your banana moment
        </h2>
        <p className="text-cocoa">
          Got a delicious picture? We&rsquo;d love to see it.
        </p>
      </header>

      {!choice ? (
        <div className="grid gap-2.5">
          <ChoiceCard
            title="My banana"
            description="Upload a picture of the banana you purchased."
            icon={<Banana className="size-6 text-chocolate" />}
            onClick={() => pick("banana")}
          />
          <ChoiceCard
            title="With our team"
            description="Upload a selfie with our team."
            icon={<Users className="size-6 text-chocolate" />}
            onClick={() => pick("team")}
          />
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-cocoa text-sm underline underline-offset-4 py-2 hover:text-chocolate"
          >
            Skip photo — continue without uploading
          </button>
        </div>
      ) : (
        <>
          <ImageUploadCard
            photoType={choice}
            currentUrl={photoUrl}
            onUploaded={(url) => onChange({ photoUrl: url, photoType: choice })}
            onCleared={() => onChange({ photoUrl: undefined })}
            onBusyChange={setUploading}
          />
          <button
            type="button"
            onClick={() => {
              setChoice(null);
              onChange({ photoUrl: undefined, photoType: undefined });
            }}
            disabled={uploading}
            className="text-cocoa text-sm underline underline-offset-4 hover:text-chocolate disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Change photo type
          </button>
        </>
      )}

      <div className="grid grid-cols-[auto,1fr] gap-2 pt-2">
        <SecondaryButton
          onClick={onBack}
          disabled={uploading}
          className="!w-auto px-4"
          icon={<ArrowLeft className="size-4" />}
        >
          Back
        </SecondaryButton>
        <PrimaryButton
          onClick={onNext}
          loading={uploading}
          disabled={uploading}
        >
          {uploading
            ? "Uploading photo…"
            : photoUrl
            ? "Continue"
            : "Skip & continue"}
        </PrimaryButton>
      </div>
    </div>
  );
}

function ChoiceCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-2xl bg-white border border-border p-4 flex items-center gap-3 hover:border-chocolate-soft transition-all"
    >
      <div className="shrink-0 size-12 rounded-xl bg-cream grid place-items-center">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-chocolate">{title}</div>
        <div className="text-sm text-cocoa">{description}</div>
      </div>
    </button>
  );
}
