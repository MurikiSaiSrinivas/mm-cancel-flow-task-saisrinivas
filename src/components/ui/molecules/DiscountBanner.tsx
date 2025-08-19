import React from "react";
import { CTA } from "@/components/ui/atoms/CTA";

type DiscountBannerProps = {
    /** e.g. "50%" */
    discountLabel?: string;
    /** e.g. "$12.50" */
    discountedPrice?: string;
    /** e.g. "$25" */
    originalPrice?: string;
    /** CTA label text */
    ctaLabel?: string;
    /** Small helper text under CTA */
    helperText?: string;
    /** Banner wide mode class overrides */
    className?: string;
    /** Click handler */
    onClick?: () => void;
};

export default function DiscountBanner({
    discountLabel = "50%",
    discountedPrice = "$12.50",
    originalPrice = "$25",
    ctaLabel = "Get 50% off",
    helperText = "You won’t be charged until your next billing date.",
    className = "",
    onClick,
}: DiscountBannerProps) {
    return (
        <section
            className={[
                // banner container
                "flex flex-col items-start gap-4 p-3 md:p-4",
                "rounded-[12px] border bg-brand-purple-2", // #EBE1FE
                "border-brand-migrate-mate",               // brand border
                "self-stretch w-full",
                className,
            ].join(" ")}
            aria-label="Discount Banner"
        >
            {/* Header text */}
            <h3
                className={[
                    "h-[27px] self-stretch text-center",
                    "text-gray-warm-800 font-sans",
                    "text-[22px] md:text-[28px] font-semibold leading-none",
                    "tracking-[-0.035em]", // ~ -1.4px @ 40px; here scaled; exact per spec -1.4px @ 28px ~ -0.05em -> adjust visually if needed
                ].join(" ")}
            >
                Here’s{" "}
                <span
                    className={[
                        "underline decoration-solid",
                        // Tailwind v4 arbitrary properties for fine underline control
                        "[text-underline-offset:6%] [text-decoration-skip-ink:none]",
                    ].join(" ")}
                >
                    {discountLabel} off
                </span>{" "}
                until you find a job.
            </h3>

            {/* Price row */}
            <div className="flex items-end justify-center gap-[10px] self-stretch">
                {/* $12.50 / month */}
                <div className="flex items-end gap-1">
                    <span className="text-brand-migrate-mate text-[24px] font-sans font-semibold leading-none tracking-[-0.05em]">
                        {discountedPrice}
                    </span>
                    <span className="text-brand-migrate-mate text-[20px] font-sans font-semibold leading-none tracking-[-0.05em]">
                        /month
                    </span>
                </div>

                {/* $25 / month (struck through) */}
                <span className="text-gray-warm-700 text-[16px] font-sans font-normal leading-none tracking-[-0.05em] line-through">
                    {originalPrice}/month
                </span>
            </div>

            {/* CTA + helper text */}
            <div className="flex flex-col items-start gap-1 self-stretch">
                <CTA onClick={onClick} variant="success">{ctaLabel}</CTA>

                <p className="self-stretch text-center text-gray-warm-700 font-sans text-[12px] italic font-normal leading-none tracking-[-0.6px]">
                    {helperText}
                </p>
            </div>
        </section>
    );
}
