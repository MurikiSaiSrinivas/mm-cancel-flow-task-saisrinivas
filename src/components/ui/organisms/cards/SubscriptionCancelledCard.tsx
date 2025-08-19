import * as React from "react";
import { TwoColumnCard } from "@/components/ui/features/cancelflow/TowColumnCard";
import { CTA } from "@/components/ui/atoms/CTA";

type Props = {
    imageUrl?: string;
    /** e.g. "Oct 12, 2025" */
    endDate?: string;
    onBackToJobs?: () => void;
    className?: string;
};

export default function SubscriptionCancelledCard({
    imageUrl,
    endDate = "XX date",
    onBackToJobs,
    className = "",
}: Props) {
    return (
        <TwoColumnCard imageUrl={imageUrl} className={className} actions={
            < CTA variant="primary" className="w-full" onClick={onBackToJobs} aria-label="Back to Jobs">
                Back to Jobs
            </CTA>
        }>
            {/* Heading block */}
            <div className="flex flex-col gap-5">
                {/* 1. Sorry to see you go, mate. */}
                <h1
                    className={[
                        // mobile → 24 / desktop → 36
                        "text-gray-warm-800 font-sans font-[600] tracking-[-0.03em] leading-none",
                        "text-[24px] md:text-[36px]",
                    ].join(" ")}
                >
                    Sorry to see you go, mate.
                </h1>

                {/* 2. Thanks for being with us... */}
                <h2
                    className={[
                        // mobile → 18 / desktop → 30
                        "text-gray-warm-800 font-sans font-[600] leading-none",
                        "text-[18px] md:text-[30px]",
                        "tracking-[-0.9px] md:tracking-[-0.9px]",
                    ].join(" ")}
                >
                    Thanks for being with us, and you’re always welcome back.
                </h2>
            </div>

            {/* 3 & 4. Details copy (Inter) */}
            <div className="flex flex-col gap-5 mt-5">
                <p
                    className={[
                        "text-gray-warm-700 font-inter leading-none",
                        // mobile & desktop: 16 / 600
                        "text-[16px] font-[600] tracking-[-0.8px]",
                    ].join(" ")}
                >
                    Your subscription is set to end on {endDate}.
                    <br></br><span className="mt-2">You’ll still have full access until then. No further charges after that.</span>
                </p>

                <p
                    className={[
                        "text-gray-warm-700 font-inter leading-none",
                        // mobile & desktop: 16 / 400
                        "text-[16px] font-[400] tracking-[-0.8px]",
                    ].join(" ")}
                >
                    Changed your mind? You can reactivate anytime before your end date.
                </p>
            </div>


        </TwoColumnCard >
    );
}
