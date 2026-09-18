import { bananaAssets } from "@/lib/assets";
import { BrandImage } from "./BrandImage";

// Logo image is a full wordmark (banana mark + "banana theory"). Render it
// standalone at a wider aspect so we don't duplicate the wordmark in typed text.
export function BananaLogo({ height = 44 }: { height?: number }) {
  const width = Math.round(height * (316 / 282)); // native ratio of logo-cocoa/transparent

  return (
    <div className="flex items-center">
      <BrandImage
        src={bananaAssets.logo}
        alt="Banana Theory"
        width={width * 2}
        height={height * 2}
        priority
        style={{ height, width: "auto" }}
        className="object-contain"
        fallback={
          <div className="leading-tight">
            <div
              className="font-display font-bold text-chocolate tracking-tight lowercase"
              style={{ fontSize: height * 0.55 }}
            >
              banana theory
            </div>
            <div className="text-[10px] tracking-[0.18em] text-cocoa uppercase font-medium">
              Banana. But better.
            </div>
          </div>
        }
      />
    </div>
  );
}
