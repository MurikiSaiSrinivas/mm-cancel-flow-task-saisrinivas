// components/cards/CancelCard.tsx
import * as React from "react";
import { TwoColumnCard } from "@/components/ui/TowColumnCard";
import { CTA } from "@/components/ui/atoms/CTA";

type Props = {
  imageUrl?: string; // optional: in mobile it goes on top
  onYes?: () => void;
  onNo?: () => void;
  className?: string;
};

export default function CancelCard({ imageUrl, onYes, onNo, className }: Props) {
  return (
    <TwoColumnCard
      imageUrl={imageUrl}
      className={className}
      actions={
        <>
          <CTA variant="secondary" className="w-full" onClick={onYes}>
            Yes, I’ve found a job
          </CTA>
          <CTA variant="secondary" className="w-full" onClick={onNo}>
            Not yet – I’m still looking
          </CTA>
        </>
      }
    >
      <div className="space-y-3">
        <h2 className="font-sans text-[28px] md:text-[36px] font-[600] italic tracking-[-1.08px] text-gray-warm-800 leading-tight">
          Hey mate,<br />Quick one before you go.
        </h2>
        <h3 className="font-sans text-[28px] md:text-[32px] font-[600] italic tracking-[-1.08px] text-gray-warm-800">
          Have you found a job yet?
        </h3>
        <p className="text-gray-warm-700 font-sans font-[600] text-[14px] md:text-[16px] leading-[140%]">
          Whatever your answer, we just want to help you take the next step.
          With visa support, or by hearing how we can do better.
        </p>
      </div>
    </TwoColumnCard>
  );
}
