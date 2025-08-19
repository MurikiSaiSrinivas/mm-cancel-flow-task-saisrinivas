// components/cards/OfferCard.tsx
import * as React from "react";
import { TwoColumnCard } from "@/components/ui/features/cancelflow/TowColumnCard";
import { CTA } from "@/components/ui/atoms/CTA";
import DiscountBanner from "@/components/ui/molecules/DiscountBanner";

type Props = {
  imageUrl?: string;
  headline?: string;      // e.g. "Here’s 50% off..." or "Stay for $10 less..."
  priceWas?: string;      // e.g. "$25.00"
  priceNow?: string;      // e.g. "$12.50" or "$15.00"
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
};

export default function OfferCard({
  imageUrl,
  headline,
  priceWas,
  priceNow,
  onAccept,
  onDecline,
  className,
}: Props) {
  return (
    <TwoColumnCard
      imageUrl={imageUrl}
      className={className}
      banner={
        <DiscountBanner
          headline={headline}               // NEW: use the computed headline
          discountedPrice={priceNow}        // NEW
          originalPrice={priceWas}          // NEW
          ctaLabel="Accept offer"
          onClick={onAccept}
        />
      }
      actions={
        <CTA variant="secondary" className="w-full" onClick={onDecline}>
          No thanks
        </CTA>
      }
      needImageInMobile={false}
    >
      {/* Optional: keep or simplify body copy */}
      <div className="space-y-3">
        <h2 className="font-sans text-[28px] md:text-[36px] font-[600] tracking-[-1.08px] text-gray-warm-800 leading-tight">
          We built this to help you land the job, this makes it a little easier.
        </h2>
        <p className="md:text-gray-warm-700 md:font-sans md:font-[600] md:text-[16px] md:leading-[140%] hidden md:block">
          We’ve been there and we’re here to help you.
        </p>
      </div>
    </TwoColumnCard>
  );
}
